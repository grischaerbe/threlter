<script lang="ts">
	import { Canvas } from '@threlte/core'
	import '../app.postcss'
	import { Debug, World } from '@threlte/rapier'
	import Loader from '$components/Loader/Loader.svelte'
	import { appState } from '$stores/app'
	import { AudioListener } from '@threlte/extras'
	import AudioProvider from '$components/Utilities/AudioProvider.svelte'
	import KeyboardNavigation from '$components/UI/KeyboardNavigation.svelte'
	import StartPrompt from '../components/UI/StartPrompt.svelte'
	import { page } from '$app/stores'

	const { debug } = appState

	$: console.log($page.route.id)
</script>

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
	</Canvas>

	<div
		class="absolute top-0 left-0 w-full h-full z-10 text-[28px] [&_button]:pointer-events-auto [&_a]:pointer-events-auto p-[15px] pointer-events-none leading-none select-none"
		id="car-ui-portal-target"
	/>
</div>
