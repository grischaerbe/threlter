<script lang="ts">
	import { goto } from '$app/navigation'
	import UiWrapper from '$components/UI/UiWrapper.svelte'
	import BackButton from '$components/UI/components/BackButton.svelte'
	import TopBar from '$components/UI/components/TopBar.svelte'
	import TrackSelection from '$components/UI/layouts/TrackSelection.svelte'
	import TopBarLayout from '$components/UI/layouts/TopBarLayout.svelte'

	export let data

	let trackSelected = false
</script>

<UiWrapper>
	<TopBarLayout>
		<BackButton slot="topbar-left" href="/menu/main">Back</BackButton>

		<p slot="topbar-center">CAMPAIGN</p>

		<TrackSelection
			bind:trackSelected
			trackDatas={data.campaign.tracks}
			on:playtrack={(e) => {
				goto(`/campaign/${e.detail.trackId}/time-attack`)
			}}
		/>
	</TopBarLayout>
</UiWrapper>
