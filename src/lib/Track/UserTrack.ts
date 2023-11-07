import { z, type TypeOf } from 'zod'
import { TrackRecord, TrackRecordSchema } from '../TrackRecord/TrackRecord'
import { SessionManager } from '../nakama/SessionManager'
import { Track, TrackSchema } from './Track'

export const UserTrackSchema = TrackSchema.extend({
	userId: z.string(),
	public: z.boolean(),
	userTrackRecord: TrackRecordSchema.optional(),
	thumbnailUrl: z.string().optional()
})

export class UserTrack extends Track {
	isUserTrack: true = true
	userTrackRecord?: TrackRecord
	userId: string
	public = false
	thumbnailUrl?: string

	constructor(userId: string) {
		super()
		this.userId = userId
	}

	toJSON(): TypeOf<typeof UserTrackSchema> {
		return {
			...super.toJSON(),
			userId: this.userId,
			public: this.public,
			userTrackRecord: this.userTrackRecord?.toJSON(),
			thumbnailUrl: this.thumbnailUrl
		}
	}

	public static fromData(data: any) {
		const parsed = UserTrackSchema.parse(data)
		const userTrack = new UserTrack(parsed.userId)
		userTrack.setFromData(parsed)
		return userTrack
	}

	public setFromData(data: any) {
		const parsed = UserTrackSchema.parse(data)
		super.setFromData(parsed)
		this.userId = parsed.userId
		this.public = parsed.public
		this.userTrackRecord = parsed.userTrackRecord
			? TrackRecord.fromData(parsed.userTrackRecord)
			: undefined
		this.thumbnailUrl = parsed.thumbnailUrl

		console.log(this.thumbnailUrl)
		return this
	}

	public remix() {
		if (!SessionManager.userId) throw new Error('User not logged in')
		const cloned = new UserTrack('')
		cloned.setFromData(JSON.parse(JSON.stringify(this)))
		cloned.trackName = `${this.trackName} (Remix)`
		cloned.userTrackRecord = undefined
		cloned.trackId = `Track-${Math.random().toString(36).substring(2, 9)}`
		cloned.userId = SessionManager.userId
		return cloned
	}
}
