export type CarState = {
  isForward: boolean
  isBraking: boolean
  velocity: number
  worldPosition: [number, number, number]
  worldQuaternion: [number, number, number, number]
  /**
   * in radians
   */
  steeringAngle: number
}
