<script lang="ts">
	import Button from '../../UI/components/Button.svelte'
	import Card from '../../UI/components/Card.svelte'
	import TopbarLayout from '../../UI/layouts/TopBarLayout.svelte'
	import { actions, gameState } from '$stores/app'
	import { getters } from '$stores/getters'
	import { formatTime } from '$lib/utils/formatters'
	import type { TrackRecord } from '../../../lib/TrackRecord/TrackRecord'
	import type { TrackData } from '../../../lib/TrackData/TrackData'

	export let time: number
	export let restart: () => void
	export let trackRecord: TrackRecord | undefined
	export let trackData: TrackData

	$: formattedRecordTime = trackRecord?.timeFormatted
</script>

<TopbarLayout>
	<Button slot="topbar-left" preventFocusOnFocusLost href="/menu/main">Menu</Button>
	<div slot="topbar-center">
		{trackData.trackName.current}
	</div>
	<Button slot="topbar-right" forceFocusOnMount on:click={restart}>Restart</Button>
	<div class="absolute top-0 left-0 w-full h-full">
		<Card class="inline-block">
			<div class="mb-[10px]">Time: {formatTime(time)}</div>
			{#if trackRecord}
				<div class="mb-[10px]">Current best: {$formattedRecordTime}</div>
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
