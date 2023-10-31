import type { trackElementPrototypes } from '$components/TrackElements/elements'
import mitt, { type Emitter } from 'mitt'
import type { Readable } from 'svelte/store'
import type { EulerOrder, Vector3Tuple } from 'three'
import z from 'zod'
import { cyrb53 } from '../utils/hash'
import { jsonCurrentWritable, type JsonCurrentWritable } from '../utils/jsonCurrentWritable'
import { TrackData, TrackDataSchema } from './TrackData'

export type JsonCurrentReadable<T> = Readable<T> & {
	current: T
	toJSON: () => T
}

export type TrackElementType = keyof typeof trackElementPrototypes

/**
 * This provides only type-safety and will not complain if the store is actually set!
 */
export const jsonCurrentReadable = <T>(
	jsonCurrentWritable: JsonCurrentWritable<T>
): JsonCurrentReadable<T> => {
	return jsonCurrentWritable
}

class TrackTimes {
	public author: JsonCurrentWritable<number> = jsonCurrentWritable(0)
	public gold: JsonCurrentWritable<number> = jsonCurrentWritable(0)
	public silver: JsonCurrentWritable<number> = jsonCurrentWritable(0)
	public bronze: JsonCurrentWritable<number> = jsonCurrentWritable(0)
}

class TrackRespawns {
	public author: JsonCurrentWritable<number> = jsonCurrentWritable(0)
	public gold: JsonCurrentWritable<number> = jsonCurrentWritable(0)
	public silver: JsonCurrentWritable<number> = jsonCurrentWritable(0)
	public bronze: JsonCurrentWritable<number> = jsonCurrentWritable(0)
}

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
	validate: Track
	invalidate: Track
	change: Track
}

export class Track implements Omit<Emitter<Events>, 'emit'> {
	trackData = new TrackData()

	trackId = `Track-${Math.random().toString(36).substring(2, 9)}`

	#trackName: JsonCurrentWritable<string> = jsonCurrentWritable('')
	trackName: JsonCurrentReadable<string> = jsonCurrentReadable(this.#trackName)

	#authorName: JsonCurrentWritable<string> = jsonCurrentWritable('')
	authorName: JsonCurrentReadable<string> = jsonCurrentReadable(this.#authorName)

	trackTimes = new TrackTimes()
	trackRespawns = new TrackRespawns()

	#validated: JsonCurrentWritable<boolean> = jsonCurrentWritable(false)
	validated: JsonCurrentReadable<boolean> = jsonCurrentReadable(this.#validated)

	/**
	 * The validation is used to invalidate track records when the track changed.
	 */
	validationId = ''

	#emitter = mitt<Events>()

	public on = this.#emitter.on
	public off = this.#emitter.off
	public all = this.#emitter.all
	public emit = this.#emitter.emit

	public toJSON() {
		return this
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
		const trackElementsStringRepresentation = this.trackData.trackElements.current
			.map((trackElement) => {
				const position = numbersToString(trackElement.position.current)
				const rotation = numbersToString(trackElement.rotation.current)
				return `${String(trackElement.type.current)}:${position}:${rotation}`
			})
			.sort((a, b) => {
				return a.localeCompare(b)
			})
			.join(',')
		return cyrb53(trackElementsStringRepresentation).toString(16)
	}

	public validate(authorTime: number) {
		this.validationId = this.calculateValidationId()
		this.trackTimes.author.set(authorTime)
		this.#validated.set(true)
		this.#emitter.emit('validate', this)
		this.#emitter.emit('change', this)
	}

	public invalidate() {
		this.#validated.set(false)
		this.validationId = ''
		this.trackTimes.author.set(0)
		this.trackRespawns.author.set(0)
		this.#emitter.emit('invalidate', this)
		this.#emitter.emit('change', this)
	}

	public setTrackName(trackName: string) {
		this.#trackName.set(trackName)
		this.#emitter.emit('change', this)
	}

	public setAuthorName(authorName: string) {
		this.#authorName.set(authorName)
		this.#emitter.emit('change', this)
	}

	public setFromData(data: any) {
		const parsed = TrackSchema.parse(data)

		this.trackId = parsed.trackId
		this.setTrackName(parsed.trackName)
		this.setAuthorName(parsed.authorName)

		this.trackData = TrackData.fromJSON(parsed.trackData)

		this.trackTimes.author.set(parsed.trackTimes.author)
		this.trackTimes.gold.set(parsed.trackTimes.gold)
		this.trackTimes.silver.set(parsed.trackTimes.silver)
		this.trackTimes.bronze.set(parsed.trackTimes.bronze)

		this.trackRespawns.author.set(parsed.trackRespawns.author)
		this.trackRespawns.gold.set(parsed.trackRespawns.gold)
		this.trackRespawns.silver.set(parsed.trackRespawns.silver)
		this.trackRespawns.bronze.set(parsed.trackRespawns.bronze)

		this.#validated.set(parsed.validated)
		this.validationId = parsed.validationId

		return this
	}

	public clone() {
		const cloned = new Track()
		cloned.setFromData(JSON.parse(JSON.stringify(this)))
		cloned.trackId = `Track-${Math.random().toString(36).substring(2, 9)}`
		return cloned
	}

	public addTrackElement(type: TrackElementType) {
		if (this.#validated.current) {
			console.warn('Cannot add track element to validated track!')
			return
		}
		const trackElement = this.trackData.addTrackElement(type)
		this.#emitter.emit('change', this)
		return trackElement
	}

	public removeTrackElement(id: string) {
		if (this.#validated.current) {
			console.warn('Cannot remove track element from validated track!')
			return
		}
		this.trackData.removeTrackElement(id)
		this.#emitter.emit('change', this)
	}

	public duplicateTrackElement(id: string) {
		if (this.#validated.current) {
			console.warn('Cannot duplicate track element of validated track!')
			return
		}
		const trackElement = this.trackData.duplicateTrackElement(id)
		this.#emitter.emit('change', this)
		return trackElement
	}

	public setTrackElementType = (id: string, type: TrackElementType) => {
		if (this.#validated.current) {
			console.warn('Cannot set track element type of validated track!')
			return
		}
		this.trackData.setTrackElementType(id, type)
		this.#emitter.emit('change', this)
	}

	public setTrackElementPosition = (id: string, position: Vector3Tuple) => {
		if (this.#validated.current) {
			console.warn('Cannot set track element position of validated track!')
			return
		}
		this.trackData.setTrackElementPosition(id, position)
		this.#emitter.emit('change', this)
	}

	public setTrackElementRotation = (
		id: string,
		rotation: [x: number, y: number, z: number, order: EulerOrder]
	) => {
		if (this.#validated.current) {
			console.warn('Cannot set track element rotation of validated track!')
			return
		}
		this.trackData.setTrackElementRotation(id, rotation)
		this.#emitter.emit('change', this)
	}
}
