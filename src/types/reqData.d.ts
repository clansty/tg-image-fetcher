export type ReqData =
	{ botToken: string } & (
		{
			type: 'batchFetchAvatar',
			userIds: number[]
		} | {
			type: 'batchFetchImage',
			fileIds: string[]
		}
	)
