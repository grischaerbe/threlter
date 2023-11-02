import type { trackElementPrototypes } from '$components/TrackElements/elements'
import type { EulerOrder, Vector3Tuple } from 'three'
import z, { type TypeOf } from 'zod'
import { Dispatcher } from './Dispatcher'
import { TrackData, TrackDataSchema } from './TrackData'
import { cyrb53 } from './utils/hash'

// replace with "string" on the server
export type TrackElementType = keyof typeof trackElementPrototypes

export const TrackSchema = z.object({
	trackId: z.string(),
	trackName: z.string(),
	authorName: z.string(),
	userId: z.string(),
	trackData: TrackDataSchema,
	trackTimes: z.object({
		author: z.number(),
		gold: z.number(),
		silver: z.number(),
		bronze: z.number()
	}),
	trackRespawns: z.object({
		author: z.number(),
		gold: z.number(),
		silver: z.number(),
		bronze: z.number()
	}),
	validated: z.boolean(),
	validationId: z.string()
})

type Events = {
	validate: void
	invalidate: void
	change: any
}

export class Track extends Dispatcher<Events> {
	isTrack: true = true

	trackId = `Track-${Math.random().toString(36).substring(2, 9)}`

	trackData = new TrackData()

	trackName = ''
	authorName = ''
	validated = false

	trackTimes = {
		author: 0,
		gold: 0,
		silver: 0,
		bronze: 0
	}

	validationId = ''

	public toJSON(): TypeOf<typeof TrackSchema> {
		return {
			trackId: this.trackId,
			trackName: this.trackName,
			authorName: this.authorName,
			userId: '',
			trackData: this.trackData.toJSON(),
			trackTimes: this.trackTimes,
			trackRespawns: this.trackTimes,
			validated: this.validated,
			validationId: this.validationId
		}
	}

	/**
	 * The validation id is a hash of all track elements. It is used to invalidate
	 * track records when the track changed. The elements are sorted by
	 * their contents to ensure that the order of the elements does not matter.
	 */
	private calculateValidationId() {
		const numbersToString = (args: (number | string)[]) => {
			return args.map((arg) => (typeof arg === 'number' ? arg.toFixed(8) : arg)).join(':')
		}
		const trackElementsStringRepresentation = this.trackData.trackElements
			.map((trackElement) => {
				const position = numbersToString(trackElement.position)
				const rotation = numbersToString(trackElement.rotation)
				return `${String(trackElement.type)}:${position}:${rotation}`
			})
			.sort((a, b) => {
				return a.localeCompare(b)
			})
			.join(',')
		return cyrb53(trackElementsStringRepresentation).toString(16)
	}

	public validate(authorTime: number) {
		this.validationId = this.calculateValidationId()
		this.trackTimes.author = authorTime
		this.validated = true
		this.emitter.emit('validate')
	}

	public invalidate() {
		this.validated = false
		this.validationId = ''
		this.trackTimes.author = 0
		this.emitter.emit('invalidate')
	}

	public setFromData(data: any) {
		const parsed = TrackSchema.parse(data)

		this.trackId = parsed.trackId
		this.trackName = parsed.trackName
		this.authorName = parsed.authorName

		this.trackTimes = {
			author: parsed.trackTimes.author ?? 0,
			gold: parsed.trackTimes.gold ?? 0,
			silver: parsed.trackTimes.silver ?? 0,
			bronze: parsed.trackTimes.bronze ?? 0
		}

		this.validated = parsed.validated
		this.validationId = parsed.validationId

		this.trackData.setFromData(parsed.trackData)

		return this
	}

	public clone() {
		const cloned = new Track()
		cloned.setFromData(JSON.parse(JSON.stringify(this)))
		cloned.trackId = `Track-${Math.random().toString(36).substring(2, 9)}`
		return cloned
	}

	public addTrackElement(type: TrackElementType) {
		if (this.validated) {
			console.warn('Cannot add track element to validated track!')
			return
		}
		const trackElement = this.trackData.addTrackElement(type)
		this.emitter.emit('change')
		return trackElement
	}

	public removeTrackElement(id: string) {
		if (this.validated) {
			console.warn('Cannot remove track element from validated track!')
			return
		}
		this.trackData.removeTrackElement(id)
		this.emitter.emit('change')
	}

	public duplicateTrackElement(id: string) {
		if (this.validated) {
			console.warn('Cannot duplicate track element of validated track!')
			return
		}
		const trackElement = this.trackData.duplicateTrackElement(id)
		this.emitter.emit('change')
		return trackElement
	}

	public setTrackElementType = (id: string, type: TrackElementType) => {
		if (this.validated) {
			console.warn('Cannot set track element type of validated track!')
			return
		}
		this.trackData.setTrackElementType(id, type)
		this.emitter.emit('change')
	}

	public setTrackElementPosition = (id: string, position: Vector3Tuple) => {
		if (this.validated) {
			console.warn('Cannot set track element position of validated track!')
			return
		}
		this.trackData.setTrackElementPosition(id, position)
		this.emitter.emit('change')
	}

	public setTrackElementRotation = (
		id: string,
		rotation: [x: number, y: number, z: number, order: EulerOrder]
	) => {
		if (this.validated) {
			console.warn('Cannot set track element rotation of validated track!')
			return
		}
		this.trackData.setTrackElementRotation(id, rotation)
		this.emitter.emit('change')
	}
}
