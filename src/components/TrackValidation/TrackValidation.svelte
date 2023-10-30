<script lang="ts">
	import CommonGamePlay from '$components/CommonGamePlay/CommonGamePlay.svelte'
	import type { Track } from '$lib/Track/Track'
	import ValidationFinished from './UI/ValidationFinished.svelte'
	import ValidationIntro from './UI/ValidationIntro.svelte'
	import ValidationPaused from './UI/ValidationPaused.svelte'

	export let trackData: Track
</script>

<CommonGamePlay {trackData}>
	<ValidationPaused
		let:proceed
		let:time
		let:restart
		{proceed}
		{restart}
		slot="ui-paused"
		{trackData}
		{time}
	/>
	<ValidationIntro let:proceed slot="ui-intro" {proceed} {trackData} />
	<ValidationFinished let:time let:restart {restart} {trackData} slot="ui-finished" {time} />
</CommonGamePlay>
