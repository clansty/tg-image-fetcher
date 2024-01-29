import Bot from "./requests/bot";
import fetchAvatarWithMtproto from "./requests/fetchAvatarWithMtproto";
import { ImageFetchRequest } from "./types/imageFetchRequest";
import { ReqData } from "./types/reqData";
import { TelegramPhotoSize } from "./types/telegram";

export interface Env {
	ASSETS_STORE: R2Bucket;
	IMAGE_FETCH_QUEUE: Queue<ImageFetchRequest>;
	AVATAR_META: KVNamespace;
	API_ID: string;
	API_HASH: string;
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
						const avatarReq = await bot.getUserProfilePhotos(userId, 0, 1);
						const avatars = (await avatarReq.json()) as any;
						console.log(avatars);
						if (!avatars.result.total_count) {
							try {
								const avatar = await fetchAvatarWithMtproto(data.botToken, Number(env.API_ID), env.API_HASH, userId) as Buffer;
								await env.AVATAR_META.put(`photoId:${userId}`, `fallbackAvatar-${userId}`);
								await env.ASSETS_STORE.put(`files/fallbackAvatar-${userId}`, avatar);
							}
							catch (e) {
								console.log(e);
							}
							continue;
						}

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
				const bot = new Bot(message.body.botToken)
				let fileId: string;
				switch (message.body.type) {
					case 'image':
						fileId = message.body.fileId
						break;
					case "avatar":
						console.log('获取头像文件 ID', message.body.userId)
						const avatarReq = await bot.getUserProfilePhotos(message.body.userId, 0, 1);
						const avatars = (await avatarReq.json()) as any;
						console.log(avatars);
						if (!avatars.result.total_count) {
							console.log('无头像', message.body.userId)
							message.ack()
							continue
						}

						const avatar = avatars.result.photos[0][
							avatars.result.photos[0].length - 1
						] as TelegramPhotoSize;
						await env.AVATAR_META.put(`photoId:${message.body.userId}`, avatar.file_id);

						fileId = avatar.file_id
						break;
				}
				if (await env.ASSETS_STORE.head(`files/${fileId}`)) {
					console.log('file exists')
					message.ack()
					continue;
				}
				console.log('获取文件', fileId)
				const fileUrl = await bot.getFile(fileId)
				const file = await fetch(fileUrl);
				await env.ASSETS_STORE.put(`files/${fileId}`, file.body as ReadableStream)
				message.ack()
			}
			catch (e) {
				console.log(e)
				message.retry()
			}
		}
	},
};
