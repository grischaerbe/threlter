import type { CurrentWritable } from '@threlte/core'

export type CarState = {
	worldPosition: CurrentWritable<[number, number, number]>
	worldQuaternion: CurrentWritable<[number, number, number, number]>
	steeringAngle: CurrentWritable<number>
	velocity: CurrentWritable<number>
	isBraking: CurrentWritable<boolean>
	normalizedRpm: CurrentWritable<number>
}
