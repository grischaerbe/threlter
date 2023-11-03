import { z, type TypeOf } from 'zod'
import { GhostFrame, GhostFrameSchema } from './GhostFrame'

export const GhostSchema = z.object({
	id: z.string(),
	frames: z.array(GhostFrameSchema)
})

export class Ghost {
	public frames: GhostFrame[]
	public id = Math.random().toString(36).substring(2, 9)
	public averageTimeBetweenFrames = -1
	public thresholdFactor = 2

	public firstFrameTime = 0
	public lastFrameTime = 0

	#playbackFrames: GhostFrame[] = []

	constructor() {
		this.frames = []
	}

	isInitialized() {
		return this.#playbackFrames.length === this.frames.length
	}

	initializePlayback() {
		this.#playbackFrames = [...this.frames].reverse()
		this.calculateAverageTimeBetweenPlaybackFrames()
		this.lastFrameTime = this.#playbackFrames[0]?.time ?? 0
		this.firstFrameTime = this.#playbackFrames[this.#playbackFrames.length - 1]?.time ?? 0
	}

	hasPlaybackFrames() {
		return this.#playbackFrames.length > 0
	}

	getPlaybackFrame(time: number) {
		if (this.#playbackFrames.length === 0) return undefined
		// the frames are stored in this.#playbackFrames in reverse order
		let closestFrameIndex = -1

		let closestDiff = this.averageTimeBetweenFrames * this.thresholdFactor
		// we iterate from the end of the array
		frameloop: for (let index = this.#playbackFrames.length - 1; index >= 0; index--) {
			const frame = this.#playbackFrames[index]
			if (!frame) continue frameloop
			const diff = Math.abs(frame.time - time)
			if (diff < closestDiff) {
				closestFrameIndex = index
				closestDiff = diff
			} else {
				break frameloop
			}
		}

		// we didn't find a frame in the threshold, so we return undefined
		if (closestFrameIndex === -1) return undefined

		// remove all frames after the closest frame (reverse order)
		this.#playbackFrames.splice(closestFrameIndex + 1)

		// pop
		return this.#playbackFrames.pop()
	}

	public setFromData(data: any) {
		const parsed = GhostSchema.parse(data)
		this.id = parsed.id
		this.frames = []
		parsed.frames.forEach((frame) => {
			this.addFrame(frame.position, frame.quaternion, frame.time)
		})
		this.calculateAverageTimeBetweenPlaybackFrames()
		return this
	}

	public toJSON(): TypeOf<typeof GhostSchema> {
		return {
			id: this.id,
			frames: this.frames.map((frame) => frame.toJSON())
		}
	}

	public calculateAverageTimeBetweenPlaybackFrames() {
		// calculate the average time between frames by checking the time between the first and last frame
		// and dividing it by the number of frames
		if (this.#playbackFrames.length < 2) return
		const firstFrame = this.#playbackFrames[0]
		const lastFrame = this.#playbackFrames[this.#playbackFrames.length - 1]
		if (!firstFrame || !lastFrame) return
		const diff = Math.abs(lastFrame.time - firstFrame.time)
		this.averageTimeBetweenFrames = diff / this.#playbackFrames.length
	}

	public addFrame(
		position: [number, number, number],
		quaternion: [number, number, number, number],
		time: number
	) {
		this.averageTimeBetweenFrames = -1
		this.frames.push(new GhostFrame(position, quaternion, time))
		if (time > this.lastFrameTime) this.lastFrameTime = time
		if (time < this.firstFrameTime) this.firstFrameTime = time
	}
}
