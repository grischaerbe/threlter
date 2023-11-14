<script lang="ts">
	import { useFrame, watch } from '@threlte/core'
	import type { CarState } from '../Car/RaycastVehicleController/types'
	import { createEventDispatcher } from 'svelte'

	export let carState: CarState

	const dispatch = createEventDispatcher<{
		carstate: CarState
	}>()

	const { start, stop } = useFrame(
		() => {
			dispatch('carstate', carState)
			stop()
		},
		{
			order: 1,
			autostart: false
		}
	)

	const { worldPosition, worldQuaternion } = carState

	watch([worldPosition, worldQuaternion], ([pos, quat]) => {
		start()
	})
</script>
