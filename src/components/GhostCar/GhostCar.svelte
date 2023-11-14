<script lang="ts">
	import { T, useFrame } from '@threlte/core'
	import { Text } from '@threlte/extras'
	import type { ComponentProps } from 'svelte'
	import { Group, ShaderMaterial } from 'three'
	import { DEG2RAD, clamp, mapLinear } from 'three/src/math/MathUtils'
	import MuscleCarGhost from '../Car/Models/MuscleCarGhost.svelte'
	import MuscleCarGhostWheel from '../Car/Models/MuscleCarGhostWheel.svelte'
	import type { CarState } from '../Car/RaycastVehicleController/types'
	import { tweened } from 'svelte/motion'
	import { linear } from 'svelte/easing'

	export let position: [number, number, number]
	export let quaternion: [number, number, number, number]
	export let name: string | undefined = undefined
	export let carState: CarState
	export let tickRate: number

	let opacity = 0

	const positionGroup = new Group()
	const rotationGroup = new Group()

	let text: ComponentProps<Text>['ref']
	const textMaterial = new ShaderMaterial({
		vertexShader: `
			void main() {
				vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
				vec3 scale = vec3( length(modelViewMatrix[0].xyz), length(modelViewMatrix[1].xyz), length(modelViewMatrix[2].xyz) );
				mvPosition.xyz += position * scale;
				gl_Position = projectionMatrix * mvPosition;
			}
		`,
		fragmentShader: `
			uniform float opacity;

			void main() {
				gl_FragColor = vec4(1.0, 1.0, 1.0, opacity);
			}
		`,
		transparent: true,
		uniforms: {
			opacity: { value: 0 }
		}
	})

	const positionTween = tweened<[number, number, number]>(position, {
		duration: 1000 / tickRate,
		easing: linear
	})
	const quaternionTween = tweened(quaternion, {
		duration: 1000 / tickRate,
		easing: linear
	})

	$: positionTween.set(position, {
		duration: 1000 / tickRate
	})
	$: quaternionTween.set(quaternion, {
		duration: 1000 / tickRate
	})

	useFrame(() => {
		positionGroup.position.set(...$positionTween)
		rotationGroup.quaternion.set(...$quaternionTween)

		// get distance from two [number, number, number] vectors
		const distanceFromCarToGhost = Math.sqrt(
			Math.pow(positionGroup.position.x - carState.worldPosition.current[0], 2) +
				Math.pow(positionGroup.position.y - carState.worldPosition.current[1], 2) +
				Math.pow(positionGroup.position.z - carState.worldPosition.current[2], 2)
		)

		opacity = clamp(mapLinear(distanceFromCarToGhost, 1, 10, 0, 0.5), 0, 0.5)

		textMaterial.uniforms.opacity.value = opacity
	})

	const wheelBase = 2.56
	const width = 1.9
	const height = -0.4
</script>

<T is={positionGroup}>
	{#if name}
		<Text
			font="/fonts/Rubik-Regular.ttf"
			bind:ref={text}
			text={name}
			fontSize={0.4}
			anchorX="50%"
			anchorY="100%"
			position.y={1}
			material={textMaterial}
		/>
	{/if}

	<T is={rotationGroup}>
		<T.Group rotation.y={-90 * DEG2RAD}>
			<MuscleCarGhost {opacity} />

			<T.Group position.y={height}>
				<!-- FRONT WHEELS -->
				<T.Group position.z={wheelBase / 2}>
					<!-- FRONT LEFT WHEEL -->
					<T.Group position.x={width / 2} rotation.z={180 * DEG2RAD}>
						<MuscleCarGhostWheel {opacity} />
					</T.Group>

					<!-- FRONT RIGHT WHEEL -->
					<T.Group position.x={-width / 2}>
						<MuscleCarGhostWheel {opacity} />
					</T.Group>
				</T.Group>

				<!-- BACK WHEELS -->
				<T.Group position.z={-wheelBase / 2}>
					<!-- BACK LEFT WHEEL -->
					<T.Group position.x={width / 2} rotation.z={180 * DEG2RAD}>
						<MuscleCarGhostWheel {opacity} />
					</T.Group>

					<!-- BACK RIGHT WHEEL -->
					<T.Group position.x={-width / 2}>
						<MuscleCarGhostWheel {opacity} />
					</T.Group>
				</T.Group>
			</T.Group>
		</T.Group>
	</T>
</T>
