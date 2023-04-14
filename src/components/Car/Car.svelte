<script lang="ts">
	import { useEvent } from '$hooks/useEvents'
	import { sunPos } from '$src/config'
	import { appState } from '$stores/app'
	import { T, useThrelte } from '@threlte/core'
	import { Portal } from '@threlte/extras'
	import { onDestroy } from 'svelte'
	import { PerspectiveCamera, Quaternion, Vector3 } from 'three'
	import { DEG2RAD } from 'three/src/math/MathUtils'
	import { useKeyboardNavigation } from '../UI/KeyboardNavigation.svelte'
	import MuscleCar from './Models/MuscleCar.svelte'
	import MuscleCarWheel from './Models/MuscleCarWheel.svelte'
	import RaycastVehicleController from './RaycastVehicleController/RaycastVehicleController.svelte'

	let carCam: PerspectiveCamera
	let freezeCam: PerspectiveCamera

	const { sfx } = appState.options.audio
	const { shadows } = appState.options.video

	let respawnCar: (() => void) | undefined = undefined

	useEvent('respawn-car', () => {
		respawnCar?.()
	})

	export let debug = false
	export let active = false
	export let useCarCamera = true
	export let freezeCamera = false
	export let volume = 1

	const { disable, enable } = useKeyboardNavigation()

	$: if (active) {
		disable()
	} else {
		enable()
	}
	onDestroy(() => {
		enable()
	})

	const { scene } = useThrelte()

	$: if (useCarCamera && freezeCamera && carCam && freezeCam) {
		carCam.updateMatrix()
		const carCamWorldPosition = new Vector3()
		carCam.getWorldPosition(carCamWorldPosition)
		const carCamWorldQuaternion = new Quaternion()
		carCam.getWorldQuaternion(carCamWorldQuaternion)

		freezeCam.position.copy(carCamWorldPosition)
		freezeCam.quaternion.copy(carCamWorldQuaternion)
	}

	$: camera =
		useCarCamera && !freezeCamera ? 'car' : useCarCamera && freezeCamera ? 'carFreeze' : 'default'
</script>

<T.PerspectiveCamera
	bind:ref={freezeCam}
	slot="camera"
	fov={70}
	makeDefault={camera === 'carFreeze'}
/>

<RaycastVehicleController bind:respawn={respawnCar} {debug} {active} {volume} useAudio={$sfx}>
	<T.PerspectiveCamera
		bind:ref={carCam}
		slot="camera"
		rotation={[-90 * DEG2RAD, 75 * DEG2RAD, 90 * DEG2RAD]}
		fov={70}
		makeDefault={camera === 'car'}
	/>

	<svelte:fragment slot="body" let:carState>
		<T.Group rotation.y={(-90 * Math.PI) / 180}>
			<MuscleCar isBraking={carState.isBraking} />
		</T.Group>
	</svelte:fragment>

	<T.Group rotation.y={(90 * Math.PI) / 180} slot="wheel-fl">
		<MuscleCarWheel />
	</T.Group>

	<T.Group rotation.y={(90 * Math.PI) / 180} slot="wheel-fr">
		<MuscleCarWheel />
	</T.Group>

	<T.Group rotation.y={(90 * Math.PI) / 180} slot="wheel-rl">
		<MuscleCarWheel />
	</T.Group>

	<T.Group rotation.y={(90 * Math.PI) / 180} slot="wheel-rr">
		<MuscleCarWheel />
	</T.Group>

	<svelte:fragment let:carState>
		<slot {carState} />

		{#if $shadows}
			<T.DirectionalLight
				intensity={0.4}
				position.x={carState.worldPosition[0] + sunPos[0] * 10}
				position.y={carState.worldPosition[1] + sunPos[1] * 10}
				position.z={carState.worldPosition[2] + sunPos[0] * 10}
				shadow.camera.left={-10}
				shadow.camera.right={10}
				shadow.camera.top={10}
				shadow.camera.bottom={-10}
				castShadow
				let:ref
			>
				<Portal object={scene}>
					<T
						is={ref.target}
						position.x={carState.worldPosition[0]}
						position.y={carState.worldPosition[1]}
						position.z={carState.worldPosition[2]}
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
	</svelte:fragment>
</RaycastVehicleController>
