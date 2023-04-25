<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import EndlessRaceIntro from '$components/EndlessRaceIntro/EndlessRaceIntro.svelte'
	import { Suspense, onReveal } from '@threlte/extras'
	import UiWrapper from '../../../components/UI/UiWrapper.svelte'
	import { appState } from '../../../stores/app'
	import LoadingUi from '../../../components/UI/LoadingUi.svelte'

	const showIntro = $page.route.id === '/(env)/(endless-race)'

	const { music } = appState.options.audio

	const gradientBaseOpacity = 0.8
	let cameraFadeOpacity = 0

	let revealed = false
	onReveal(() => {
		revealed = true
	})
</script>

{#if $music && revealed}
	<audio autoplay src="/music/let-the-games-begin-21858.mp3" loop />
{/if}

<Suspense final>
	<LoadingUi slot="fallback" />

	<UiWrapper>
		<div
			class="absolute -z-10 h-[30vh] w-full top-0 left-0 bg-gradient-to-b from-blue-darkest to-transparent"
			style="opacity: {gradientBaseOpacity * (1 - cameraFadeOpacity)};"
		/>
	</UiWrapper>

	<EndlessRaceIntro
		{showIntro}
		bind:cameraFadeOpacity
		on:introcomplete={() => {
			goto('/menu/main')
		}}
	/>

	<slot />
</Suspense>
