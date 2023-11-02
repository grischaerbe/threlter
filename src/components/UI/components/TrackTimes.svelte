<script lang="ts">
	import type { Track } from '$lib/Track/Track'
	import type { TrackRecord } from '$lib/TrackRecord/TrackRecord'
	import { c } from '$lib/utils/classes'
	import FormattedTime from './FormattedTime.svelte'

	export let track: Track
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
		? trackRecord.time.current < track.trackTimes.author
			? medals.author
			: trackRecord.time.current < track.trackTimes.gold
			? medals.gold
			: trackRecord.time.current < track.trackTimes.silver
			? medals.silver
			: trackRecord.time.current < track.trackTimes.bronze
			? medals.bronze
			: ''
		: ''

	const yourTimeMedal = time
		? time < track.trackTimes.author
			? medals.author
			: time < track.trackTimes.gold
			? medals.gold
			: time < track.trackTimes.silver
			? medals.silver
			: time < track.trackTimes.bronze
			? medals.bronze
			: ''
		: ''
</script>

<div class={c('grid grid-cols-[auto_auto] gap-x-[30px] gap-y-[15px]', _class)}>
	<div>🏅 Author</div>
	<div class="font-mono text-right">
		<FormattedTime time={track.trackTimes.author} />
	</div>

	{#if track.trackTimes.gold !== 0}
		<div>🥇 Gold</div>
		<div class="font-mono text-right">
			<FormattedTime time={track.trackTimes.gold} />
		</div>
	{/if}

	{#if track.trackTimes.silver !== 0}
		<div>🥈 Silver</div>
		<div class="font-mono text-right">
			<FormattedTime time={track.trackTimes.silver} />
		</div>
	{/if}

	{#if track.trackTimes.bronze !== 0}
		<div>🥉 Bronze</div>
		<div class="font-mono text-right">
			<FormattedTime time={track.trackTimes.bronze} />
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
