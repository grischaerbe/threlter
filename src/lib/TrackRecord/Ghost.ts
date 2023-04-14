class GhostFrame {
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
}

export class Ghost {
	public frames: GhostFrame[]
	public id = Math.random().toString(36).substring(2, 9)
	public averageTimeBetweenFrames = -1

	public firstFrameTime = 0
	public lastFrameTime = 0

	constructor() {
		this.frames = []
	}

	public calculateAverageTimeBetweenFrames() {
		// calculate the average time between frames by checking the time between the first and last frame
		// and dividing it by the number of frames
		if (this.frames.length < 2) return
		const firstFrame = this.frames[0]
		const lastFrame = this.frames[this.frames.length - 1]
		if (!firstFrame || !lastFrame) return
		const diff = lastFrame.time - firstFrame.time
		this.averageTimeBetweenFrames = diff / this.frames.length
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

	public getFrame(time: number): GhostFrame | undefined {
		// get frame that is closest to the time
		let closestFrame: GhostFrame | undefined = undefined
		let closestDiff = Infinity

		// we are potentially iterating over thousands of frames, so we start at a reasonable index.
		// We know the average time between frames, so we can use that to calculate a start index. We then subtract 50 frames for good measure.

		if (this.averageTimeBetweenFrames === -1) this.calculateAverageTimeBetweenFrames()
		const startIndex = Math.max(
			0,
			Math.floor((time - this.averageTimeBetweenFrames * 25) / this.averageTimeBetweenFrames)
		)

		frameloop: for (let index = startIndex; index < this.frames.length; index++) {
			const frame = this.frames[index]
			if (!frame) continue frameloop
			const diff = Math.abs(frame.time - time)
			if (diff < closestDiff) {
				closestFrame = frame
				closestDiff = diff
			} else {
				break frameloop
			}
		}

		return closestFrame
	}

	public static fromString(string: string) {
		const data = JSON.parse(string)
		return Ghost.fromJSON(data)
	}

	public static fromJSON(data: any) {
		const ghost = new Ghost()
		ghost.id = data.id
		for (const frame of data.frames) {
			ghost.addFrame(frame.position, frame.quaternion, frame.time)
		}
		return ghost
	}
}
