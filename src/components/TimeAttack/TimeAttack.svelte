<script lang="ts">
	import type { TrackData } from '$lib/TrackData/TrackData'
	import CommonGamePlay from '../CommonGamePlay/CommonGamePlay.svelte'
	import TimeAttackFinished from './UI/TimeAttackFinished.svelte'
	import TimeAttackIntro from './UI/TimeAttackIntro.svelte'
	import TimeAttackPaused from './UI/TimeAttackPaused.svelte'

	export let trackData: TrackData
</script>

<CommonGamePlay {trackData}>
	<TimeAttackPaused
		slot="ui-paused"
		let:time
		let:proceed
		let:restart
		{time}
		{trackData}
		{proceed}
		{restart}
	/>
	<TimeAttackIntro
		slot="ui-intro"
		let:proceed
		let:trackRecord
		{proceed}
		{trackData}
		{trackRecord}
	/>
	<TimeAttackFinished
		slot="ui-finished"
		let:time
		let:trackRecord
		let:restart
		{time}
		{restart}
		{trackRecord}
		{trackData}
	/>
</CommonGamePlay>
