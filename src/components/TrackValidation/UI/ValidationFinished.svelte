<script lang="ts">
	import Card from '$components/UI/components/Card.svelte'
	import TrackTimes from '$components/UI/components/TrackTimes.svelte'
	import TopbarLayout from '$components/UI/layouts/TopBarLayout.svelte'
	import type { UserTrack } from '../../../lib/Track/UserTrack'
	import { TrackManager } from '../../../lib/TrackManager/TrackManager'
	import { nakama } from '../../../lib/nakama'
	import BottomScreenTrackName from '../../UI/components/BottomScreenTrackName.svelte'
	import SpecialButton from '../../UI/components/SpecialButton.svelte'

	export let track: UserTrack
	export let time: number

	const timeIsBetter = track.trackTimes.author === 0 || (track.trackTimes.author ?? Infinity) > time

	if (timeIsBetter) track.validate(time)

	export let restart: () => void

	const publish = async () => {
		if (!nakama.session.current) return
		TrackManager.publishUserTrack(track)
	}
</script>

<BottomScreenTrackName title={track.trackName} />

<TopbarLayout>
	<SpecialButton slot="topbar-left" preventFocusOnFocusLost href="/menu/main">Menu</SpecialButton>
	<slot slot="topbar-right">
		<div class="flex gap-[5px]">
			<SpecialButton forceFocusOnMount on:click={restart}>Restart</SpecialButton>
			<SpecialButton on:click={publish}>Publish</SpecialButton>
		</div>
	</slot>
	<Card class="inline-block text-[0.9em]">
		<TrackTimes {track} />
	</Card>
</TopbarLayout>
