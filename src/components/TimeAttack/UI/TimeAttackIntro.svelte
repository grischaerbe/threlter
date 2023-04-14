<script lang="ts">
	import Button from '$components/UI/components/Button.svelte'
	import Card from '$components/UI/components/Card.svelte'
	import TrackTimes from '$components/UI/components/TrackTimes.svelte'
	import TopbarLayout from '$components/UI/layouts/TopBarLayout.svelte'
	import type { TrackData } from '$lib/TrackData/TrackData'
	import type { TrackRecord } from '$lib/TrackRecord/TrackRecord'

	export let proceed: () => void
	export let trackRecord: TrackRecord | undefined
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
			<TrackTimes {trackData} {trackRecord} />
		</Card>
	</div>
</TopbarLayout>
