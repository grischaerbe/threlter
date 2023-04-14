<script lang="ts">
	import { goto } from '$app/navigation'
	import UiWrapper from '$components/UI/UiWrapper.svelte'
	import BackButton from '$components/UI/components/BackButton.svelte'
	import TopBar from '$components/UI/components/TopBar.svelte'
	import TrackSelection from '$components/UI/layouts/TrackSelection.svelte'
	import { useKeyDown } from '$hooks/useKeyDown'
	import { actions } from '$stores/app'

	import type { PageData } from './$types'

	export let data: PageData

	$: console.log(data)

	let trackSelected = false
	useKeyDown('Escape', () => {
		if (trackSelected) return
		actions.goToMainMenu()
	})
</script>

<UiWrapper>
	<TopBar>
		<BackButton slot="left" href="/menu/main">Back</BackButton>

		<p slot="center">CAMPAIGN</p>
	</TopBar>

	<TrackSelection
		bind:trackSelected
		trackDatas={data.campaign.tracks}
		on:ontrackplay={(e) => {
			goto(`/campaign/${e.detail.trackId}/time-attack`)
		}}
	/>
</UiWrapper>
