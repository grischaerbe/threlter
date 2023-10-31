<script lang="ts">
	import type { Track } from '$lib/Track/Track'
	import CommonGamePlay from '../CommonGamePlay/CommonGamePlay.svelte'
	import TimeAttackFinished from './UI/TimeAttackFinished.svelte'
	import TimeAttackIntro from './UI/TimeAttackIntro.svelte'
	import TimeAttackPaused from './UI/TimeAttackPaused.svelte'

	export let track: Track
</script>

<CommonGamePlay {track}>
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
	<TimeAttackIntro slot="ui-intro" let:proceed let:trackRecord {proceed} {track} {trackRecord} />
	<TimeAttackFinished
		slot="ui-finished"
		let:time
		let:trackRecord
		let:restart
		{time}
		{restart}
		{trackRecord}
		{track}
	/>
</CommonGamePlay>
