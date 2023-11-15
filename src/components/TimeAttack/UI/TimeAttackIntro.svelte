<script lang="ts">
	import Card from '$components/UI/components/Card.svelte'
	import TopbarLayout from '$components/UI/layouts/TopBarLayout.svelte'
	import type { Track } from '$lib/Track/Track'
	import type { Leaderboard } from '../../../lib/Leaderboard/Leaderboard'
	import LeaderboardViewer from '../../../lib/Leaderboard/LeaderboardViewer.svelte'
	import BottomScreenTrackName from '../../UI/components/BottomScreenTrackName.svelte'
	import Key from '../../UI/components/Key.svelte'
	import SpecialButton from '../../UI/components/SpecialButton.svelte'
	import Controls from '../../UI/Controls.svelte'

	export let proceed: () => void
	export let track: Track
	export let leaderboard: Leaderboard
</script>

<BottomScreenTrackName title={track.trackName} />
<TopbarLayout>
	<SpecialButton slot="topbar-left" preventFocusOnFocusLost href="/menu/main">Menu</SpecialButton>

	<SpecialButton slot="topbar-right" forceFocusOnMount on:click={proceed}>Start</SpecialButton>

	<div class="flex flex-col gap-[15px] items-start">
		<Card class="inline-block text-[0.9em] w-[18em]">
			<LeaderboardViewer {leaderboard} title="Weekly Leaderboard" />
		</Card>
		<Card class="flex flex-col gap-[10px] w-max">
			<Controls />
		</Card>
	</div>
</TopbarLayout>
