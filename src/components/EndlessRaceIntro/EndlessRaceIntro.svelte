<script lang="ts">
	import CameraFade from '$components//Utilities/CameraFade.svelte'
	import { appState } from '$stores/app'
	import { T, useFrame, useThrelte } from '@threlte/core'
	import { Float, onReveal } from '@threlte/extras'
	import { createEventDispatcher, onDestroy, onMount } from 'svelte'
	import { cubicInOut, quadOut, sineOut } from 'svelte/easing'
	import { tweened } from 'svelte/motion'
	import { Color, PerspectiveCamera } from 'three'
	import { DEG2RAD } from 'three/src/math/MathUtils'
	import { introLength } from '../../config'
	import MuscleCar from '../Car/Models/MuscleCar.svelte'
	import MuscleCarWheel from '../Car/Models/MuscleCarWheel.svelte'
	import { dummyCarState } from '../Car/carState'
	import Box from './Box.svelte'

	const { options } = appState

	const dispatch = createEventDispatcher<{
		introcomplete: void
	}>()

	const { shadows } = options.video

	let camera: PerspectiveCamera

	export let showIntro: boolean

	type AnimationValue<T = any> = [intro: T, regular: T]

	const initialValue = <T>(initialValue: AnimationValue<T>): T => {
		if (showIntro) return initialValue[0]
		return initialValue[1]
	}

	const regularValue = <T>(initialValue: AnimationValue<T>): T => {
		return initialValue[1]
	}

	const rotationYAnimationValue: AnimationValue<number> = [0, 1.3]
	const rotationY = tweened(initialValue(rotationYAnimationValue), {
		duration: 30e3,
		easing: sineOut
	})

	const cameraPosYAnimationValue: AnimationValue<number> = [0, 1.7]
	const cameraPosY = tweened(initialValue(cameraPosYAnimationValue), {
		duration: 30e3,
		easing: sineOut
	})

	const fadeAnimationValue: AnimationValue<number> = [1, 0]
	const init = initialValue(fadeAnimationValue)
	const fade = tweened(initialValue(fadeAnimationValue), {
		duration: 3e3,
		easing: cubicInOut
	})
	export let cameraFadeOpacity = $fade
	$: cameraFadeOpacity = $fade

	const fovAnimationValue: AnimationValue<number> = [7, 20]
	const fov = tweened(initialValue(fovAnimationValue), {
		duration: 30e3,
		easing: sineOut
	})

	const lookAtAnimationValue: AnimationValue<[number, number, number]> = [
		[0, 0.7, 2],
		[0, 0.7, 0]
	]
	const lookAt = tweened(initialValue(lookAtAnimationValue), {
		duration: 30e3,
		easing: quadOut
	})

	let timeouts: ReturnType<typeof setTimeout>[] = []

	onReveal(() => {
		if (showIntro) {
			// wait for things to settle down
			timeouts.push(
				setTimeout(() => {
					fov.set(regularValue(fovAnimationValue))
					lookAt.set(regularValue(lookAtAnimationValue))
					rotationY.set(regularValue(rotationYAnimationValue))
					cameraPosY.set(regularValue(cameraPosYAnimationValue))
					fade.set(regularValue(fadeAnimationValue))
				}, 1e3)
			)

			timeouts.push(
				setTimeout(() => {
					dispatch('introcomplete')
				}, introLength)
			)
		}
	})

	onDestroy(() => {
		timeouts.forEach((timeout) => {
			clearTimeout(timeout)
		})
	})

	let wheelRotation = 0
	useFrame(() => {
		wheelRotation += 1
	})

	const wheelBase = 2.56
	const width = 1.9
	const height = -0.4

	$: if (camera) {
		camera.lookAt(...$lookAt)
	}

	let offset = 0

	const boxComponents = [Box]
	const boxLength = 5
	const trackElements = 40
	const trackLength = trackElements * boxLength
	const elementComponents = new Array(trackElements).fill(0).map(() => {
		const index = Math.floor(Math.random() * boxComponents.length)
		return boxComponents[index]
	})
	const initialPositions = new Array(trackElements).fill(0).map((_, index) => {
		return index * boxLength - trackLength
	})

	let absolutePositions = [...initialPositions]
	let currentPositions = [...initialPositions]

	let speed = 0.5

	useFrame(() => {
		offset += speed
		absolutePositions = initialPositions.map((initialPosition) => {
			return initialPosition - offset
		})
		currentPositions = absolutePositions.map((absolutePosition) => {
			return (absolutePosition % trackLength) + trackLength / 2
		})
	})

	const { scene } = useThrelte()
</script>

<T.Fog
	near={30}
	far={90}
	color={new Color('#454a5e').convertLinearToSRGB()}
	on:create={({ ref, cleanup }) => {
		scene.fog = ref
		cleanup(() => {
			scene.fog = null
		})
	}}
/>

{#each elementComponents as element, index (index)}
	<T.Group position.z={currentPositions[index]} scale={0.5}>
		<svelte:component this={element} />
	</T.Group>
{/each}

<T.Group position.y={0.7}>
	<MuscleCar carState={dummyCarState} />

	<T.Group position.y={height}>
		<!-- FRONT WHEELS -->
		<T.Group position.z={wheelBase / 2}>
			<!-- FRONT LEFT WHEEL -->
			<T.Group position.x={width / 2} rotation.z={180 * DEG2RAD} rotation.x={-wheelRotation}>
				<MuscleCarWheel />
			</T.Group>

			<!-- FRONT RIGHT WHEEL -->
			<T.Group position.x={-width / 2} rotation.x={-wheelRotation}>
				<MuscleCarWheel />
			</T.Group>
		</T.Group>

		<!-- BACK WHEELS -->
		<T.Group position.z={-wheelBase / 2}>
			<!-- BACK LEFT WHEEL -->
			<T.Group position.x={width / 2} rotation.z={180 * DEG2RAD} rotation.x={-wheelRotation}>
				<MuscleCarWheel />
			</T.Group>

			<!-- BACK RIGHT WHEEL -->
			<T.Group position.x={-width / 2} rotation.x={-wheelRotation}>
				<MuscleCarWheel />
			</T.Group>
		</T.Group>
	</T.Group>
</T.Group>

<T.DirectionalLight position={[5, 5, 5]} intensity={1} castShadow={$shadows} />

<T.Group rotation.y={$rotationY}>
	<Float floatIntensity={1} speed={3}>
		<T.PerspectiveCamera makeDefault bind:ref={camera} fov={$fov} position={[-10, $cameraPosY, 10]}>
			<CameraFade opacity={$fade} color="black" />
		</T.PerspectiveCamera>
	</Float>
</T.Group>
