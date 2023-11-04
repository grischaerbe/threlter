import type { trackElementPrototypes } from '$components/TrackElements/elements'
import type { EulerOrder, Vector3Tuple } from 'three'
import z, { type TypeOf } from 'zod'
import { Dispatcher } from './Dispatcher'
import { TrackData, TrackDataSchema } from './TrackData'

export type TrackElementType = keyof typeof trackElementPrototypes

export const TrackSchema = z.object({
	trackId: z.string(),
	trackName: z.string(),
	trackData: TrackDataSchema,
	trackTimes: z.object({
		gold: z.number(),
		silver: z.number(),
		bronze: z.number()
	}),
	trackRespawns: z.object({
		gold: z.number(),
		silver: z.number(),
		bronze: z.number()
	})
})

type Events = {
	change: any
}

export class Track extends Dispatcher<Events> {
	isTrack: true = true

	trackId = `Track-${Math.random().toString(36).substring(2, 9)}`
	trackData = new TrackData()
	trackName = ''

	trackTimes = {
		gold: 0,
		silver: 0,
		bronze: 0
	}

	public toJSON(): TypeOf<typeof TrackSchema> {
		return {
			trackId: this.trackId,
			trackName: this.trackName,
			trackData: this.trackData.toJSON(),
			trackTimes: this.trackTimes,
			trackRespawns: this.trackTimes
		}
	}

	public setFromData(data: any) {
		const parsed = TrackSchema.parse(data)

		this.trackId = parsed.trackId
		this.trackName = parsed.trackName

		this.trackTimes = {
			gold: parsed.trackTimes.gold ?? 0,
			silver: parsed.trackTimes.silver ?? 0,
			bronze: parsed.trackTimes.bronze ?? 0
		}

		this.trackData.setFromData(parsed.trackData)

		return this
	}

	public remix() {
		const cloned = new Track()
		cloned.setFromData(JSON.parse(JSON.stringify(this)))
		cloned.trackId = `Track-${Math.random().toString(36).substring(2, 9)}`
		return cloned
	}

	public addTrackElement(type: TrackElementType) {
		const trackElement = this.trackData.addTrackElement(type)
		this.emitter.emit('change')
		return trackElement
	}

	public removeTrackElement(id: string) {
		this.trackData.removeTrackElement(id)
		this.emitter.emit('change')
	}

	public duplicateTrackElement(id: string) {
		const trackElement = this.trackData.duplicateTrackElement(id)
		this.emitter.emit('change')
		return trackElement
	}

	public setTrackElementType = (id: string, type: TrackElementType) => {
		this.trackData.setTrackElementType(id, type)
		this.emitter.emit('change')
	}

	public setTrackElementPosition = (id: string, position: Vector3Tuple) => {
		this.trackData.setTrackElementPosition(id, position)
		this.emitter.emit('change')
	}

	public setTrackElementRotation = (
		id: string,
		rotation: [x: number, y: number, z: number, order: EulerOrder]
	) => {
		this.trackData.setTrackElementRotation(id, rotation)
		this.emitter.emit('change')
	}
}
