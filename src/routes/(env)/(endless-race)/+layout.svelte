<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import EndlessRaceIntro from '$components/EndlessRaceIntro/EndlessRaceIntro.svelte'

	const showIntro = $page.route.id === '/(env)/(endless-race)'
</script>

<EndlessRaceIntro
	{showIntro}
	on:introcomplete={() => {
		goto('/menu/main')
	}}
/>

<slot />
