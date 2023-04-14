<script lang="ts">
	import Button from '$components/UI/components/Button.svelte'
	import TopbarLayout from '$components/UI/layouts/TopBarLayout.svelte'
	import type { TrackRecord } from '$lib/TrackRecord/TrackRecord'
	import type { TrackData } from '$lib/TrackData/TrackData'
	import Card from '$components/UI/components/Card.svelte'
	import { formatTime } from '$lib/utils/formatters'

	export let proceed: () => void
	export let trackRecord: TrackRecord | undefined
	export let trackData: TrackData

	$: formattedTime = trackRecord?.timeFormatted
</script>

<TopbarLayout>
	<Button slot="topbar-left" preventFocusOnFocusLost href="/menu/main">Menu</Button>
	<div slot="topbar-center">
		{trackData.trackName.current}
	</div>
	<Button slot="topbar-right" forceFocusOnMount on:click={proceed}>Start</Button>
	<div class="absolute top-0 left-0 w-full h-full">
		<Card class="inline-block">
			{#if trackRecord}
				<div class="mb-[10px]">Current best: {$formattedTime}</div>
			{/if}
			<div>
				AUTHOR: {formatTime(trackData.trackTimes.author.current ?? 0)}<br />
				GOLD: {formatTime(trackData.trackTimes.gold.current ?? 0)}<br />
				SILVER: {formatTime(trackData.trackTimes.silver.current ?? 0)}<br />
				BRONZE: {formatTime(trackData.trackTimes.bronze.current ?? 0)}
			</div>
		</Card>
	</div>
</TopbarLayout>
