<script lang="ts">
	import { goto } from '$app/navigation'
	import TrackSelection from '$components/UI/layouts/UserTrackSelection.svelte'

	export let data

	let trackSelected = false
</script>

<TrackSelection
	bind:trackSelected
	tracks={data.tracks}
	on:playtrack={(e) => {
		goto(`/campaign/${e.detail.track.trackId}/time-attack`)
	}}
/>
