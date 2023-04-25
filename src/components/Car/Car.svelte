<script lang="ts">
	import { useEvent } from '$hooks/useEvents'
	import { appState } from '$stores/app'
	import { T } from '@threlte/core'
	import { onDestroy } from 'svelte'
	import { PerspectiveCamera, Quaternion, Vector3 } from 'three'
	import { DEG2RAD } from 'three/src/math/MathUtils'
	import { useKeyboardNavigation } from '../UI/KeyboardNavigation.svelte'
	import MuscleCar from './Models/MuscleCar.svelte'
	import MuscleCarWheel from './Models/MuscleCarWheel.svelte'
	import RaycastVehicleController from './RaycastVehicleController/RaycastVehicleController.svelte'
	import Sun from './Sun.svelte'
	import WheelRotation from './WheelRotation.svelte'
	import { writable } from 'svelte/store'
	import { onReveal } from '@threlte/extras'

	let carCam: PerspectiveCamera
	let freezeCam: PerspectiveCamera

	const { sfx } = appState.options.audio
	const { debug } = appState.options

	const revealed = writable(false)
	onReveal(() => {
		revealed.set(true)
	})

	let respawnCar: (() => void) | undefined = undefined

	useEvent('respawn-car', () => {
		respawnCar?.()
	})

	export let active = false
	export let freeze = false
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

<RaycastVehicleController
	bind:respawn={respawnCar}
	debug={$debug}
	{active}
	{volume}
	useAudio={$sfx && $revealed}
	{freeze}
	let:carState
>
	<T.PerspectiveCamera
		bind:ref={carCam}
		slot="camera"
		rotation={[-90 * DEG2RAD, 75 * DEG2RAD, 90 * DEG2RAD]}
		fov={70}
		makeDefault={camera === 'car'}
	/>

	<T.Group slot="body" rotation.y={(-90 * Math.PI) / 180}>
		<MuscleCar {carState} />
	</T.Group>

	<T.Group rotation.y={(90 * Math.PI) / 180} slot="wheel-fl">
		<WheelRotation {carState}>
			<MuscleCarWheel />
		</WheelRotation>
	</T.Group>

	<T.Group rotation.y={(90 * Math.PI) / 180} slot="wheel-fr">
		<WheelRotation {carState}>
			<MuscleCarWheel />
		</WheelRotation>
	</T.Group>

	<T.Group rotation.y={(90 * Math.PI) / 180} slot="wheel-rl">
		<WheelRotation {carState}>
			<MuscleCarWheel />
		</WheelRotation>
	</T.Group>

	<T.Group rotation.y={(90 * Math.PI) / 180} slot="wheel-rr">
		<WheelRotation {carState}>
			<MuscleCarWheel />
		</WheelRotation>
	</T.Group>

	<svelte:fragment let:carState>
		<slot {carState} />

		<Sun {carState} />
	</svelte:fragment>
</RaycastVehicleController>
