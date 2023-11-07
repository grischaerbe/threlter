<script lang="ts">
	import { T, useLoader, useThrelte } from '@threlte/core'
	import { useSuspense, useTexture } from '@threlte/extras'
	import { onDestroy } from 'svelte'
	import { BackSide, EquirectangularReflectionMapping } from 'three'
	import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
	import { DEG2RAD } from 'three/src/math/MathUtils'

	export let background = true

	const { scene } = useThrelte()

	const suspend = useSuspense()

	// ENVIROMENT & BACKGROUND
	let previousEnvironment = scene.environment
	const rgbeLoader = useLoader(RGBELoader)
	const env = suspend(
		rgbeLoader.load('/backgrounds/rustig_koppie_puresky_1k.hdr', {
			transform(result) {
				result.colorSpace = 'srgb'
				result.mapping = EquirectangularReflectionMapping
				return result
			}
		})
	)
	$: if ($env) scene.environment = $env

	onDestroy(() => {
		scene.environment = previousEnvironment
	})
</script>

{#if background}
	{#await suspend(useTexture('/backgrounds/bg_sdr.jpg')) then map}
		<T.Mesh rotation.y={-60 * DEG2RAD}>
			<!-- Default far of PerspectiveCamera is 2000, so 1000 in radius should be fine -->
			<T.SphereGeometry args={[1000, 16, 16]} />
			<T.MeshBasicMaterial {map} side={BackSide} />
		</T.Mesh>
	{/await}
{/if}
