import { z } from 'zod'
import { Track, TrackSchema } from './Track'

export const UserTrackSchema = TrackSchema.extend({
	userId: z.string(),
	public: z.boolean()
})

export class UserTrack extends Track {
	userId: string

	#public: boolean = false
	get public() {
		return this.#public
	}

	set public(value: boolean) {
		this.#public = value
		this.emit('change', this)
	}

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
		this.#public = parsed.public
		super.setFromData(parsed)
		return this
	}

	public clone() {
		const cloned = new UserTrack(this.userId)
		cloned.setFromData(JSON.parse(JSON.stringify(this)))
		cloned.trackId = `Track-${Math.random().toString(36).substring(2, 9)}`
		return cloned
	}

	toJSON() {
		return {
			...super.toJSON(),
			userId: this.userId,
			public: this.public
		}
	}
}
