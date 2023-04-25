<!--

-->
<script lang="ts">
	import {
		Collider as RapierCollider,
		RigidBody as RapierRigidBody,
		Ray,
		type Rotation as RapierRotation,
		type Vector as RapierVector
	} from '@dimforge/rapier3d-compat'
	import { T, currentWritable, useFrame } from '@threlte/core'
	import { Audio } from '@threlte/extras'
	import { Collider, RigidBody, useRapier } from '@threlte/rapier'
	import { spring } from 'svelte/motion'
	import { Group, Quaternion, Vector3 } from 'three'
	import { DEG2RAD, clamp, lerp, mapLinear } from 'three/src/math/MathUtils'
	import Impulse from './Impulse.svelte'
	import type { CarState } from './types'
	import { useArrowKeys } from './useArrowKeys'
	import { computeBitMask } from './utils/computeBitMask'
	import { add, fromAToB, length, normalize } from './vectorUtils'

	export let freeze = false
	export let active = true
	export let volume = 1
	export let useAudio = true

	const { world } = useRapier()

	let rigidBody: RapierRigidBody

	let collider: RapierCollider
	let group: Group
	let dummyGroup: Group
	let innerGroup: Group

	const steeringAngle = spring(0)

	type ImpulseVisualisation = {
		id: string
		origin: {
			x: number
			y: number
			z: number
		}
		impulse: {
			x: number
			y: number
			z: number
		}
		length: number | undefined
		color: string | undefined
		multiplier: number | undefined
	}

	let impulseVisualisations: ImpulseVisualisation[] = []

	const updateImpulseVisualisation = (
		id: string,
		values: {
			origin?: RapierVector
			impulse?: RapierVector
			length?: number
			color?: string
			multiplier?: number
		}
	) => {
		const impulseVisualisation = impulseVisualisations.find(
			(impulseVisualisation) => impulseVisualisation.id === id
		)
		if (!impulseVisualisation) {
			impulseVisualisations.push({
				id,
				origin: {
					x: values.origin?.x ?? 0,
					y: values.origin?.y ?? 0,
					z: values.origin?.z ?? 0
				},
				impulse: {
					x: values.impulse?.x ?? 0,
					y: values.impulse?.y ?? 0,
					z: values.impulse?.z ?? 0
				},
				length: values.length ?? undefined,
				color: values.color ?? undefined,
				multiplier: values.multiplier ?? undefined
			})
		} else {
			if (values.origin) {
				impulseVisualisation.origin.x = values.origin.x
				impulseVisualisation.origin.y = values.origin.y
				impulseVisualisation.origin.z = values.origin.z
			}

			if (values.impulse) {
				impulseVisualisation.impulse.x = values.impulse.x
				impulseVisualisation.impulse.y = values.impulse.y
				impulseVisualisation.impulse.z = values.impulse.z
			}

			if (values.length) impulseVisualisation.length = values.length
			if (values.color) impulseVisualisation.color = values.color
			if (values.multiplier) impulseVisualisation.multiplier = values.multiplier
		}
	}

	const clearImpulseVisualisation = (id: string) => {
		impulseVisualisations = impulseVisualisations.filter(
			(impulseVisualisation) => impulseVisualisation.id !== id
		)
	}

	const { axis } = useArrowKeys()

	enum Wheel {
		'FL' = 'FL',
		'FR' = 'FR',
		'RL' = 'RL',
		'RR' = 'RR'
	}

	export let debug = false

	type WheelState = {
		type: Wheel
		onGround: boolean
		suspensionLength: number
		ray: Ray
		surfaceImpactPoint: RapierVector
		surfaceImpactNormal: RapierVector
		wheelGroup: Group
	}

	/**
	 * -------------------------------------------------------
	 * CAR CONFIGURATION
	 * -------------------------------------------------------
	 */

	const spawnPosition: {
		x: number
		y: number
		z: number
	} = {
		x: 0,
		y: 0,
		z: 0
	}

	/**
	 * In degrees
	 */
	const maxSteeringAngle = 35

	let carWeight = 1500
	/**
	 * In units/s
	 */
	let maxDesiredVelocity = 93
	// let suspensionStiffness = 0.99
	// let suspensionDamping = 0.1

	// const suspensionMountHeightRelativeToCarFloor = 0
	let suspensionStiffness = 0.5
	let suspensionDamping = 0.03

	// ~ VW Passat dimensions
	const carBodyHeight = 1.12
	const carBodyWidth = 1.9
	const carBodyLength = 4.5
	const carBodyRadius = 0.3

	// 16 inch wheels have ~0.2m radius
	const wheelRadius = 0.306

	// racing cars have ~0.05m ground clearance
	let maxGroundClearance = 0.3

	// ~ VW Passat wheelbase
	const wheelBase = 2.56

	let frictionCoefficient = 4.5

	let suspensionImpulseMultiplier = 1100
	let forwardImpulseMultiplier = 800
	const forwardImpulseMap = (_t: number) => 1
	let backwardImpulseMultiplier = 400
	const backwardImpulseMap = (_t: number) => 1
	let brakeImpulseMultiplier = 1400
	const brakeImpulseMap = (_t: number) => 1

	/**
	 * Maps the inclination to the power of the impulse applied to the wheels. The
	 * incliniation goes from 0 (car is on a vertical surface going down) to 1
	 * (car is on a vertical surface going up) where 0.5 is horizontal.
	 */
	// https://ease-everything.vercel.app/?path=%255B%2522Path%2522%252C%257B%2522applyMatrix%2522%253Atrue%252C%2522segments%2522%253A%255B%255B0%252C400%255D%252C%255B200%252C375%255D%252C%255B300%252C325%255D%252C%255B350%252C250%255D%252C%255B400%252C100%255D%255D%252C%2522strokeColor%2522%253A%255B0.05882%252C0.38039%252C0.99608%255D%252C%2522strokeWidth%2522%253A2%257D%255D
	const forwardImpulseInclinationMap = (t: number) => {
		if (t < 0.5) return ((0.9375 - 1) / (0.5 - 0)) * (t - 0) + 1
		if (t < 0.75) return ((0.8125 - 0.9375) / (0.75 - 0.5)) * (t - 0.5) + 0.9375
		if (t < 0.875) return ((0.6875 - 0.8125) / (0.875 - 0.75)) * (t - 0.75) + 0.8125
		return ((0.375 - 0.6875) / (1 - 0.875)) * (t - 0.875) + 0.6875
	}

	let steeringTorqueMultiplier = 230

	/**
	 * Steering torque is only applied if the velocity is above this threshold.
	 */
	const steeringVelocityThreshold = 0.3

	/**
	 * The steering map maps the velocity of the car to the power of the torque applied to
	 * local y axis the car. The velocity goes from 0 (car is stopped) to 1 (car is at
	 * maxDesiredVelocity).
	 */
	// https://ease-everything.vercel.app/?path=%255B%2522Path%2522%252C%257B%2522applyMatrix%2522%253Atrue%252C%2522segments%2522%253A%255B%255B0%252C0%255D%252C%255B%255B50%252C400%255D%252C%255B-25%252C0%255D%252C%255B75%252C0%255D%255D%252C%255B200%252C300%255D%252C%255B400%252C100%255D%255D%252C%2522strokeColor%2522%253A%255B0.05882%252C0.38039%252C0.99608%255D%252C%2522strokeWidth%2522%253A2%257D%255D
	const steeringMap = (t: number) => {
		// return 1
		if (t < 0.08421052631578942)
			return ((0.8719777960526315 - 0) / (0.08421052631578942 - 0)) * (t - 0) + 0
		if (t < 0.1875)
			return (
				((1 - 0.8719777960526315) / (0.1875 - 0.08421052631578942)) * (t - 0.08421052631578942) +
				0.8719777960526315
			)
		return ((0.625 - 1) / (1 - 0.1875)) * (t - 0.1875) + 1
	}

	// https://ease-everything.vercel.app/?path=%255B%2522Path%2522%252C%257B%2522applyMatrix%2522%253Atrue%252C%2522segments%2522%253A%255B%255B0%252C350%255D%252C%255B150%252C400%255D%252C%255B400%252C125%255D%255D%252C%2522strokeColor%2522%253A%255B0.05882%252C0.38039%252C0.99608%255D%252C%2522strokeWidth%2522%253A2%257D%255D
	const visualSteeringMap = (t: number) => {
		if (t < 0.3125) return ((1 - 0.875) / (0.3125 - 0)) * (t - 0) + 0.875
		return ((0.3125 - 1) / (1 - 0.3125)) * (t - 0.3125) + 1
	}

	let angularDamping = 2.8
	const angularDampingWhenBelowSteeringVelocityThreshold = 40
	let angularDampingWhenInAir = 0.1
	let angularDampingWhenBrakingInAir = 14

	let linearDamping = 0.3
	let linearDampingWhenInAir = 0.1
	let linearDampingWhenBrakingInAir = 0.5

	let virtualCenterOfMass = new Vector3(0.02, -0.1, 0)

	// https://ease-everything.vercel.app/?path=%255B%2522Path%2522%252C%257B%2522applyMatrix%2522%253Atrue%252C%2522segments%2522%253A%255B%255B0%252C0%255D%252C%255B25%252C200%255D%252C%255B100%252C400%255D%252C%255B100%252C225%255D%252C%255B200%252C400%255D%252C%255B200%252C275%255D%252C%255B300%252C400%255D%252C%255B300%252C300%255D%252C%255B400%252C400%255D%255D%252C%2522strokeColor%2522%253A%255B0.05882%252C0.38039%252C0.99608%255D%252C%2522strokeWidth%2522%253A2%257D%255D
	const rpmMap = (t: number) => {
		if (t < 0.0625) return ((0.5 - 0) / (0.0625 - 0)) * (t - 0) + 0
		if (t < 0.25) return ((1 - 0.5) / (0.25 - 0.0625)) * (t - 0.0625) + 0.5
		if (t < 0.25) return ((0.5625 - 1) / (0.25 - 0.25)) * (t - 0.25) + 1
		if (t < 0.5) return ((1 - 0.5625) / (0.5 - 0.25)) * (t - 0.25) + 0.5625
		if (t < 0.5) return ((0.6875 - 1) / (0.5 - 0.5)) * (t - 0.5) + 1
		if (t < 0.75) return ((1 - 0.6875) / (0.75 - 0.5)) * (t - 0.5) + 0.6875
		if (t < 0.75) return ((0.75 - 1) / (0.75 - 0.75)) * (t - 0.75) + 1
		return ((1 - 0.75) / (1 - 0.75)) * (t - 0.75) + 0.75
	}

	// SOUND
	const minPlaybackRate = 1
	let maxPlaybackRate = 3.5
	let idleVolume = 0.6
	let loadVolume = 1.0
	/**
	 * Defines, how much the engine noise is reduced in volume when the
	 * playbackRate is at minPlaybackRate comapred to maxPlaybackRate.
	 */
	let volumePlaybackRateMultiplier = 0.4
	/**
	 * -------------------------------------------------------
	 * CAR CONFIGURATION END
	 * -------------------------------------------------------
	 */

	/**
	 * -------------------------------------------------------
	 * VIEW CONFIGURATION
	 * -------------------------------------------------------
	 */

	let desiredCameraDistance = 7.2
	let desiredCameraHeight = 2.7
	let cameraDistanceToWalls = 0.5

	/**
	 * -------------------------------------------------------
	 * VIEW CONFIGURATION END
	 * -------------------------------------------------------
	 */

	const spawn = () => {
		if (!rigidBody || !group) return
		rigidBody.setTranslation(
			{
				x: spawnPosition.x,
				y: carBodyHeight / 2 + maxGroundClearance + spawnPosition.y,
				z: spawnPosition.z
			},
			true
		)
		rigidBody.setAngvel({ x: 0, y: 0, z: 0 }, true)
		rigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true)
		rigidBody.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true)
		group.quaternion.set(0, 0, 0, 1)
	}

	// as soon as the rigidBody is available, we set its position and type to dynamic
	$: if (rigidBody) spawn()

	export const respawn = () => spawn()

	// the total length of the suspension travel

	const defaultRay = new Ray({ x: 0, y: 0, z: 0 }, { x: 0, y: -1, z: 0 })

	let wheelStates: WheelState[] = [
		{
			type: Wheel.FL,
			onGround: false,
			suspensionLength: maxGroundClearance,
			ray: defaultRay,
			surfaceImpactNormal: { x: 0, y: 0, z: 0 },
			surfaceImpactPoint: { x: 0, y: 0, z: 0 },
			wheelGroup: undefined as any as Group
		},
		{
			type: Wheel.FR,
			onGround: false,
			suspensionLength: maxGroundClearance,
			ray: defaultRay,
			surfaceImpactNormal: { x: 0, y: 0, z: 0 },
			surfaceImpactPoint: { x: 0, y: 0, z: 0 },
			wheelGroup: undefined as any as Group
		},
		{
			type: Wheel.RL,
			onGround: false,
			suspensionLength: maxGroundClearance,
			ray: defaultRay,
			surfaceImpactNormal: { x: 0, y: 0, z: 0 },
			surfaceImpactPoint: { x: 0, y: 0, z: 0 },
			wheelGroup: undefined as any as Group
		},
		{
			type: Wheel.RR,
			onGround: false,
			suspensionLength: maxGroundClearance,
			ray: defaultRay,
			surfaceImpactNormal: { x: 0, y: 0, z: 0 },
			surfaceImpactPoint: { x: 0, y: 0, z: 0 },
			wheelGroup: undefined as any as Group
		}
	]

	const flWheelState = wheelStates[0]!
	const frWheelState = wheelStates[1]!
	const rlWheelState = wheelStates[2]!
	const rrWheelState = wheelStates[3]!

	const carState: CarState = {
		worldPosition: currentWritable([0, 0, 0]),
		worldQuaternion: currentWritable([0, 0, 0, 1]),
		velocity: currentWritable(0),
		isBraking: currentWritable(false),
		normalizedRpm: currentWritable(0),
		steeringAngle: currentWritable(0)
	}

	let playbackRate = minPlaybackRate
	let _volume = idleVolume

	/**
	 * -------------------------------------------------------
	 * TEMP VARIABLES
	 * -------------------------------------------------------
	 */
	const tempVectorA = new Vector3()
	const tempVectorB = new Vector3()
	const tempQuaternionA = new Quaternion()
	/**
	 * -------------------------------------------------------
	 * TEMP VARIABLES END
	 * -------------------------------------------------------
	 */

	const getLocalRayOriginForWheel = (wheel: Wheel) => {
		const isFront = wheel === Wheel.FL || wheel === Wheel.FR
		const isLeft = wheel === Wheel.FL || wheel === Wheel.RL

		return {
			x: isFront ? -wheelBase / 2 : wheelBase / 2,
			y: -carBodyHeight / 2,
			z: isLeft ? carBodyWidth / 2 : -carBodyWidth / 2
		}
	}

	const getWorldRayOriginForWheel = (
		wheel: Wheel,
		carWorldPosition: RapierVector,
		carWorldRotation: RapierRotation
	) => {
		const localRayOrigin = getLocalRayOriginForWheel(wheel)

		// calculate the world ray origin
		tempVectorA.set(localRayOrigin.x, localRayOrigin.y, localRayOrigin.z)
		tempVectorB.set(carWorldPosition.x, carWorldPosition.y, carWorldPosition.z)
		tempVectorA.applyQuaternion(
			tempQuaternionA.set(
				carWorldRotation.x,
				carWorldRotation.y,
				carWorldRotation.z,
				carWorldRotation.w
			)
		)
		tempVectorB.add(tempVectorA)

		return {
			x: tempVectorB.x,
			y: tempVectorB.y,
			z: tempVectorB.z
		}
	}

	const localPositionToWorld = (
		worldPosition: RapierVector,
		worldRotation: RapierRotation,
		localVector: RapierVector
	) => {
		tempVectorA.set(localVector.x, localVector.y, localVector.z)
		tempVectorA.applyQuaternion(
			tempQuaternionA.set(worldRotation.x, worldRotation.y, worldRotation.z, worldRotation.w)
		)
		tempVectorB.set(worldPosition.x, worldPosition.y, worldPosition.z)
		tempVectorB.add(tempVectorA)

		return {
			x: tempVectorB.x,
			y: tempVectorB.y,
			z: tempVectorB.z
		}
	}

	const setFromRapierVector = (vector: RapierVector, threeVector: Vector3) => {
		return threeVector.set(vector.x, vector.y, vector.z)
	}

	const setFromRapierRotation = (rotation: RapierRotation, quaternion: Quaternion) => {
		return quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w)
	}

	const threeVectorToRapierVector = (threeVector: Vector3) => {
		return {
			x: threeVector.x,
			y: threeVector.y,
			z: threeVector.z
		}
	}

	const collideWithGroup = computeBitMask([0], [], [])

	useFrame((_, delta) => {
		if (!rigidBody || !collider) return

		// we're mostly working with 60fps, so correctedDelta is ~1
		const correctedDelta = delta * 60

		// get and set the basics
		const currentWorldPosition = rigidBody.translation()
		carState.worldPosition.set([
			currentWorldPosition.x,
			currentWorldPosition.y,
			currentWorldPosition.z
		])

		const currentWorldRotation = rigidBody.rotation()
		carState.worldQuaternion.set([
			currentWorldRotation.x,
			currentWorldRotation.y,
			currentWorldRotation.z,
			currentWorldRotation.w
		])

		const linearVelocity = rigidBody.linvel()
		const velocity = length(linearVelocity)

		/**
		 * Velocity from 0 to maxDesiredVelocity
		 */
		const velocityNormalized = clamp(mapLinear(velocity, 0, maxDesiredVelocity, 0, 1), 0, 1)

		setFromRapierVector(linearVelocity, tempVectorA)
		setFromRapierRotation(currentWorldRotation, tempQuaternionA)
		const isForward =
			tempVectorB.set(-1, 0, 0).applyQuaternion(tempQuaternionA).dot(tempVectorA) > 0

		carState.velocity.set(isForward ? velocity : -velocity)

		/**
		 * We're not setting dampings yet, we decide further down what the actual
		 * value should be.
		 */
		let finalAngularDamping = angularDamping
		let finalLinearDamping = linearDamping

		// update the inner group position and rotation
		updateCameraPosition: {
			if (!group || !dummyGroup || !innerGroup) break updateCameraPosition
			// cast a ray from the center of the car to the desired camera position
			group.quaternion.slerp(tempQuaternionA, 0.1)
			group.position.x = currentWorldPosition.x
			group.position.y = currentWorldPosition.y
			group.position.z = currentWorldPosition.z
			dummyGroup.getWorldPosition(tempVectorA)
			const origin = currentWorldPosition
			const direction = fromAToB(origin, tempVectorA)
			const rayLength = length(direction)
			const normalizedDirection = normalize(direction)
			const ray = new Ray(origin, normalizedDirection)
			const hit = world.castRay(
				ray,
				rayLength + cameraDistanceToWalls,
				true,
				undefined,
				collideWithGroup,
				collider,
				rigidBody
			)
			if (!hit) {
				innerGroup.position.copy(dummyGroup.position)
			} else {
				innerGroup.position
					.copy(dummyGroup.position)
					.normalize()
					.multiplyScalar(hit.toi - cameraDistanceToWalls)
			}
		}

		// convert the ray dir to world space
		const localRayDirection = { x: 0, y: -1, z: 0 }
		setFromRapierRotation(currentWorldRotation, tempQuaternionA)
		setFromRapierVector(localRayDirection, tempVectorA)
		tempVectorA.applyQuaternion(tempQuaternionA)
		const worldRayDirection = threeVectorToRapierVector(tempVectorA)

		let suspensionForceSum = 0

		wheelStates.forEach((wheelState) => {
			const ray = new Ray(
				getWorldRayOriginForWheel(wheelState.type, currentWorldPosition, currentWorldRotation),
				worldRayDirection
			)

			wheelState.ray = ray
			const hit = world.castRayAndGetNormal(
				ray,
				maxGroundClearance,
				true,
				undefined,
				collideWithGroup,
				collider,
				rigidBody
			)

			if (hit && !hit.collider.isSensor()) {
				// wheel is touching the ground
				wheelState.onGround = true

				const surfaceImpactPoint = ray.pointAt(hit.toi)
				const surfaceImpactNormal = hit.normal

				wheelState.surfaceImpactPoint = surfaceImpactPoint
				wheelState.surfaceImpactNormal = surfaceImpactNormal

				/**
				 * -----------------------------------------
				 * SUSPENSION IMPULSE
				 * -----------------------------------------
				 */
				const suspensionForce =
					suspensionStiffness * (maxGroundClearance - hit.toi) +
					(suspensionDamping * (wheelState.suspensionLength - hit.toi)) / delta

				setFromRapierVector(ray.pointAt(1), tempVectorA)
				setFromRapierVector(ray.origin, tempVectorB)
				// the sub result vector is already normalized because of pointAt(1)
				tempVectorB
					.sub(tempVectorA)
					.multiplyScalar(suspensionForce)
					.multiplyScalar(suspensionImpulseMultiplier)

				suspensionForceSum += tempVectorB.length()

				const suspensionImpulse = { x: tempVectorB.x, y: tempVectorB.y, z: tempVectorB.z }
				if (!freeze) {
					rigidBody.applyImpulseAtPoint(suspensionImpulse, surfaceImpactPoint, true)
					if (debug) {
						updateImpulseVisualisation(`${wheelState.type}-suspension`, {
							color: 'red',
							impulse: suspensionImpulse,
							origin: surfaceImpactPoint,
							multiplier: 1 / suspensionImpulseMultiplier
						})
					}
				}

				wheelState.suspensionLength = hit.toi
			} else {
				wheelState.onGround = false
				if (debug) {
					clearImpulseVisualisation(`${wheelState.type}-suspension`)
				}
			}

			// update wheel state
			if (wheelState.wheelGroup) {
				const localRayOriginPosition = getLocalRayOriginForWheel(wheelState.type)
				tempVectorA.set(
					localRayOriginPosition.x,
					localRayOriginPosition.y,
					localRayOriginPosition.z
				)
				tempVectorB.set(0, hit ? -hit.toi : -maxGroundClearance, 0)
				tempVectorA.add(tempVectorB)
				tempVectorA.y += wheelRadius
				wheelState.wheelGroup.position.copy(tempVectorA)
			}
		})

		// We're calculating the average surface normal of all wheels that are on the ground
		const groundedWheels = wheelStates.filter((wheelState) => wheelState.onGround)

		// calculate average surface normal
		const averageImpactSurfaceNormal = groundedWheels.reduce((acc, wheelState) => {
			acc.add(
				tempVectorA.set(
					wheelState.surfaceImpactNormal.x,
					wheelState.surfaceImpactNormal.y,
					wheelState.surfaceImpactNormal.z
				)
			)
			return acc
		}, new Vector3(0, 0, 0))

		// Only apply the torque if we're on the ground with at least one front wheel
		if (flWheelState.onGround || frWheelState.onGround) {
			/**
			 * -----------------------------------------
			 * STEERING TORQUE
			 * -----------------------------------------
			 */
			if (velocity > steeringVelocityThreshold) {
				// we're moving, so set the angular damping to the default
				finalAngularDamping = angularDamping

				// the side torque is a function of the velocity multiplied by the
				// steering input and a multiplier
				const steeringTorque =
					(isForward ? $axis.x : -$axis.x) *
					steeringTorqueMultiplier *
					correctedDelta *
					steeringMap(velocityNormalized)
				const steeringTorqueImpulse = averageImpactSurfaceNormal
					.clone()
					.normalize()
					.multiplyScalar(steeringTorque)

				if (active) {
					rigidBody.applyTorqueImpulse(steeringTorqueImpulse, true)

					if (debug) {
						updateImpulseVisualisation(`steeringTorque`, {
							color: 'green',
							impulse: steeringTorqueImpulse,
							origin: currentWorldPosition,
							multiplier: 1 / steeringTorqueMultiplier
						})
					}
				}
			} else {
				// if we're not moving, reset the angular velocity
				finalAngularDamping = angularDampingWhenBelowSteeringVelocityThreshold
				if (debug) {
					updateImpulseVisualisation(`steeringTorque`, {
						color: 'green',
						impulse: { x: 0, y: 0, z: 0 },
						origin: currentWorldPosition
					})
				}
			}
		}

		/**
		 * forward impulse, side impulse and steering torque is only applied when
		 * the car is touching the ground!
		 */
		if (wheelStates.some((wheelState) => wheelState.onGround)) {
			// we're at least a bit on the ground

			/**
			 * -----------------------------------------
			 * FORWARD IMPULSE
			 * -----------------------------------------
			 *
			 * The "ideal" forward impulse is calculated but later applied as part
			 * of the sum of forward and side impulse.
			 * https://digitalrune.github.io/DigitalRune-Documentation/html/143af493-329d-408f-975d-e63625646f2f.htm
			 */

			let mode: 'accelerate' | 'brake' = 'accelerate'
			if (isForward && $axis.y < 0) mode = 'brake'

			const multiplier =
				mode === 'accelerate'
					? isForward
						? forwardImpulseMultiplier
						: backwardImpulseMultiplier
					: brakeImpulseMultiplier
			const map =
				mode === 'accelerate'
					? isForward
						? forwardImpulseMap
						: backwardImpulseMap
					: brakeImpulseMap

			carState.isBraking.set(mode === 'brake')

			const forwardImpulse = threeVectorToRapierVector(
				tempVectorA
					.set(-$axis.y * multiplier * map(velocityNormalized) * correctedDelta, 0, 0)
					.applyQuaternion(
						tempQuaternionA.set(
							currentWorldRotation.x,
							currentWorldRotation.y,
							currentWorldRotation.z,
							currentWorldRotation.w
						)
					)
					.projectOnPlane(averageImpactSurfaceNormal.clone().divideScalar(groundedWheels.length))
			)

			// the inclination is:
			// 0 when the car on a vertical surface going down
			// 0.5 when the car is on a flat surface
			// 1 when the car is on a vertical surface going up
			const inclination = mapLinear(
				setFromRapierVector(forwardImpulse, tempVectorA).normalize().y,
				-1,
				1,
				0,
				1
			)
			const finalForwardImpulse = threeVectorToRapierVector(
				setFromRapierVector(forwardImpulse, tempVectorA)
					.multiplyScalar(forwardImpulseInclinationMap(inclination))
					.multiplyScalar(active ? 1 : 0)
			)

			const forwardImpulseOrigin = localPositionToWorld(
				currentWorldPosition,
				currentWorldRotation,
				virtualCenterOfMass
			)

			if (debug) {
				updateImpulseVisualisation(`forwardImpulse`, {
					color: 'blue',
					impulse: finalForwardImpulse,
					origin: forwardImpulseOrigin,
					multiplier: 1 / forwardImpulseMultiplier
				})
			}

			/**
			 * -----------------------------------------
			 * SIDE IMPULSE
			 * -----------------------------------------
			 *
			 * The "ideal" side impulse is calculated but later applied as part
			 * of the sum of forward and side impulse.
			 * https://digitalrune.github.io/DigitalRune-Documentation/html/143af493-329d-408f-975d-e63625646f2f.htm
			 */

			tempVectorA.set(linearVelocity.x, linearVelocity.y, linearVelocity.z)

			tempQuaternionA.set(
				currentWorldRotation.x,
				currentWorldRotation.y,
				currentWorldRotation.z,
				currentWorldRotation.w
			)

			const currentVelocityDot = tempVectorB
				.set(0, 0, -1)
				.applyQuaternion(tempQuaternionA)
				.dot(tempVectorA)

			const sideImpulseVector = tempVectorB
				.set(0, 0, 1)
				.applyQuaternion(tempQuaternionA)
				.multiplyScalar(currentVelocityDot * carWeight)

			const sideImpulse = {
				x: sideImpulseVector.x,
				y: sideImpulseVector.y,
				z: sideImpulseVector.z
			}

			if (debug) {
				updateImpulseVisualisation(`sideImpulse`, {
					color: 'orange',
					impulse: sideImpulse,
					origin: forwardImpulseOrigin,
					multiplier: 1 / (carWeight * 4)
				})
			}

			/**
			 * -----------------------------------------
			 * SUMMED IMPULSE
			 * -----------------------------------------
			 *
			 * Only now we apply the summed impulse, which is the sum of the
			 * forward and side impulse.
			 * https://digitalrune.github.io/DigitalRune-Documentation/html/143af493-329d-408f-975d-e63625646f2f.htm
			 */

			const maxFrictionForce = frictionCoefficient * suspensionForceSum

			const forwardSideSum = add(finalForwardImpulse, sideImpulse)
			const forwardSideSumLength = length(forwardSideSum)
			if (forwardSideSumLength > maxFrictionForce) {
				const ratio = maxFrictionForce / forwardSideSumLength
				forwardSideSum.x *= ratio
				forwardSideSum.y *= ratio
				forwardSideSum.z *= ratio
			} else {
			}

			// apply summed	forward and side impulse
			if (!freeze) {
				rigidBody.applyImpulseAtPoint(forwardSideSum, forwardImpulseOrigin, true)

				if (debug) {
					updateImpulseVisualisation(`summedSideForwardImpulse`, {
						color: 'yellow',
						impulse: forwardSideSum,
						origin: forwardImpulseOrigin,
						multiplier: 1 / maxFrictionForce
					})
				}
			}

			// we're on the ground, so set the linear damping to the default
			finalLinearDamping = linearDamping

			// calculate the normalized rpm
			carState.normalizedRpm.set(
				rpmMap(
					clamp(mapLinear(Math.abs(carState.velocity.current), 0, maxDesiredVelocity, 0, 1), 0, 1)
				)
			)

			// set the playback rate according to the ground speed when we're touching the ground
			const desiredPlaybackRate = mapLinear(
				carState.normalizedRpm.current,
				0,
				1,
				minPlaybackRate,
				maxPlaybackRate
			)

			// we're lerping toward desiredPlaybackRate
			playbackRate = lerp(playbackRate, desiredPlaybackRate, 0.4)
		} else {
			// we're airborne

			if (debug) {
				clearImpulseVisualisation('forwardImpulse')
				clearImpulseVisualisation('steeringTorque')
				clearImpulseVisualisation('sideImpulse')
				clearImpulseVisualisation('summedSideForwardImpulse')
			}

			// if we're not touching the ground, the rpm is adhering to the forward input …
			const rawNormalizedRpm = rpmMap(Math.max($axis.y, 0) * (active ? 1 : 0))

			// … but we're lerping a bit to smooth it out.
			carState.normalizedRpm.update((normalizedRpm) => {
				return lerp(normalizedRpm, rawNormalizedRpm, 0.1)
			})

			playbackRate = mapLinear(
				carState.normalizedRpm.current,
				0,
				1,
				minPlaybackRate,
				maxPlaybackRate
			)

			// we also set carState.isBraking based on the yAxis
			carState.isBraking.set($axis.y < 0)

			// if braking mid-air, the car can be stopped rotating and moving slightly
			if (carState.isBraking.current) {
				finalLinearDamping = linearDampingWhenBrakingInAir
				finalAngularDamping = angularDampingWhenBrakingInAir
			} else {
				// we're in the air, so set the dampings appropriately
				finalLinearDamping = linearDampingWhenInAir
				finalAngularDamping = angularDampingWhenInAir
			}
		}

		// even if we're airborn, we still set the steering angle
		// get the linear velocity of the car
		if (!freeze) {
			steeringAngle.set(
				visualSteeringMap(velocityNormalized) *
					$axis.x *
					maxSteeringAngle *
					DEG2RAD *
					(active ? 1 : 0)
			)
		} else {
			steeringAngle.update((s) => s)
		}
		carState.steeringAngle.set($steeringAngle)

		// the volume is set by the "forward" input
		const desiredVolume =
			mapLinear(Math.max($axis.y, 0), 0, 1, idleVolume, loadVolume) *
			mapLinear(playbackRate, minPlaybackRate, maxPlaybackRate, volumePlaybackRateMultiplier, 1)
		// we're lerping toward desiredVolume
		const volumeIsGoingUp = desiredVolume > _volume
		const t = volumeIsGoingUp ? 0.4 : 0.05
		_volume = lerp(_volume, desiredVolume, t) * volume

		// set the dampings
		if (!freeze) {
			rigidBody.setAngularDamping(finalAngularDamping)
			rigidBody.setLinearDamping(finalLinearDamping)
		}

		// tell svelte to update stuff
		wheelStates = wheelStates
		impulseVisualisations = impulseVisualisations

		if (!debug && impulseVisualisations.length) {
			impulseVisualisations.length = 0
		} else if (debug) {
			impulseVisualisations = impulseVisualisations
		}
	})
</script>

{#if useAudio}
	<Audio src="/sfx/engine6_normalized.wav" loop autoplay volume={_volume} {playbackRate} />
{/if}

{#each impulseVisualisations as impulseVisualisation (impulseVisualisation.id)}
	<Impulse
		origin={impulseVisualisation.origin}
		impulse={impulseVisualisation.impulse}
		length={impulseVisualisation.length}
		color={impulseVisualisation.color}
		multiplier={impulseVisualisation.multiplier}
	/>
{/each}

<T.Group>
	<slot {carState} />

	<RigidBody canSleep={false} type="dynamic" bind:rigidBody enabled={!freeze}>
		<Collider
			restitution={0}
			friction={0.4}
			mass={carWeight}
			bind:collider
			shape="roundCuboid"
			args={[
				carBodyLength / 2 - carBodyRadius,
				carBodyHeight / 2 - carBodyRadius,
				carBodyWidth / 2 - carBodyRadius,
				carBodyRadius
			]}
		>
			{#if !debug}
				<slot {carState} name="body" />

				<!-- WHEEL SLOTS -->
				<T.Group bind:ref={flWheelState.wheelGroup} rotation.y={$steeringAngle}>
					<slot name="wheel-fl" />
				</T.Group>
				<T.Group
					bind:ref={frWheelState.wheelGroup}
					rotation.y={$steeringAngle + (180 * Math.PI) / 180}
				>
					<slot name="wheel-fr" />
				</T.Group>
				<T.Group bind:ref={rlWheelState.wheelGroup}>
					<slot name="wheel-rl" />
				</T.Group>
				<T.Group bind:ref={rrWheelState.wheelGroup} rotation.y={(180 * Math.PI) / 180}>
					<slot name="wheel-rr" />
				</T.Group>
			{/if}
		</Collider>
	</RigidBody>

	<T.Group bind:ref={group} let:ref>
		<T.Group
			bind:ref={dummyGroup}
			position.x={desiredCameraDistance}
			position.y={desiredCameraHeight}
		/>
		<T.Group bind:ref={innerGroup}>
			<slot name="camera" {ref} />
		</T.Group>
	</T.Group>
</T.Group>
