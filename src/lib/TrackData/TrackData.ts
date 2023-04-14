import { type Readable, derived } from 'svelte/store'
import type { EulerOrder, Vector3Tuple } from 'three'
import { type JsonCurrentWritable, jsonCurrentWritable } from '../utils/jsonCurrentWritable'
import { type CurrentWritable, currentWritable } from '@threlte/core'
import { cyrb53 } from '../utils/hash'
import JSZip from 'jszip'
import type { trackElementPrototypes } from '$components/TrackElements/elements'

type JsonCurrentReadable<T> = Readable<T> & {
	current: T
	toJSON: () => T
}

export type TrackElementType = keyof typeof trackElementPrototypes

/**
 * This provides only type-safety and will not complain if the store is actually set!
 */
const jsonCurrentReadable = <T>(
	jsonCurrentWritable: JsonCurrentWritable<T>
): JsonCurrentReadable<T> => {
	return jsonCurrentWritable
}

export class TrackElement {
	public id: string = Math.random().toString(36).substring(2, 9)
	#type: JsonCurrentWritable<TrackElementType>
	type: JsonCurrentReadable<TrackElementType>
	#position: JsonCurrentWritable<Vector3Tuple>
	position: JsonCurrentReadable<Vector3Tuple>
	#rotation: JsonCurrentWritable<[x: number, y: number, z: number, order: EulerOrder]>
	rotation: JsonCurrentReadable<[x: number, y: number, z: number, order: EulerOrder]>

	constructor(
		type: TrackElementType,
		position: Vector3Tuple,
		rotation: [x: number, y: number, z: number, order: EulerOrder]
	) {
		this.#type = jsonCurrentWritable(type)
		this.type = jsonCurrentReadable(this.#type)
		this.#position = jsonCurrentWritable(position)
		this.position = jsonCurrentReadable(this.#position)
		this.#rotation = jsonCurrentWritable(rotation)
		this.rotation = jsonCurrentReadable(this.#rotation)
	}

	public static fromType(type: TrackElementType) {
		return new TrackElement(type, [0, 0, 0], [0, 0, 0, 'XYZ'])
	}

	public static fromTrackElement(trackElement: TrackElement) {
		return new TrackElement(
			trackElement.type.current,
			trackElement.position.current,
			trackElement.rotation.current
		)
	}

	public static fromJSON(json: any) {
		return new TrackElement(json.type, json.position, json.rotation)
	}

	public setType(type: TrackElementType) {
		this.#type.set(type)
	}

	public setPosition(position: Vector3Tuple) {
		this.#position.set(position)
	}

	public setRotation(rotation: [x: number, y: number, z: number, order: EulerOrder]) {
		this.#rotation.set(rotation)
	}
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

export class TrackData {
	trackId = `Track-${Math.random().toString(36).substring(2, 9)}`
	trackName: JsonCurrentWritable<string> = jsonCurrentWritable('')
	authorName: JsonCurrentWritable<string> = jsonCurrentWritable('')

	#trackElements: JsonCurrentWritable<TrackElement[]> = jsonCurrentWritable([])
	trackElements: JsonCurrentReadable<TrackElement[]> = jsonCurrentReadable(this.#trackElements)

	trackTimes = new TrackTimes()
	trackRespawns = new TrackRespawns()

	#validated: JsonCurrentWritable<boolean> = jsonCurrentWritable(false)
	validated: JsonCurrentReadable<boolean> = jsonCurrentReadable(this.#validated)

	/**
	 * The validation is used to invalidate track records when the track changed.
	 */
	validationId = ''

	/**
	 * The validation id is a hash of all track elements. It is used to invalidate
	 * track records when the track changed. The elements are sorted by
	 * their contents to ensure that the order of the elements does not matter.
	 */
	private calculateValidationId() {
		const numbersToString = (args: (number | string)[]) => {
			return args.map((arg) => (typeof arg === 'number' ? arg.toFixed(8) : arg)).join(':')
		}
		const trackElementsStringRepresentation = this.trackElements.current
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
		if (save) this.toLocalStorage()
	}

	public invalidate(save = true) {
		this.#validated.set(false)
		this.validationId = ''
		this.trackTimes.author.set(0)
		this.trackRespawns.author.set(0)
		if (save) this.toLocalStorage()
	}

	#checkpointCount = jsonCurrentWritable(0)
	checkpointCount = jsonCurrentReadable(this.#checkpointCount)

	#finishCount = jsonCurrentWritable(0)
	finishCount = jsonCurrentReadable(this.#finishCount)

	public static createEmpty() {
		return new TrackData()
	}

	public static async fromServer(trackId: string) {
		const text = await import(`../../CampaignTracks/${trackId}.json?raw`)
		if (!text.default) throw new Error('Track not found')
		const trackData = TrackData.fromString(text.default)
		if (!trackData) throw new Error('Track not found')
		return trackData
	}

	public static fromString(json: string) {
		try {
			const data = JSON.parse(json)
			return TrackData.fromJSON(data)
		} catch (error) {
			console.error(error)
			return undefined
		}
	}

	public static fromJSON(data: any) {
		try {
			const trackData = new TrackData()

			trackData.trackId = data.trackId
			trackData.trackName.set(data.trackName)
			trackData.authorName.set(data.authorName)

			trackData.#trackElements.set(
				data.trackElements.map((trackElement: any) => TrackElement.fromJSON(trackElement))
			)

			trackData.trackTimes.author.set(data.trackTimes.author)
			trackData.trackTimes.gold.set(data.trackTimes.gold)
			trackData.trackTimes.silver.set(data.trackTimes.silver)
			trackData.trackTimes.bronze.set(data.trackTimes.bronze)

			trackData.trackRespawns.author.set(data.trackRespawns.author)
			trackData.trackRespawns.gold.set(data.trackRespawns.gold)
			trackData.trackRespawns.silver.set(data.trackRespawns.silver)
			trackData.trackRespawns.bronze.set(data.trackRespawns.bronze)

			trackData.#validated.set(data.validated)
			trackData.validationId = data.validationId

			trackData.updateCheckpointCount()

			return trackData
		} catch (error) {
			console.error(error)
			return undefined
		}
	}

	public clone() {
		const json = JSON.stringify(this)
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const trackData = TrackData.fromString(json)!
		trackData.trackId = `Track-${Math.random().toString(36).substring(2, 9)}`
		return trackData
	}

	private updateCheckpointCount() {
		const checkpointCount = this.#trackElements.current.filter((trackElement) => {
			return trackElement.type.current.startsWith('Checkpoint')
		}).length
		const finishCount = this.#trackElements.current.filter((trackElement) => {
			return trackElement.type.current.startsWith('Finish')
		}).length
		this.#checkpointCount.set(checkpointCount)
		this.#finishCount.set(finishCount)
	}

	public static fromLocalStorage(trackId: string) {
		const json = localStorage.getItem(trackId)
		if (json) {
			return TrackData.fromString(json)
		}
		return undefined
	}

	public static removeFromLocalStorage(trackId: string) {
		localStorage.removeItem(trackId)
		TrackData.#localStorageTrackIdsNeedUpdate.set(true)
	}

	public removeFromLocalStorage() {
		localStorage.removeItem(this.trackId)
		TrackData.#localStorageTrackIdsNeedUpdate.set(true)
	}

	#timeout: ReturnType<typeof setTimeout> | undefined
	public toLocalStorage(debounce: number | false = 100) {
		if (this.#timeout) {
			clearTimeout(this.#timeout)
		}
		if (!debounce) {
			localStorage.setItem(this.trackId, this.stringify())
		} else {
			this.#timeout = setTimeout(() => {
				localStorage.setItem(this.trackId, this.stringify())
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
		const json = this.stringify()
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

	public stringify() {
		return JSON.stringify(this)
	}

	public addTrackElement(type: TrackElementType, save = true) {
		if (this.#validated.current) {
			console.warn('Cannot add track element to validated track!')
			return
		}
		const newTrackElement = TrackElement.fromType(type)
		this.#trackElements.update((trackElements) => {
			trackElements.push(newTrackElement)
			return trackElements
		})
		this.updateCheckpointCount()
		if (save) this.toLocalStorage()
		return newTrackElement
	}

	public removeTrackElement(id: string, save = true) {
		if (this.#validated.current) {
			console.warn('Cannot remove track element from validated track!')
			return
		}
		this.#trackElements.update((trackElements) => {
			return trackElements.filter((trackElement) => trackElement.id !== id)
		})
		this.updateCheckpointCount()
		if (save) this.toLocalStorage()
	}

	public duplicateTrackElement(id: string, save = true) {
		if (this.#validated.current) {
			console.warn('Cannot duplicate track element of validated track!')
			return
		}
		const trackElementToDuplicate = this.#trackElements.current.find(
			(trackElement) => trackElement.id === id
		)
		if (!trackElementToDuplicate) {
			console.warn('Cannot duplicate track element that does not exist!')
			return
		}
		const newTrackElement = TrackElement.fromTrackElement(trackElementToDuplicate)
		this.#trackElements.update((trackElements) => {
			trackElements.push(newTrackElement)
			return trackElements
		})
		this.updateCheckpointCount()
		if (save) this.toLocalStorage()
		return newTrackElement
	}

	public setTrackElementType = (id: string, type: TrackElementType, save = true) => {
		if (this.#validated.current) {
			console.warn('Cannot set track element type of validated track!')
			return
		}
		this.#trackElements.update((trackElements) => {
			const trackElement = trackElements.find((trackElement) => trackElement.id === id)
			if (trackElement) {
				trackElement.setType(type)
			}
			return trackElements
		})
		this.updateCheckpointCount()
		if (save) this.toLocalStorage()
	}

	public setTrackElementPosition = (id: string, position: Vector3Tuple, save = true) => {
		if (this.#validated.current) {
			console.warn('Cannot set track element position of validated track!')
			return
		}
		this.#trackElements.update((trackElements) => {
			const trackElement = trackElements.find((trackElement) => trackElement.id === id)
			if (trackElement) {
				trackElement.setPosition(position)
			}
			return trackElements
		})
		if (save) this.toLocalStorage()
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
		this.#trackElements.update((trackElements) => {
			const trackElement = trackElements.find((trackElement) => trackElement.id === id)
			if (trackElement) {
				trackElement.setRotation(rotation)
			}
			return trackElements
		})
		if (save) this.toLocalStorage()
	}
}
