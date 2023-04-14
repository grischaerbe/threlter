<script lang="ts">
	import Button from '$components/UI/components/Button.svelte'
	import type { TrackData } from '$lib/TrackData/TrackData'

	export let trackData: TrackData
</script>

<Button href="/user/{trackData.trackId}/edit">Edit Track</Button>
