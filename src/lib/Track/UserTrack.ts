import { z, type TypeOf } from 'zod'
import { Track, TrackSchema } from './Track'
import { TrackRecordSchema, TrackRecord } from '../TrackRecord/TrackRecord'
import { nakama } from '../nakama'

export const UserTrackSchema = TrackSchema.extend({
	userId: z.string(),
	public: z.boolean(),
	userTrackRecord: TrackRecordSchema.optional()
})

export class UserTrack extends Track {
	isUserTrack: true = true
	userTrackRecord?: TrackRecord
	userId: string
	public = false

	constructor(userId: string) {
		super()
		this.userId = userId
	}

	toJSON(): TypeOf<typeof UserTrackSchema> {
		return {
			...super.toJSON(),
			userId: this.userId,
			public: this.public,
			userTrackRecord: this.userTrackRecord?.toJSON()
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
		return this
	}

	public clone() {
		if (!nakama.session.current?.user_id) throw new Error('User not logged in')
		const cloned = new UserTrack(this.userId)
		cloned.setFromData(JSON.parse(JSON.stringify(this)))
		cloned.trackId = `Track-${Math.random().toString(36).substring(2, 9)}`
		cloned.userTrackRecord = undefined
		cloned.userId = nakama.session.current.user_id
		return cloned
	}
}
