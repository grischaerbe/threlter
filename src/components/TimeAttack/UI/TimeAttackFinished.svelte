<script lang="ts">
	import Card from '$components/UI/components/Card.svelte'
	import TrackTimes from '$components/UI/components/TrackTimes.svelte'
	import TopbarLayout from '$components/UI/layouts/TopBarLayout.svelte'
	import type { Track } from '$lib/Track/Track'
	import type { TrackRecordsManager } from '../../../lib/TrackRecord/TrackRecordsManager'
	import BottomScreenTrackName from '../../UI/components/BottomScreenTrackName.svelte'
	import SpecialButton from '../../UI/components/SpecialButton.svelte'

	export let restart: () => void
	export let time: number
	export let trackRecordsManager: TrackRecordsManager
	export let track: Track

	trackRecordsManager.publish()
</script>

<BottomScreenTrackName title={track.trackName} />

<TopbarLayout>
	<SpecialButton slot="topbar-left" preventFocusOnFocusLost href="/menu/main">Menu</SpecialButton>
	<SpecialButton slot="topbar-right" forceFocusOnMount on:click={restart}>Restart</SpecialButton>
	<Card class="inline-block text-[0.9em]">
		<TrackTimes {time} {track} />
	</Card>
</TopbarLayout>
