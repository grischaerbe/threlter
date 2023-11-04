<script lang="ts">
	import { T, useFrame, useThrelte } from '@threlte/core'
	import { Text } from '@threlte/extras'
	import type { ComponentProps } from 'svelte'
	import { Group } from 'three'
	import { DEG2RAD, clamp, mapLinear } from 'three/src/math/MathUtils'
	import { TrackManager } from '../../lib/TrackManager/TrackManager'
	import type { TrackRecord } from '../../lib/TrackRecord/TrackRecord'
	import MuscleCarGhost from '../Car/Models/MuscleCarGhost.svelte'
	import MuscleCarGhostWheel from '../Car/Models/MuscleCarGhostWheel.svelte'
	import type { CarState } from '../Car/RaycastVehicleController/types'

	export let trackRecord: TrackRecord
	export let time: number
	export let carState: CarState

	$: ghost = trackRecord.ghost

	const { camera } = useThrelte()

	let opacity = 0

	const positionGroup = new Group()
	const rotationGroup = new Group()
	let text: ComponentProps<Text>['ref']

	let showGhost = true

	let userPromise = TrackManager.getUser([trackRecord.userId])

	useFrame(() => {
		// we didn't start playing yet
		if (time === 0) {
			if (!ghost.isInitialized()) {
				ghost.initializePlayback()
			}
			showGhost = false
			return
		}

		// we don't have any more frames
		if (!ghost.hasPlaybackFrames()) {
			showGhost = false
			return
		}

		// get the current frame
		const currentFrame = ghost.getPlaybackFrame(time)

		// if for some reason we don't have a frame
		if (!currentFrame) {
			showGhost = false
			return
		} else {
			showGhost = true
			positionGroup.position.set(...currentFrame.position)
			rotationGroup.quaternion.set(...currentFrame.quaternion)

			// get distance from two [number, number, number] vectors
			const distanceFromCarToGhost = Math.sqrt(
				Math.pow(currentFrame.position[0] - carState.worldPosition.current[0], 2) +
					Math.pow(currentFrame.position[1] - carState.worldPosition.current[1], 2) +
					Math.pow(currentFrame.position[2] - carState.worldPosition.current[2], 2)
			)

			opacity = clamp(mapLinear(distanceFromCarToGhost, 1, 10, 0, 0.5), 0, 0.5)

			if (text) {
				text.up.set($camera.up.x, $camera.up.y, $camera.up.z)
				text.lookAt($camera.position)
				text.fillOpacity = opacity
			}
		}
	})

	const wheelBase = 2.56
	const width = 1.9
	const height = -0.4
</script>

<T is={positionGroup} visible={showGhost}>
	{#await userPromise then user}
		<Text
			font="/fonts/Rubik-Regular.ttf"
			bind:ref={text}
			text={user[0].username}
			fontSize={0.4}
			anchorX="50%"
			anchorY="100%"
			position.y={1}
		/>
	{/await}

	<T is={rotationGroup}>
		<T.Group rotation.y={-90 * DEG2RAD}>
			<MuscleCarGhost {opacity} />

			<T.Group position.y={height}>
				<!-- FRONT WHEELS -->
				<T.Group position.z={wheelBase / 2}>
					<!-- FRONT LEFT WHEEL -->
					<T.Group position.x={width / 2} rotation.z={180 * DEG2RAD}>
						<MuscleCarGhostWheel {opacity} />
					</T.Group>

					<!-- FRONT RIGHT WHEEL -->
					<T.Group position.x={-width / 2}>
						<MuscleCarGhostWheel {opacity} />
					</T.Group>
				</T.Group>

				<!-- BACK WHEELS -->
				<T.Group position.z={-wheelBase / 2}>
					<!-- BACK LEFT WHEEL -->
					<T.Group position.x={width / 2} rotation.z={180 * DEG2RAD}>
						<MuscleCarGhostWheel {opacity} />
					</T.Group>

					<!-- BACK RIGHT WHEEL -->
					<T.Group position.x={-width / 2}>
						<MuscleCarGhostWheel {opacity} />
					</T.Group>
				</T.Group>
			</T.Group>
		</T.Group>
	</T>
</T>
