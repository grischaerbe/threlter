import { currentWritable } from '@threlte/core'
import type { CarState } from './RaycastVehicleController/types'

export const dummyCarState: CarState = {
	isBraking: currentWritable(false),
	normalizedRpm: currentWritable(0),
	steeringAngle: currentWritable(0),
	velocity: currentWritable(0),
	worldPosition: currentWritable([0, 0, 0]),
	worldQuaternion: currentWritable([0, 0, 0, 1])
}
