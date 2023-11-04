<script lang="ts">
	import { onMount } from 'svelte'
	import { Box3, Vector3 } from 'three'
	import type { CarState } from '../Car/RaycastVehicleController/types'

	export let expandBy = 10
	export let expandY = 1000
	export let checkEverySeconds = 1
	export let carState: CarState
	export let boundsBox3: Box3

	const worldPosition = new Vector3()

	let isOutOfBounds = false

	$: virtualBoundsBox3 = boundsBox3.clone()
	$: {
		virtualBoundsBox3.expandByScalar(expandBy)
		virtualBoundsBox3.max.y += expandY - expandBy
	}

	onMount(() => {
		const interval = setInterval(() => {
			if (!virtualBoundsBox3) return
			worldPosition.set(...carState.worldPosition.current)
			isOutOfBounds = !virtualBoundsBox3.containsPoint(worldPosition)
		}, checkEverySeconds * 1000)

		return () => {
			clearInterval(interval)
		}
	})
</script>

<slot {isOutOfBounds} />
