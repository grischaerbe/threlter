<script lang="ts">
	import { appState } from '$stores/app'
	import { T } from '@threlte/core'
	import { onReveal } from '@threlte/extras'
	import { onDestroy, type ComponentProps } from 'svelte'
	import { writable } from 'svelte/store'
	import { PerspectiveCamera, Quaternion, Vector3 } from 'three'
	import { DEG2RAD } from 'three/src/math/MathUtils'
	import { useKeyboardNavigation } from '../UI/KeyboardNavigation.svelte'
	import MuscleCar from './Models/MuscleCar.svelte'
	import MuscleCarWheel from './Models/MuscleCarWheel.svelte'
	import RaycastVehicleController from './RaycastVehicleController/RaycastVehicleController.svelte'
	import WheelRotation from './WheelRotation.svelte'

	let carCam: PerspectiveCamera
	let freezeCam: PerspectiveCamera

	const { sfx } = appState.options.audio
	const { debug } = appState.options

	const revealed = writable(false)
	onReveal(() => {
		revealed.set(true)
	})

	export let active = false
	export let freeze = false
	export let useCarCamera = true
	export let freezeCamera = false
	export let volume = 1

	// forwarded from <RaycastVehicleController>
	export let takeSnapshot: ComponentProps<RaycastVehicleController>['takeSnapshot'] = undefined
	export let restore: ComponentProps<RaycastVehicleController>['restore'] = undefined
	export let clearSnapshot: ComponentProps<RaycastVehicleController>['clearSnapshot'] = undefined
	export let respawn: ComponentProps<RaycastVehicleController>['respawn'] = undefined
	export let hasSnapshot: ComponentProps<RaycastVehicleController>['hasSnapshot'] = undefined

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
	debug={$debug}
	{active}
	{volume}
	useAudio={$sfx && $revealed}
	{freeze}
	let:carState
	bind:respawn
	bind:takeSnapshot
	bind:restore
	bind:clearSnapshot
	bind:hasSnapshot
>
	<slot {carState} />

	<T.PerspectiveCamera
		bind:ref={carCam}
		slot="camera"
		rotation={[-90 * DEG2RAD, 75 * DEG2RAD, 90 * DEG2RAD]}
		fov={70}
		makeDefault={camera === 'car'}
	/>

	<T.Group let:carState slot="body" rotation.y={(-90 * Math.PI) / 180}>
		<MuscleCar {carState} />
	</T.Group>

	<T.Group let:carState rotation.y={(90 * Math.PI) / 180} slot="wheel-fl">
		<WheelRotation {carState}>
			<MuscleCarWheel />
		</WheelRotation>
	</T.Group>

	<T.Group let:carState rotation.y={(90 * Math.PI) / 180} slot="wheel-fr">
		<WheelRotation {carState}>
			<MuscleCarWheel />
		</WheelRotation>
	</T.Group>

	<T.Group let:carState rotation.y={(90 * Math.PI) / 180} slot="wheel-rl">
		<WheelRotation {carState}>
			<MuscleCarWheel />
		</WheelRotation>
	</T.Group>

	<T.Group let:carState rotation.y={(90 * Math.PI) / 180} slot="wheel-rr">
		<WheelRotation {carState}>
			<MuscleCarWheel />
		</WheelRotation>
	</T.Group>
</RaycastVehicleController>
