<script lang="ts">
	import Button from '$components/UI/components/Button.svelte'
	import type { TrackData } from '$lib/TrackData/TrackData'
	import { formatTime } from '$lib/utils/formatters'

	export let trackData: TrackData
	export let time: number

	const { trackTimes } = trackData

	const { author } = trackTimes

	$: currentAuthorTime = formatTime($author)

	trackData.validate(time)
</script>

<p>
	Current Author Time: {currentAuthorTime}
</p>

<Button
	on:click={() => {
		trackData.saveTrackToDisk()
	}}
>
	Save Track
</Button>

<Button href="/user/{trackData.trackId}/edit">Edit Track</Button>
