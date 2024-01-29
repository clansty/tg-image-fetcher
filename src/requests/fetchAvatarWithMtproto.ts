import { TelegramClient } from "telegram";
import { MemorySession } from "telegram/sessions";

let telegram: TelegramClient;

const init = async (botToken: string, apiId: number, apiHash: string) => {
	telegram = new TelegramClient(new MemorySession(), apiId, apiHash, {});
	await telegram.start({
		botAuthToken: botToken,
	});
}

export default async (botToken: string, apiId: number, apiHash: string, userId: number) => {
	if (!telegram) {
		await init(botToken, apiId, apiHash);
	}
	return await telegram.downloadProfilePhoto(userId, { isBig: true });
}
