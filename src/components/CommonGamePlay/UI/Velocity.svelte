<script lang="ts">
	import { useFrame } from '@threlte/core'
	import type { CarState } from '../../Car/RaycastVehicleController/types'
	import UiWrapper from '../../UI/UiWrapper.svelte'
	import { Vector3 } from 'three'

	export let carState: CarState

	const velocity = carState.velocity
	// const v1 = new Vector3(...carState.worldPosition.current)
	// const v2 = new Vector3()

	// let vel2 = 0

	// useFrame(
	// 	(_, deltaTime) => {
	// 		v2.set(...carState.worldPosition.current)
	// 		const delta = v1.sub(v2).length()
	// 		vel2 = delta / deltaTime
	// 		v1.copy(v2)
	// 	},
	// 	{
	// 		order: 10
	// 	}
	// )
</script>

<UiWrapper>
	<div class="absolute bottom-3 right-3 text-orange font-mono">
		{Math.round(Math.abs($velocity))}
		<!-- {Math.round(Math.abs(vel2))} -->
	</div>
</UiWrapper>
