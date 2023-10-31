<script lang="ts">
	import { goto } from '$app/navigation'
	import TrackSelection from '$components/UI/layouts/TrackSelection.svelte'

	export let data

	let trackSelected = false
</script>

<TrackSelection
	bind:trackSelected
	tracks={data.campaign.tracks}
	on:playtrack={(e) => {
		goto(`/campaign/${e.detail.trackId}/time-attack`)
	}}
/>
