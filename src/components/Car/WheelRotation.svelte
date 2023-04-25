<script lang="ts">
	import { T, useFrame } from '@threlte/core'
	import type { CarState } from './RaycastVehicleController/types'
	import { Group } from 'three'

	export let carState: CarState
	const { velocity } = carState

	const group = new Group()

	useFrame(() => {
		group.rotateX(velocity.current * -0.07)
	})
</script>

<T is={group}>
	<slot />
</T>
