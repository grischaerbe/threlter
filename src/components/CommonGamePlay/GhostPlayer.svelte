<script lang="ts">
	import { T, useFrame } from '@threlte/core'
	import type { Group } from 'three'
	import { DEG2RAD } from 'three/src/math/MathUtils'
	import type { Ghost } from '../../lib/TrackRecord/Ghost'
	import MuscleCar from '../Car/Models/MuscleCar.svelte'
	import MuscleCarWheel from '../Car/Models/MuscleCarWheel.svelte'

	export let ghost: Ghost
	export let time: number

	$: console.log(ghost)

	$: ghost.calculateAverageTimeBetweenFrames()

	let group: Group

	let showGhost = true

	$: ghostAvailable = ghost.frames.length > 0
	$: combinedShowGhost = ghostAvailable && showGhost

	useFrame(() => {
		if (!group || !ghostAvailable) return
		const currentFrame = ghost.getFrame(time)
		// console.log(currentFrame?.index)

		if (!currentFrame || currentFrame.isLastFrame) {
			showGhost = false
		} else {
			showGhost = true
			group?.position.set(...currentFrame.frame.position)
			group?.quaternion.set(...currentFrame.frame.quaternion)
		}
	})

	const wheelBase = 2.56
	const width = 1.9
	const height = -0.4
</script>

{#if combinedShowGhost}
	<T.Group bind:ref={group}>
		<T.Group rotation.y={-90 * DEG2RAD}>
			<MuscleCar />

			<T.Group position.y={height}>
				<!-- FRONT WHEELS -->
				<T.Group position.z={wheelBase / 2}>
					<!-- FRONT LEFT WHEEL -->
					<T.Group position.x={width / 2} rotation.z={180 * DEG2RAD}>
						<MuscleCarWheel />
					</T.Group>

					<!-- FRONT RIGHT WHEEL -->
					<T.Group position.x={-width / 2}>
						<MuscleCarWheel />
					</T.Group>
				</T.Group>

				<!-- BACK WHEELS -->
				<T.Group position.z={-wheelBase / 2}>
					<!-- BACK LEFT WHEEL -->
					<T.Group position.x={width / 2} rotation.z={180 * DEG2RAD}>
						<MuscleCarWheel />
					</T.Group>

					<!-- BACK RIGHT WHEEL -->
					<T.Group position.x={-width / 2}>
						<MuscleCarWheel />
					</T.Group>
				</T.Group>
			</T.Group>
		</T.Group>
	</T.Group>
{/if}
