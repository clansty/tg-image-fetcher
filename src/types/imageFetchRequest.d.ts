export type ImageFetchRequest = {
	botToken: string,
} & ({
	type: 'image',
	fileId: string
} | {
	type: 'avatar',
	userId: number
})
