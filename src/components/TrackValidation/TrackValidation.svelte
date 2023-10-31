<script lang="ts">
	import CommonGamePlay from '$components/CommonGamePlay/CommonGamePlay.svelte'
	import type { UserTrack } from '../../lib/Track/UserTrack'
	import ValidationFinished from './UI/ValidationFinished.svelte'
	import ValidationIntro from './UI/ValidationIntro.svelte'
	import ValidationPaused from './UI/ValidationPaused.svelte'

	export let track: UserTrack
</script>

<CommonGamePlay {track}>
	<ValidationPaused
		let:proceed
		let:time
		let:restart
		{proceed}
		{restart}
		slot="ui-paused"
		{track}
		{time}
	/>
	<ValidationIntro let:proceed slot="ui-intro" {proceed} {track} />
	<ValidationFinished let:time let:restart {restart} {track} slot="ui-finished" {time} />
</CommonGamePlay>
