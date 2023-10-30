<script lang="ts">
	import Card from '$components/UI/components/Card.svelte'
	import TrackTimes from '$components/UI/components/TrackTimes.svelte'
	import TopbarLayout from '$components/UI/layouts/TopBarLayout.svelte'
	import type { Track } from '$lib/TrackData/TrackData'
	import type { TrackRecord } from '$lib/TrackRecord/TrackRecord'
	import BottomScreenTrackName from '../../UI/components/BottomScreenTrackName.svelte'
	import SpecialButton from '../../UI/components/SpecialButton.svelte'

	export let restart: () => void
	export let time: number
	export let trackRecord: TrackRecord | undefined
	export let trackData: Track
</script>

<BottomScreenTrackName title={trackData.trackName.current} />

<TopbarLayout>
	<SpecialButton slot="topbar-left" preventFocusOnFocusLost href="/menu/main">Menu</SpecialButton>
	<SpecialButton slot="topbar-right" forceFocusOnMount on:click={restart}>Restart</SpecialButton>
	<Card class="inline-block text-[0.9em]">
		<TrackTimes {time} {trackData} {trackRecord} />
	</Card>
</TopbarLayout>
