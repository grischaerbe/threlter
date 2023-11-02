<script lang="ts">
	import { goto } from '$app/navigation'
	import TrackSelection from '$components/UI/layouts/TrackSelection.svelte'

	export let data

	let trackSelected = false
</script>

<TrackSelection
	bind:trackSelected
	tracks={data.tracks}
	showAuthor
	on:playtrack={(e) => {
		goto(`/user/${e.detail.track.trackId}/time-attack`)
	}}
/>
