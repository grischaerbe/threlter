import type { EulerOrder, Vector3Tuple } from 'three'
import { type JsonCurrentWritable, jsonCurrentWritable } from '../utils/jsonCurrentWritable'
import { type TrackElementType, type JsonCurrentReadable, jsonCurrentReadable } from './TrackData'

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
