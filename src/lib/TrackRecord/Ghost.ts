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

  public averageTimeBetweenFrames: number = -1

  constructor() {
    this.frames = []
  }

  public calculateAverageTimeBetweenFrames() {
    // calculate the average time between frames by checking the time between the first and last frame
    // and dividing it by the number of frames
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
  }

  public getFrame(time: number):
    | {
        index: number
        isLastFrame: boolean
        frame: GhostFrame
      }
    | undefined {
    // get frame that is closest to the time
    let closestFrame: GhostFrame | undefined = undefined
    let closestIndex = -1
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
        closestIndex = index
        closestDiff = diff
      } else {
        break frameloop
      }
    }

    if (!closestFrame) return undefined

    return {
      index: closestIndex,
      isLastFrame: closestIndex === this.frames.length - 1,
      frame: closestFrame
    }
  }

  public static fromString(string: string) {
    const data = JSON.parse(string)
    return Ghost.fromJSON(data)
  }

  public static fromJSON(data: any) {
    const ghost = new Ghost()
    for (const frame of data.frames) {
      ghost.addFrame(frame.position, frame.quaternion, frame.time)
    }
    return ghost
  }
}
