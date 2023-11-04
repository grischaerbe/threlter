<script lang="ts">
	import { useRender, useThrelte } from '@threlte/core'
	import {
		BlendFunction,
		BloomEffect,
		BrightnessContrastEffect,
		ChromaticAberrationEffect,
		EffectComposer,
		EffectPass,
		FXAAEffect,
		NoiseEffect,
		RenderPass,
		ToneMappingEffect,
		ToneMappingMode
	} from 'postprocessing'
	import { onDestroy } from 'svelte'
	import { HalfFloatType } from 'three'
	import { appState } from '../stores/app'

	const { postprocessing } = appState.options.video

	/**
	 * Chromatic Aberration
	 */
	const chromaticAberrationEffect = new ChromaticAberrationEffect()
	chromaticAberrationEffect.offset.x = 0.0004
	chromaticAberrationEffect.offset.y = 0.0004

	/**
	 * Tone Mapping
	 */
	const toneMappingEffect = new ToneMappingEffect({
		mode: ToneMappingMode.ACES_FILMIC
	})

	/**
	 * Noise
	 */
	const noiseEffect = new NoiseEffect({
		blendFunction: BlendFunction.COLOR_DODGE
	})
	noiseEffect.blendMode.opacity.value = 0.025

	/**
	 * Anti-aliasing
	 */
	const fxaaEffect = new FXAAEffect()

	/**
	 * Brightness/Contrast
	 */
	const bcEffect = new BrightnessContrastEffect()
	bcEffect.contrast = 0.05
	bcEffect.brightness = 0.03

	/**
	 * Bloom
	 */
	const bloomEffect = new BloomEffect({
		luminanceThreshold: 0.7,
		radius: 0.6,
		mipmapBlur: true,
		intensity: 0.3
	})

	const { renderer, scene, camera, dpr } = useThrelte()

	const composer = new EffectComposer(renderer, {
		frameBufferType: HalfFloatType
	})

	const setup = () => {
		composer.removeAllPasses()
		composer.addPass(new RenderPass(scene, camera.current))
		composer.addPass(new EffectPass(camera.current, fxaaEffect))

		if ($postprocessing) {
			composer.addPass(
				new EffectPass(
					camera.current,
					chromaticAberrationEffect,
					bloomEffect,
					noiseEffect,
					toneMappingEffect,
					bcEffect
				)
			)
		} else {
			composer.addPass(new EffectPass(camera.current, toneMappingEffect))
		}
	}

	$: $postprocessing, $camera, setup()

	useRender(() => {
		composer.render()
	})

	onDestroy(() => {
		composer.dispose()
	})

	const { size } = useThrelte()
	$: composer.setSize($size.width, $size.height, false)
	$: $dpr, composer.setSize($size.width, $size.height, false)
</script>
