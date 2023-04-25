<script lang="ts">
	import { T, useFrame } from '@threlte/core'
	import type { Group } from 'three'
	import { DEG2RAD, clamp, mapLinear } from 'three/src/math/MathUtils'
	import type { Ghost } from '../../lib/TrackRecord/Ghost'
	import MuscleCarGhost from '../Car/Models/MuscleCarGhost.svelte'
	import MuscleCarGhostWheel from '../Car/Models/MuscleCarGhostWheel.svelte'
	import type { CarState } from '../Car/RaycastVehicleController/types'

	export let ghost: Ghost
	export let time: number
	export let carState: CarState

	let opacity = 0

	$: ghost.calculateAverageTimeBetweenFrames()

	let group: Group

	let showGhost = true

	useFrame(() => {
		if (!ghost.frames.length) {
			showGhost = false
			return
		}
		if (time > ghost.lastFrameTime || time < ghost.firstFrameTime) {
			showGhost = false
			return
		}
		const currentFrame = ghost.getFrame(time)
		if (!currentFrame) {
			showGhost = false
			return
		} else {
			showGhost = true
			group?.position.set(...currentFrame.position)
			group?.quaternion.set(...currentFrame.quaternion)

			// get distance from two [number, number, number] vectors
			const distanceFromCarToGhost = Math.sqrt(
				Math.pow(currentFrame.position[0] - carState.worldPosition.current[0], 2) +
					Math.pow(currentFrame.position[1] - carState.worldPosition.current[1], 2) +
					Math.pow(currentFrame.position[2] - carState.worldPosition.current[2], 2)
			)

			opacity = clamp(mapLinear(distanceFromCarToGhost, 1, 10, 0, 0.5), 0, 0.5)
		}
	})

	const wheelBase = 2.56
	const width = 1.9
	const height = -0.4
</script>

{#if showGhost}
	<T.Group bind:ref={group}>
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
	</T.Group>
{/if}
