<script lang="ts">
	import type { TrackData } from '../../../lib/TrackData/TrackData'
	import Button from '../../UI/components/Button.svelte'
	import TopBarLayout from '../../UI/layouts/TopBarLayout.svelte'

	export let proceed: () => void
	export let restart: () => void
	export let trackData: TrackData
</script>

<TopBarLayout>
	<Button slot="topbar-left" href="/menu/main">Menu</Button>
	<div slot="topbar-center">
		{trackData.trackName.current}
	</div>
	<div class="flex flex-col gap-[2px]" slot="topbar-right">
		<Button on:click={restart}>Restart</Button>
		<Button forceFocusOnMount on:click={proceed}>Resume</Button>
	</div>
</TopBarLayout>
