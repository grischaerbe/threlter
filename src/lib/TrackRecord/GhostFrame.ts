import { z, type TypeOf } from 'zod'

export const GhostFrameSchema = z.object({
	position: z.tuple([z.number(), z.number(), z.number()]),
	quaternion: z.tuple([z.number(), z.number(), z.number(), z.number()]),
	time: z.number()
})

export class GhostFrame {
	public position: [number, number, number]
	public quaternion: [number, number, number, number]
	public time: number

	constructor(
		position: [number, number, number],
		quaternion: [number, number, number, number],
		time: number
	) {
		this.position = position
		this.quaternion = quaternion
		this.time = time
	}

	public setFromData(data: any) {
		const parsed = GhostFrameSchema.parse(data)
		this.position = parsed.position
		this.quaternion = parsed.quaternion
		this.time = parsed.time
		return this
	}

	public toJSON(): TypeOf<typeof GhostFrameSchema> {
		return {
			position: this.position,
			quaternion: this.quaternion,
			time: this.time
		}
	}
}
