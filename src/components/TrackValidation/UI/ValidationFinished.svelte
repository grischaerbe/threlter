<script lang="ts">
	import Card from '$components/UI/components/Card.svelte'
	import TrackTimes from '$components/UI/components/TrackTimes.svelte'
	import TopbarLayout from '$components/UI/layouts/TopBarLayout.svelte'
	import type { Track } from '$lib/TrackData/Track'
	import { TrackManager } from '../../../lib/TrackData/TrackDataManager'
	import { nakama } from '../../../lib/nakama'
	import BottomScreenTrackName from '../../UI/components/BottomScreenTrackName.svelte'
	import SpecialButton from '../../UI/components/SpecialButton.svelte'

	export let trackData: Track
	export let time: number

	const timeIsBetter =
		trackData.trackTimes.author.current === 0 ||
		(trackData.trackTimes.author.current ?? Infinity) > time

	if (timeIsBetter) trackData.validate(time)

	export let restart: () => void

	const upload = async () => {
		if (!nakama.session.current) return
		TrackManager.saveUserTrackData(trackData)
	}
</script>

<BottomScreenTrackName title={trackData.trackName.current} />

<TopbarLayout>
	<SpecialButton slot="topbar-left" preventFocusOnFocusLost href="/menu/main">Menu</SpecialButton>
	<slot slot="topbar-right">
		<SpecialButton forceFocusOnMount on:click={restart}>Restart</SpecialButton>
		<SpecialButton on:click={upload}>Upload</SpecialButton>
	</slot>
	<Card class="inline-block text-[0.9em]">
		<TrackTimes {trackData} />
	</Card>
</TopbarLayout>
