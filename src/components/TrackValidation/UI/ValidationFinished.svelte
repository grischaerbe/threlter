<script lang="ts">
	import Card from '$components/UI/components/Card.svelte'
	import TrackTimes from '$components/UI/components/TrackTimes.svelte'
	import TopbarLayout from '$components/UI/layouts/TopBarLayout.svelte'
	import type { TrackData } from '$lib/TrackData/TrackData'
	import BottomScreenTrackName from '../../UI/components/BottomScreenTrackName.svelte'
	import SpecialButton from '../../UI/components/SpecialButton.svelte'

	export let trackData: TrackData
	export let time: number

	const timeIsBetter = (trackData.trackTimes.author.current ?? Infinity) > time

	if (timeIsBetter) trackData.validate(time)

	export let restart: () => void
</script>

<BottomScreenTrackName title={trackData.trackName.current} />

<TopbarLayout>
	<SpecialButton slot="topbar-left" preventFocusOnFocusLost href="/menu/main">Menu</SpecialButton>
	<SpecialButton slot="topbar-right" forceFocusOnMount on:click={restart}>Restart</SpecialButton>
	<Card class="inline-block text-[0.9em]">
		<TrackTimes {trackData} />
	</Card>
</TopbarLayout>
