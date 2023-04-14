<script lang="ts">
	import CommonGamePlay from '$components/CommonGamePlay/CommonGamePlay.svelte'
	import type { TrackData } from '$lib/TrackData/TrackData'
	import ValidationFinished from './UI/ValidationFinished.svelte'
	import ValidationInProgress from './UI/ValidationInProgress.svelte'
	import ValidationIntro from './UI/ValidationIntro.svelte'
	import ValidationPaused from './UI/ValidationPaused.svelte'

	export let trackData: TrackData
</script>

<CommonGamePlay {trackData} let:proceed let:time>
	<ValidationPaused slot="ui-paused" {trackData} />

	<ValidationIntro slot="ui-intro" {proceed} {trackData} />

	<ValidationInProgress slot="ui-playing" {time} />

	<ValidationFinished {trackData} slot="ui-finished" {time} />
</CommonGamePlay>
