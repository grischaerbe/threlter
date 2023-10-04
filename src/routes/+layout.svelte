<script lang="ts">
	import { page } from '$app/stores'
	import KeyboardNavigation from '$components/UI/KeyboardNavigation.svelte'
	import AudioProvider from '$components/Utilities/AudioProvider.svelte'
	import { appState } from '$stores/app'
	import { Canvas, T } from '@threlte/core'
	import { AudioListener, Suspense } from '@threlte/extras'
	import { Debug, World } from '@threlte/rapier'
	import { NoToneMapping } from 'three'
	import '../app.postcss'
	import Csm from '../components/CSM/CSM.svelte'
	import Renderer from '../components/Renderer.svelte'
	import LoadingUi from '../components/UI/LoadingUi.svelte'
	import StartPrompt from '../components/UI/StartPrompt.svelte'
	import { sunPos } from '../config'
	import { Vector3 } from 'three'

	const {
		visibility,
		options: {
			debug,
			video: { shadows }
		}
	} = appState

	const onVisibilityChange = () => {
		if (document.hidden || document.visibilityState === 'hidden') {
			visibility.set('hidden')
		} else {
			visibility.set('visible')
		}
	}

	$: isRenderRoute = $page.route.id === '/track-elements/render'
</script>

<svelte:window on:visibilitychange={onVisibilityChange} />

{#if !isRenderRoute}
	<div
		class="absolute top-0 left-0 w-full h-full bg-black md:hidden z-50 text-orange font-headline flex justify-center items-center text-center px-[15px]"
	>
		Play on a desktop device
		<br />
		for the best experience
	</div>
{/if}

<div class="w-full h-full absolute bg-black">
	<Canvas
		toneMapping={NoToneMapping}
		rendererParameters={{
			powerPreference: 'high-performance',
			antialias: false,
			stencil: false,
			depth: false,
			preserveDrawingBuffer: true
		}}
	>
		<World order={-999}>
			{#if $debug}
				<Debug depthTest={false} depthWrite={false} />
			{/if}

			<Suspense final>
				<LoadingUi slot="fallback" />

				<AudioListener />
				<AudioProvider>
					<KeyboardNavigation>
						<StartPrompt>
							<Csm
								enabled={$shadows}
								params={{
									maxFar: 100,
									lightDirection: new Vector3(...sunPos).multiplyScalar(-1),
									lightIntensity: 1.2,
									cascades: 3
								}}
							>
								<slot />

								<svelte:fragment slot="disabled">
									<T.DirectionalLight position={sunPos} intensity={1.2} />
								</svelte:fragment>
							</Csm>
						</StartPrompt>
					</KeyboardNavigation>
				</AudioProvider>
			</Suspense>
		</World>

		<Renderer />
	</Canvas>

	<div
		class="leading-tight absolute top-0 left-0 w-full h-full z-10 text-[22px] lg:text-[26px] xl:text-[28px] 2xl:text-[30px] [&_button]:pointer-events-auto [&_a]:pointer-events-auto p-[15px] pointer-events-none select-none"
		id="car-ui-portal-target"
	/>
</div>
