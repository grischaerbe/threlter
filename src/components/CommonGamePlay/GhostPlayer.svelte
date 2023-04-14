<script lang="ts">
	import { T, useFrame } from '@threlte/core'
	import type { Group } from 'three'
	import { DEG2RAD } from 'three/src/math/MathUtils'
	import type { Ghost } from '../../lib/TrackRecord/Ghost'
	import MuscleCar from '../Car/Models/MuscleCar.svelte'
	import MuscleCarWheel from '../Car/Models/MuscleCarWheel.svelte'

	export let ghost: Ghost
	export let time: number

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
		}
	})

	const wheelBase = 2.56
	const width = 1.9
	const height = -0.4
</script>

{#if showGhost}
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
