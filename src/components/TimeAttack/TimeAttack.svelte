<script lang="ts">
	import type { Track } from '$lib/Track/Track'
	import type { Leaderboard } from '../../lib/Leaderboard/Leaderboard'
	import type { TrackRecordsManager } from '../../lib/TrackRecord/TrackRecordsManager'
	import CommonGamePlay from '../CommonGamePlay/CommonGamePlay.svelte'
	import TimeAttackFinished from './UI/TimeAttackFinished.svelte'
	import TimeAttackIntro from './UI/TimeAttackIntro.svelte'
	import TimeAttackPaused from './UI/TimeAttackPaused.svelte'

	export let track: Track
	export let trackRecordsManager: TrackRecordsManager
	export let leaderboard: Leaderboard
</script>

<CommonGamePlay {track} {trackRecordsManager}>
	<TimeAttackPaused
		slot="ui-paused"
		let:time
		let:proceed
		let:restart
		{time}
		{track}
		{proceed}
		{restart}
	/>
	<TimeAttackIntro slot="ui-intro" let:proceed {proceed} {track} {leaderboard} />
	<TimeAttackFinished
		slot="ui-finished"
		let:time
		let:restart
		{time}
		{restart}
		{trackRecordsManager}
		{track}
	/>
</CommonGamePlay>
