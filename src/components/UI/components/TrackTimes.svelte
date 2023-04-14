<script lang="ts">
	import type { TrackData } from '$lib/TrackData/TrackData'
	import type { TrackRecord } from '$lib/TrackRecord/TrackRecord'
	import { c } from '$lib/utils/classes'
	import { formatTime } from '$lib/utils/formatters'

	export let trackData: TrackData
	export let trackRecord: TrackRecord | undefined

	let _class = ''
	export { _class as class }

	const medals = {
		author: '🏅',
		gold: '🥇',
		silver: '🥈',
		bronze: '🥉'
	}

	const personalBestMedal = trackRecord
		? trackRecord.time.current < trackData.trackTimes.author.current
			? medals.author
			: trackRecord.time.current < trackData.trackTimes.gold.current
			? medals.gold
			: trackRecord.time.current < trackData.trackTimes.silver.current
			? medals.silver
			: trackRecord.time.current < trackData.trackTimes.bronze.current
			? medals.bronze
			: ''
		: ''
</script>

<div class={c('grid grid-cols-[auto_auto] gap-x-[30px]', _class)}>
	{#if trackRecord}
		<div class="mb-[10px]">{personalBestMedal} PERSONAL BEST</div>
		<div class="font-mono text-right mb-[10px]">
			{formatTime(trackRecord.time.current)}
		</div>
	{/if}
	<div>🏅 AUTHOR</div>
	<div class="font-mono text-right">
		{formatTime(trackData.trackTimes.author.current)}
	</div>
	<div>🥇 GOLD</div>
	<div class="font-mono text-right">
		{formatTime(trackData.trackTimes.gold.current)}
	</div>
	<div>🥈 SILVER</div>
	<div class="font-mono text-right">
		{formatTime(trackData.trackTimes.silver.current)}
	</div>
	<div>🥉 BRONZE</div>
	<div class="font-mono text-right">
		{formatTime(trackData.trackTimes.bronze.current)}
	</div>
</div>
