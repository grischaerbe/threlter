<script lang="ts">
	import type { TrackData } from '$lib/TrackData/TrackData'
	import type { TrackRecord } from '$lib/TrackRecord/TrackRecord'
	import { c } from '$lib/utils/classes'
	import { formatTime } from '$lib/utils/formatters'
	import FormattedTime from './FormattedTime.svelte'

	export let trackData: TrackData
	export let trackRecord: TrackRecord | undefined = undefined
	export let time: number | undefined = undefined

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

	const yourTimeMedal = time
		? time < trackData.trackTimes.author.current
			? medals.author
			: time < trackData.trackTimes.gold.current
			? medals.gold
			: time < trackData.trackTimes.silver.current
			? medals.silver
			: time < trackData.trackTimes.bronze.current
			? medals.bronze
			: ''
		: ''
</script>

<div class={c('grid grid-cols-[auto_auto] gap-x-[30px] gap-y-[15px]', _class)}>
	<div>🏅 Author</div>
	<div class="font-mono text-right">
		<FormattedTime time={trackData.trackTimes.author.current} />
	</div>

	{#if trackData.trackTimes.gold.current !== 0}
		<div>🥇 Gold</div>
		<div class="font-mono text-right">
			<FormattedTime time={trackData.trackTimes.gold.current} />
		</div>
	{/if}

	{#if trackData.trackTimes.silver.current !== 0}
		<div>🥈 Silver</div>
		<div class="font-mono text-right">
			<FormattedTime time={trackData.trackTimes.silver.current} />
		</div>
	{/if}

	{#if trackData.trackTimes.bronze.current !== 0}
		<div>🥉 Bronze</div>
		<div class="font-mono text-right">
			<FormattedTime time={trackData.trackTimes.bronze.current} />
		</div>
	{/if}

	{#if trackRecord || time !== undefined}
		<div class="col-span-2 h-[2px] w-full bg-orange" />
	{/if}

	{#if trackRecord}
		<div>{personalBestMedal} Personal Best</div>
		<div class="font-mono text-right">
			<FormattedTime time={trackRecord.time.current} />
		</div>
	{/if}

	{#if time !== undefined}
		<div>{yourTimeMedal} Your Time</div>
		<div class="font-mono text-right">
			<FormattedTime {time} />
		</div>
	{/if}
</div>
