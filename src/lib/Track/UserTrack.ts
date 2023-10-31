import { z } from 'zod'
import { Track, TrackSchema } from './Track'

export const UserTrackSchema = TrackSchema.extend({
	userId: z.string()
})

export class UserTrack extends Track {
	userId: string

	constructor(userId: string) {
		super()
		this.userId = userId
	}

	public static fromData(data: any) {
		const parsed = UserTrackSchema.parse(data)
		const userTrack = new UserTrack(parsed.userId)
		userTrack.setFromData(parsed)
		return userTrack
	}

	public setFromData(data: any) {
		const parsed = UserTrackSchema.parse(data)
		this.userId = parsed.userId
		super.setFromData(parsed)
		return this
	}

	public clone() {
		const cloned = new UserTrack(this.userId)
		cloned.setFromData(JSON.parse(JSON.stringify(this)))
		cloned.trackId = `Track-${Math.random().toString(36).substring(2, 9)}`
		return cloned
	}
}
