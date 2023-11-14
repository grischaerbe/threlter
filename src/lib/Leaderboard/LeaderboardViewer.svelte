<script lang="ts">
	import FormattedTime from '../../components/UI/components/FormattedTime.svelte'
	import SpecialButton from '../../components/UI/components/SpecialButton.svelte'
	import { UserManager } from '../nakama/UserManager'
	import { toReadable } from '../utils/toStore'
	import type { Leaderboard } from './Leaderboard'

	export let title: string
	export let leaderboard: Leaderboard

	const entries = toReadable(leaderboard, 'leaderboardEntries')
</script>

<h2 class="mb-[15px]">{title}</h2>

<div class="flex flex-col gap-[5px] text-[0.8em]">
	{#if $entries.length}
		{#each $entries as entry, i}
			<div class="flex gap-[5px]">
				<span class="font-mono mr-2">{entry.rank}.</span>
				<FormattedTime time={entry.time} />
				<span class="ml-auto">
					{UserManager.formatUserName(entry.userId, entry.username)}
				</span>
			</div>
		{/each}
	{:else}
		<div class="text-[0.8em]">No entries yet.</div>
	{/if}

	{#if leaderboard.hasPreviousPage || leaderboard.hasNextPage}
		<div class="flex gap-[15px] mt-[20px]">
			<SpecialButton
				class="pointer-events-auto"
				on:click={async () => {
					if (!leaderboard.hasPreviousPage) return
					await leaderboard.previousPage()
				}}
			>
				Previous
			</SpecialButton>

			<SpecialButton
				class="pointer-events-auto"
				on:click={async () => {
					if (!leaderboard.hasNextPage) return
					await leaderboard.nextPage()
				}}
			>
				Next
			</SpecialButton>
		</div>
	{/if}
</div>
