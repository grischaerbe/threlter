<script lang="ts">
	import type { Ghost } from '$lib/TrackRecord/Ghost'
	import { useFrame } from '@threlte/core'
	import type { CarState } from '../Car/RaycastVehicleController/types'

	export let ghost: Ghost
	export let time: number
	export let carState: CarState

	useFrame(() => {
		ghost.addFrame(carState.worldPosition, carState.worldQuaternion, time)
	})
</script>
