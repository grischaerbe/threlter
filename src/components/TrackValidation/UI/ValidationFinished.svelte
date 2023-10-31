<script lang="ts">
	import Card from '$components/UI/components/Card.svelte'
	import TrackTimes from '$components/UI/components/TrackTimes.svelte'
	import TopbarLayout from '$components/UI/layouts/TopBarLayout.svelte'
	import type { Track } from '$lib/Track/Track'
	import { TrackManager } from '../../../lib/TrackManager/TrackManager'
	import { nakama } from '../../../lib/nakama'
	import BottomScreenTrackName from '../../UI/components/BottomScreenTrackName.svelte'
	import SpecialButton from '../../UI/components/SpecialButton.svelte'

	export let track: Track
	export let time: number

	const timeIsBetter =
		track.trackTimes.author.current === 0 || (track.trackTimes.author.current ?? Infinity) > time

	if (timeIsBetter) track.validate(time)

	export let restart: () => void

	const upload = async () => {
		if (!nakama.session.current) return
		TrackManager.saveUserTrack(track)
	}
</script>

<BottomScreenTrackName title={track.trackName.current} />

<TopbarLayout>
	<SpecialButton slot="topbar-left" preventFocusOnFocusLost href="/menu/main">Menu</SpecialButton>
	<slot slot="topbar-right">
		<SpecialButton forceFocusOnMount on:click={restart}>Restart</SpecialButton>
		<SpecialButton on:click={upload}>Upload</SpecialButton>
	</slot>
	<Card class="inline-block text-[0.9em]">
		<TrackTimes {track} />
	</Card>
</TopbarLayout>
