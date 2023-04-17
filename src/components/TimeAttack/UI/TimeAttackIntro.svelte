<script lang="ts">
	import Card from '$components/UI/components/Card.svelte'
	import TrackTimes from '$components/UI/components/TrackTimes.svelte'
	import TopbarLayout from '$components/UI/layouts/TopBarLayout.svelte'
	import type { TrackData } from '$lib/TrackData/TrackData'
	import type { TrackRecord } from '$lib/TrackRecord/TrackRecord'
	import BottomScreenTrackName from '../../UI/components/BottomScreenTrackName.svelte'
	import SpecialButton from '../../UI/components/SpecialButton.svelte'

	export let proceed: () => void
	export let trackRecord: TrackRecord | undefined
	export let trackData: TrackData
</script>

<BottomScreenTrackName title={trackData.trackName.current} />

<TopbarLayout>
	<SpecialButton slot="topbar-left" preventFocusOnFocusLost href="/menu/main">Menu</SpecialButton>
	<SpecialButton slot="topbar-right" forceFocusOnMount on:click={proceed}>Start</SpecialButton>
	<Card class="inline-block text-[0.9em]">
		<TrackTimes {trackData} {trackRecord} />
	</Card>
</TopbarLayout>
