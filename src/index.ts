import Bot from "./requests/bot";
import { ImageFetchRequest } from "./types/imageFetchRequest";
import { ReqData } from "./types/reqData";
import { TelegramPhotoSize } from "./types/telegram";

export interface Env {
	ASSETS_STORE: R2Bucket;
	IMAGE_FETCH_QUEUE: Queue<ImageFetchRequest>;
	AVATAR_META: KVNamespace;
}

export default {
	async fetch(req: Request, env: Env): Promise<Response> {
		const data = await req.json() as ReqData
		const bot = new Bot(data.botToken)
		switch (data.type) {
			case "batchFetchAvatar": {
				for (const userId of data.userIds) {
					console.log(userId)
					try {
						await env.AVATAR_META.put(`updateTime:${userId}`, new Date().getTime().toString());
						const avatarReq = await bot.getUserProfilePhotos(userId, 0, 1);
						const avatars = (await avatarReq.json()) as any;
						console.log(avatars);
						if (!avatars.result.total_count) continue

						const avatar = avatars.result.photos[0][
							avatars.result.photos[0].length - 1
						] as TelegramPhotoSize;
						await env.AVATAR_META.put(`photoId:${userId}`, avatar.file_id);

						await env.IMAGE_FETCH_QUEUE.send({
							type: 'image',
							botToken: data.botToken,
							fileId: avatar.file_id
						})
					}
					catch (e) {
						console.log(e)
					}
				}
				break
			}
			case "batchFetchImage": {
				await env.IMAGE_FETCH_QUEUE.sendBatch(data.fileIds.map(fileId => ({
					body: {
						botToken: data.botToken,
						fileId,
						type: 'image'
					}
				})))
				break
			}
		}
		return new Response('ok')
	},
	async queue(batch: MessageBatch<ImageFetchRequest>, env: Env): Promise<void> {
		for (let message of batch.messages) {
			console.log(message.body)
			try {
				if (await env.ASSETS_STORE.head(`files/${message.body.fileId}`)) {
					console.log('file exists')
					message.ack()
					continue;
				}
				const bot = new Bot(message.body.botToken)
				const fileUrl = await bot.getFile(message.body.fileId)
				const file = await fetch(fileUrl);
				await env.ASSETS_STORE.put(`files/${message.body.fileId}`, file.body)
			}
			catch (e) {
				console.log(e)
				message.retry()
			}
		}
	},
};
