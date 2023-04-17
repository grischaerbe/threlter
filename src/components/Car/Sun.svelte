<!--
  The sun needs to be a child of the Car because the Shadow Camera needs to move with it.
-->

<script lang="ts">
	import { T, useThrelte, type CurrentWritable } from '@threlte/core'
	import { Portal } from '@threlte/extras'
	import { sunPos } from '../../config'
	import { appState } from '../../stores/app'
	import type { CarState } from './RaycastVehicleController/types'

	export let carState: CarState

	const { worldPosition } = carState

	const { shadows } = appState.options.video

	const { scene } = useThrelte()
</script>

{#if $shadows}
	<T.DirectionalLight
		intensity={0.4}
		position.x={$worldPosition[0] + sunPos[0] * 10}
		position.y={$worldPosition[1] + sunPos[1] * 10}
		position.z={$worldPosition[2] + sunPos[0] * 10}
		shadow.camera.left={-30}
		shadow.camera.right={30}
		shadow.camera.top={30}
		shadow.camera.bottom={-30}
		castShadow
		let:ref
	>
		<Portal object={scene}>
			<T
				is={ref.target}
				position.x={$worldPosition[0]}
				position.y={$worldPosition[1]}
				position.z={$worldPosition[2]}
			/>
		</Portal>
	</T.DirectionalLight>
{:else}
	<T.DirectionalLight
		intensity={0.4}
		position.x={sunPos[0]}
		position.y={sunPos[1]}
		position.z={sunPos[0]}
	/>
{/if}
