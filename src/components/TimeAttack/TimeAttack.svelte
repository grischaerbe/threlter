<script lang="ts">
	// UI
	import CommonGamePlay from '../CommonGamePlay/CommonGamePlay.svelte'
	import TimeAttackFinished from './UI/TimeAttackFinished.svelte'
	import TimeAttackPaused from './UI/TimeAttackPaused.svelte'
	import TimeAttackUi from './UI/TimeAttackUi.svelte'
	import TimeAttackIntro from './UI/TimeAttackIntro.svelte'
	import type { TrackData } from '$lib/TrackData/TrackData'

	export let trackData: TrackData
</script>

<CommonGamePlay {trackData}>
	<TimeAttackPaused slot="ui-paused" />

	<TimeAttackIntro slot="ui-intro" />

	<TimeAttackUi slot="ui-playing" />

	<TimeAttackFinished slot="ui-finished" />
</CommonGamePlay>
