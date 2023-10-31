import type { EulerOrder, Vector3Tuple } from 'three'
import { jsonCurrentWritable, type JsonCurrentWritable } from '../utils/jsonCurrentWritable'
import { jsonCurrentReadable, type JsonCurrentReadable, type TrackElementType } from './Track'
import { TrackElement } from './TrackElement'
import z, { type TypeOf } from 'zod'

export const TrackDataSchema = z.object({
	trackElements: z.array(
		z.object({
			id: z.string(),
			type: z.string(),
			position: z.tuple([z.number(), z.number(), z.number()]),
			rotation: z.tuple([z.number(), z.number(), z.number(), z.string()])
		})
	),
	checkpointCount: z.number(),
	finishCount: z.number()
})

export class TrackData {
	#trackElements: JsonCurrentWritable<TrackElement[]> = jsonCurrentWritable([])
	trackElements: JsonCurrentReadable<TrackElement[]> = jsonCurrentReadable(this.#trackElements)

	#checkpointCount = jsonCurrentWritable(0)
	checkpointCount = jsonCurrentReadable(this.#checkpointCount)

	#finishCount = jsonCurrentWritable(0)
	finishCount = jsonCurrentReadable(this.#finishCount)

	public static fromString(json: string) {
		const data = JSON.parse(json)
		return TrackData.fromJSON(data)
	}

	public static fromJSON(data: any) {
		const parsed = TrackDataSchema.parse(data)
		const track = new TrackData()
		track.#trackElements.set(
			parsed.trackElements.map((trackElement: any) => TrackElement.fromJSON(trackElement))
		)
		track.updateCheckpointCount()
		return track
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

	public addTrackElement(type: TrackElementType) {
		const newTrackElement = TrackElement.fromType(type)
		this.#trackElements.update((trackElements) => {
			trackElements.push(newTrackElement)
			return trackElements
		})
		this.updateCheckpointCount()
		return newTrackElement
	}

	public removeTrackElement(id: string) {
		this.#trackElements.update((trackElements) => {
			return trackElements.filter((trackElement) => trackElement.id !== id)
		})
		this.updateCheckpointCount()
	}

	public duplicateTrackElement(id: string) {
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
		return newTrackElement
	}

	public setTrackElementType = (id: string, type: TrackElementType) => {
		this.#trackElements.update((trackElements) => {
			const trackElement = trackElements.find((trackElement) => trackElement.id === id)
			if (trackElement) {
				trackElement.setType(type)
			}
			return trackElements
		})
		this.updateCheckpointCount()
	}

	public setTrackElementPosition = (id: string, position: Vector3Tuple) => {
		this.#trackElements.update((trackElements) => {
			const trackElement = trackElements.find((trackElement) => trackElement.id === id)
			if (trackElement) {
				trackElement.setPosition(position)
			}
			return trackElements
		})
	}

	public setTrackElementRotation = (
		id: string,
		rotation: [x: number, y: number, z: number, order: EulerOrder]
	) => {
		this.#trackElements.update((trackElements) => {
			const trackElement = trackElements.find((trackElement) => trackElement.id === id)
			if (trackElement) {
				trackElement.setRotation(rotation)
			}
			return trackElements
		})
	}
}
