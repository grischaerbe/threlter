import type { EulerOrder, Vector3Tuple } from 'three'
import type { TrackElementType } from './Track'
import { z, type TypeOf } from 'zod'

export const TrackElementSchema = z.object({
	id: z.string(),
	type: z.string(),
	position: z.tuple([z.number(), z.number(), z.number()]),
	rotation: z.tuple([z.number(), z.number(), z.number(), z.string()])
})

export class TrackElement {
	public id: string = Math.random().toString(36).substring(2, 9)
	public type: TrackElementType
	public position: Vector3Tuple
	public rotation: [x: number, y: number, z: number, order: EulerOrder]

	constructor(
		type: TrackElementType,
		position?: Vector3Tuple,
		rotation?: [x: number, y: number, z: number, order: EulerOrder]
	) {
		this.type = type
		this.position = position ?? [0, 0, 0]
		this.rotation = rotation ?? [0, 0, 0, 'XYZ']
	}

	toJSON(): TypeOf<typeof TrackElementSchema> {
		return {
			id: this.id,
			type: this.type,
			position: this.position,
			rotation: this.rotation
		}
	}

	public clone() {
		return new TrackElement(this.type, this.position, this.rotation)
	}

	public setFromData(data: any) {
		const parsed = TrackElementSchema.parse(data)
		this.id = parsed.id
		this.type = parsed.type as TrackElementType
		this.position = parsed.position
		this.rotation = parsed.rotation as any
	}

	public setType(type: TrackElementType) {
		this.type = type
	}

	public setPosition(position: Vector3Tuple) {
		this.position = position
	}

	public setRotation(rotation: [x: number, y: number, z: number, order: EulerOrder]) {
		this.rotation = rotation
	}
}
