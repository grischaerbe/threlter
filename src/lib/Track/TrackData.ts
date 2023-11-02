import type { EulerOrder, Vector3Tuple } from 'three'
import z, { type TypeOf } from 'zod'
import type { TrackElementType } from './Track'
import { TrackElement, TrackElementSchema } from './TrackElement'

export const TrackDataSchema = z.object({
	trackElements: z.array(TrackElementSchema),
	checkpointCount: z.number(),
	finishCount: z.number()
})

export class TrackData {
	trackElements: TrackElement[] = []
	checkpointCount = 0
	finishCount = 0

	toJSON(): TypeOf<typeof TrackDataSchema> {
		return {
			trackElements: this.trackElements.map((trackElement) => trackElement.toJSON()),
			checkpointCount: this.checkpointCount,
			finishCount: this.finishCount
		}
	}

	public setFromData(data: any) {
		const parsed = TrackDataSchema.parse(data)
		parsed.trackElements.forEach((trackElement) => {
			const te = this.addTrackElement(trackElement.type as TrackElementType)
			te.setPosition(trackElement.position)
			te.setRotation(trackElement.rotation as any)
		})
		this.updateCheckpointCount()
	}

	private updateCheckpointCount() {
		const checkpointCount = this.trackElements.filter((trackElement) => {
			return trackElement.type.startsWith('Checkpoint')
		}).length
		const finishCount = this.trackElements.filter((trackElement) => {
			return trackElement.type.startsWith('Finish')
		}).length
		this.checkpointCount = checkpointCount
		this.finishCount = finishCount
	}

	public addTrackElement(type: TrackElementType) {
		const newTrackElement = new TrackElement(type)
		this.trackElements.push(newTrackElement)
		// force update
		this.trackElements = this.trackElements
		this.updateCheckpointCount()
		return newTrackElement
	}

	public removeTrackElement(id: string) {
		const index = this.trackElements.findIndex((trackElement) => trackElement.id === id)
		if (index === -1) return
		// immutable remove
		this.trackElements = [
			...this.trackElements.slice(0, index),
			...this.trackElements.slice(index + 1)
		]
		this.updateCheckpointCount()
	}

	public duplicateTrackElement(idOrTrackElement: string | TrackElement) {
		let te: TrackElement | undefined
		if (typeof idOrTrackElement === 'string') {
			te = this.trackElements.find((trackElement) => trackElement.id === idOrTrackElement)
		} else {
			te = idOrTrackElement
		}
		if (!te) {
			console.warn('Cannot duplicate track element that does not exist!')
			return
		}
		const newTrackElement = te.clone()
		this.trackElements = [...this.trackElements, newTrackElement]
		this.updateCheckpointCount()
		return newTrackElement
	}

	public setTrackElementType = (id: string, type: TrackElementType) => {
		const trackElement = this.trackElements.find((trackElement) => trackElement.id === id)
		if (trackElement) {
			trackElement.setType(type)
		}
		this.updateCheckpointCount()
	}

	public setTrackElementPosition = (id: string, position: Vector3Tuple) => {
		const trackElement = this.trackElements.find((trackElement) => trackElement.id === id)
		if (trackElement) {
			trackElement.setPosition(position)
		}
	}

	public setTrackElementRotation = (
		id: string,
		rotation: [x: number, y: number, z: number, order: EulerOrder]
	) => {
		const trackElement = this.trackElements.find((trackElement) => trackElement.id === id)
		if (trackElement) {
			trackElement.setRotation(rotation)
		}
	}
}
