<script lang="ts">
	import KeyboardNavigation from '$components/UI/KeyboardNavigation.svelte'
	import AudioProvider from '$components/Utilities/AudioProvider.svelte'
	import { appState } from '$stores/app'
	import { Canvas } from '@threlte/core'
	import { AudioListener, Suspense } from '@threlte/extras'
	import { Debug, World } from '@threlte/rapier'
	import '../app.postcss'
	import StartPrompt from '../components/UI/StartPrompt.svelte'
	import Renderer from '../components/Renderer.svelte'
	import LoadingUi from '../components/UI/LoadingUi.svelte'
	import { page } from '$app/stores'
	import { dev } from '$app/environment'

	const { visibility, options } = appState
	const { debug } = options

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
		rendererParameters={{
			powerPreference: 'high-performance',
			alpha: true,
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
							<slot />
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
