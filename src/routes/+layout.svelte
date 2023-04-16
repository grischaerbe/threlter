<script lang="ts">
	import Loader from '$components/Loader/Loader.svelte'
	import KeyboardNavigation from '$components/UI/KeyboardNavigation.svelte'
	import AudioProvider from '$components/Utilities/AudioProvider.svelte'
	import { appState } from '$stores/app'
	import { Canvas } from '@threlte/core'
	import { AudioListener } from '@threlte/extras'
	import { Debug, World } from '@threlte/rapier'
	import '../app.postcss'
	import StartPrompt from '../components/UI/StartPrompt.svelte'
	import Renderer from '../components/Renderer.svelte'

	const { visibility, options } = appState
	const { debug } = options

	const onVisibilityChange = () => {
		if (document.hidden || document.visibilityState === 'hidden') {
			visibility.set('hidden')
		} else {
			visibility.set('visible')
		}
	}
</script>

<svelte:window on:visibilitychange={onVisibilityChange} />

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

			<Loader>
				<AudioListener />
				<AudioProvider>
					<KeyboardNavigation>
						<StartPrompt>
							<slot />
						</StartPrompt>
					</KeyboardNavigation>
				</AudioProvider>
			</Loader>
		</World>

		<Renderer />
	</Canvas>

	<div
		class="leading-tight absolute top-0 left-0 w-full h-full z-10 text-[30px] [&_button]:pointer-events-auto [&_a]:pointer-events-auto p-[15px] pointer-events-none select-none"
		id="car-ui-portal-target"
	/>
</div>
