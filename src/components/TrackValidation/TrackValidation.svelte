<script lang="ts">
	import CommonGamePlay from '$components/CommonGamePlay/CommonGamePlay.svelte'
	import type { TrackData } from '$lib/TrackData/TrackData'
	import ValidationFinished from './UI/ValidationFinished.svelte'
	import ValidationIntro from './UI/ValidationIntro.svelte'
	import ValidationPaused from './UI/ValidationPaused.svelte'

	export let trackData: TrackData
</script>

<CommonGamePlay {trackData} let:proceed let:time let:restart>
	<ValidationPaused {proceed} {restart} slot="ui-paused" {trackData} {time} />
	<ValidationIntro slot="ui-intro" {proceed} {trackData} />
	<ValidationFinished {restart} {trackData} slot="ui-finished" {time} />
</CommonGamePlay>
