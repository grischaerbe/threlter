<script lang="ts">
	import Button from '$components/UI/components/Button.svelte'
	import Card from '$components/UI/components/Card.svelte'
	import TopbarLayout from '$components/UI/layouts/TopBarLayout.svelte'
	import type { TrackData } from '$lib/TrackData/TrackData'
	import type { TrackRecord } from '$lib/TrackRecord/TrackRecord'

	export let proceed: () => void
	export let trackData: TrackData
</script>

<TopbarLayout>
	<Button slot="topbar-left" preventFocusOnFocusLost href="/menu/main">Menu</Button>

	<div slot="topbar-center">
		{trackData.trackName.current}
	</div>

	<Button slot="topbar-right" forceFocusOnMount on:click={proceed}>Start</Button>

	<div class="absolute top-0 left-0 w-full h-full">
		<Card class="inline-block">
			<div>Track validation</div>

			<div class="text-[0.65em]">
				To publish a track, you need to validate it. This will check that the track is valid and
				that it can be played. You will also set the author time for the track. Press enter to
				continue.
			</div>
		</Card>
	</div>
</TopbarLayout>
