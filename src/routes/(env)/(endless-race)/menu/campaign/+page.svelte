<script lang="ts">
	import { goto } from '$app/navigation'
	import UiWrapper from '$components/UI/UiWrapper.svelte'
	import TopBarLayout from '$components/UI/layouts/TopBarLayout.svelte'
	import TrackSelection from '$components/UI/layouts/TrackSelection.svelte'
	import TopMenu from '../../../../../components/UI/layouts/TopMenu.svelte'

	export let data

	let trackSelected = false
</script>

<UiWrapper>
	<TopBarLayout>
		<TopMenu slot="topbar-center" />

		<TrackSelection
			bind:trackSelected
			trackDatas={data.campaign.tracks}
			on:playtrack={(e) => {
				goto(`/campaign/${e.detail.trackId}/time-attack`)
			}}
		/>
	</TopBarLayout>
</UiWrapper>
