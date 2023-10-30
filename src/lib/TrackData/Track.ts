import type { trackElementPrototypes } from '$components/TrackElements/elements'
import { currentWritable, type CurrentWritable } from '@threlte/core'
import JSZip from 'jszip'
import { derived, type Readable } from 'svelte/store'
import type { EulerOrder, Vector3Tuple } from 'three'
import z from 'zod'
import { cyrb53 } from '../utils/hash'
import { jsonCurrentWritable, type JsonCurrentWritable } from '../utils/jsonCurrentWritable'
import { TrackData, TrackSchema } from './TrackData'
import mitt, { type Emitter } from 'mitt'

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

const TrackDataSchema = z.object({
	trackId: z.string(),
	trackName: z.string(),
	authorName: z.string(),
	userId: z.string(),
	track: TrackSchema,
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
	track = new TrackData()

	trackId = `Track-${Math.random().toString(36).substring(2, 9)}`

	userId: string

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

	constructor(userId: string) {
		this.userId = userId
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
		const trackElementsStringRepresentation = this.track.trackElements.current
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

	public validate(authorTime: number, save = true) {
		this.validationId = this.calculateValidationId()
		this.trackTimes.author.set(authorTime)
		this.#validated.set(true)
		this.#emitter.emit('validate', this)
		this.#emitter.emit('change', this)
	}

	public invalidate(save = true) {
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

	public static async fromServer(trackId: string) {
		const text = await import(`../../CampaignTracks/${trackId}.json?raw`)
		if (!text.default) throw new Error('Track not found')
		const trackData = Track.fromString(text.default)
		if (!trackData) throw new Error('Track not found')
		return trackData
	}

	public static fromString(json: string) {
		try {
			const data = JSON.parse(json)
			return Track.fromJSON(data)
		} catch (error) {
			console.error(error)
			return undefined
		}
	}

	public static fromJSON(data: any) {
		const parsed = TrackDataSchema.parse(data)

		const trackData = new Track(parsed.userId)

		trackData.trackId = parsed.trackId
		trackData.setTrackName(parsed.trackName)
		trackData.setAuthorName(parsed.authorName)

		trackData.track = TrackData.fromJSON(parsed.track)

		trackData.trackTimes.author.set(parsed.trackTimes.author)
		trackData.trackTimes.gold.set(parsed.trackTimes.gold)
		trackData.trackTimes.silver.set(parsed.trackTimes.silver)
		trackData.trackTimes.bronze.set(parsed.trackTimes.bronze)

		trackData.trackRespawns.author.set(parsed.trackRespawns.author)
		trackData.trackRespawns.gold.set(parsed.trackRespawns.gold)
		trackData.trackRespawns.silver.set(parsed.trackRespawns.silver)
		trackData.trackRespawns.bronze.set(parsed.trackRespawns.bronze)

		trackData.#validated.set(parsed.validated)
		trackData.validationId = parsed.validationId

		return trackData
	}

	public clone() {
		const json = JSON.stringify(this)
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const trackData = Track.fromString(json)!
		trackData.trackId = `Track-${Math.random().toString(36).substring(2, 9)}`
		return trackData
	}

	public static fromLocalStorage(trackId: string) {
		const json = localStorage.getItem(trackId)
		if (json) {
			return Track.fromString(json)
		}
		return undefined
	}

	public static removeFromLocalStorage(trackId: string) {
		localStorage.removeItem(trackId)
		Track.#localStorageTrackIdsNeedUpdate.set(true)
	}

	public removeFromLocalStorage() {
		localStorage.removeItem(this.trackId)
		Track.#localStorageTrackIdsNeedUpdate.set(true)
	}

	#timeout: ReturnType<typeof setTimeout> | undefined
	public toLocalStorage(debounce: number | false = 100) {
		if (this.#timeout) {
			clearTimeout(this.#timeout)
		}
		if (!debounce) {
			localStorage.setItem(this.trackId, JSON.stringify(this))
		} else {
			this.#timeout = setTimeout(() => {
				localStorage.setItem(this.trackId, JSON.stringify(this))
			})
		}
	}

	static #localStorageTrackIdsNeedUpdate = currentWritable(true)
	public static localStorageTrackIds = derived<CurrentWritable<boolean>, string[]>(
		this.#localStorageTrackIdsNeedUpdate,
		(localStorageTrackIdsNeedUpdate, set) => {
			if (localStorageTrackIdsNeedUpdate) {
				this.#localStorageTrackIdsNeedUpdate.set(false)
			} else {
				const localStorageKeys = Object.keys(localStorage)
				set(localStorageKeys.filter((key) => key.startsWith('Track-')))
			}
		}
	)

	public static updateLocalStorageTrackIds() {
		this.#localStorageTrackIdsNeedUpdate.set(true)
	}

	public async saveTrackToDisk() {
		const json = JSON.stringify(this)
		const zip = new JSZip()
		zip.file('track.json', json)
		const blob = await zip.generateAsync({
			type: 'blob'
		})
		const data = URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.download = this.trackName.current + '.zip'
		link.href = data
		link.click()
	}

	public addTrackElement(type: TrackElementType, save = true) {
		if (this.#validated.current) {
			console.warn('Cannot add track element to validated track!')
			return
		}
		const trackElement = this.track.addTrackElement(type)
		this.#emitter.emit('change', this)
		return trackElement
	}

	public removeTrackElement(id: string, save = true) {
		if (this.#validated.current) {
			console.warn('Cannot remove track element from validated track!')
			return
		}
		this.track.removeTrackElement(id)
		this.#emitter.emit('change', this)
	}

	public duplicateTrackElement(id: string, save = true) {
		if (this.#validated.current) {
			console.warn('Cannot duplicate track element of validated track!')
			return
		}
		const trackElement = this.track.duplicateTrackElement(id)
		this.#emitter.emit('change', this)
		return trackElement
	}

	public setTrackElementType = (id: string, type: TrackElementType, save = true) => {
		if (this.#validated.current) {
			console.warn('Cannot set track element type of validated track!')
			return
		}
		this.track.setTrackElementType(id, type)
		this.#emitter.emit('change', this)
	}

	public setTrackElementPosition = (id: string, position: Vector3Tuple, save = true) => {
		if (this.#validated.current) {
			console.warn('Cannot set track element position of validated track!')
			return
		}
		this.track.setTrackElementPosition(id, position)
		this.#emitter.emit('change', this)
	}

	public setTrackElementRotation = (
		id: string,
		rotation: [x: number, y: number, z: number, order: EulerOrder],
		save = true
	) => {
		if (this.#validated.current) {
			console.warn('Cannot set track element rotation of validated track!')
			return
		}
		this.track.setTrackElementRotation(id, rotation)
		this.#emitter.emit('change', this)
	}
}
