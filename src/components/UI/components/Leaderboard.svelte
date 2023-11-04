<script lang="ts">
	import { onMount } from 'svelte'
	import type { Track } from '../../../lib/Track/Track'
	import { TrackManager } from '../../../lib/TrackManager/TrackManager'
	import { SessionManager } from '../../../lib/nakama/SessionManager'
	import { toReadable } from '../../../lib/utils/toStore'
	import FormattedTime from './FormattedTime.svelte'
	import SpecialButton from './SpecialButton.svelte'

	export let track: Track
	export let itemsPerPage = 10

	const userId = toReadable(SessionManager, 'userId')

	let leaderboard: Awaited<ReturnType<typeof TrackManager.getLeaderboard>> | undefined = undefined

	onMount(async () => {
		leaderboard = await TrackManager.getLeaderboard(track.trackId, itemsPerPage)
	})
</script>

<h2 class="mb-[15px]">Weekly Leaderboard</h2>

<div class="flex flex-col gap-[5px] text-[0.8em]">
	{#if leaderboard}
		{#each leaderboard.records as record, i}
			{@const ownRecord = record.user.id === $userId}
			<div class="flex gap-[5px]">
				<span class="font-mono mr-2">{record.record.rank}.</span>
				<FormattedTime time={record.record.trackRecord.time} />
				<span class="ml-auto">
					{record.user.username}
					{#if ownRecord}
						<span class="opacity-60">(you)</span>
					{/if}
				</span>
			</div>
		{/each}
	{/if}

	{#if leaderboard?.hasPrevious || leaderboard?.hasNext}
		<div class="flex gap-[15px] mt-[20px]">
			<SpecialButton
				class="pointer-events-auto"
				on:click={async () => {
					if (!leaderboard || !leaderboard.hasPrevious) return
					leaderboard = await leaderboard.previous()
				}}
			>
				Previous
			</SpecialButton>

			<SpecialButton
				class="pointer-events-auto"
				on:click={async () => {
					if (!leaderboard || !leaderboard.hasNext) return
					leaderboard = await leaderboard.next()
				}}
			>
				Next
			</SpecialButton>
		</div>
	{/if}
</div>
