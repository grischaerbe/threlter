<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import EndlessRaceIntro from '$components/EndlessRaceIntro/EndlessRaceIntro.svelte'
	import UiWrapper from '../../../components/UI/UiWrapper.svelte'

	const showIntro = $page.route.id === '/(env)/(endless-race)'
</script>

<UiWrapper>
	<div
		class="absolute -z-10 h-[40vh] w-full top-0 left-0 bg-gradient-to-b from-blue-darkest to-transparent"
	/>
</UiWrapper>

<EndlessRaceIntro
	{showIntro}
	on:introcomplete={() => {
		goto('/menu/main')
	}}
/>

<slot />
