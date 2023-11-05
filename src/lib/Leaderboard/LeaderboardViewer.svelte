<script lang="ts">
	import FormattedTime from '../../components/UI/components/FormattedTime.svelte'
	import SpecialButton from '../../components/UI/components/SpecialButton.svelte'
	import { UserManager } from '../nakama/UserManager'
	import type { Leaderboard } from './Leaderboard'

	export let leaderboard: Leaderboard
</script>

<h2 class="mb-[15px]">Weekly Leaderboard</h2>

<div class="flex flex-col gap-[5px] text-[0.8em]">
	{#if leaderboard}
		{#each leaderboard.leaderboardEntries as entry, i}
			<div class="flex gap-[5px]">
				<span class="font-mono mr-2">{entry.rank}.</span>
				<FormattedTime time={entry.time} />
				<span class="ml-auto">
					{UserManager.formatUserName(entry.userId, entry.username)}
				</span>
			</div>
		{/each}
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
