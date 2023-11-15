<script lang="ts">
	import Card from '../../../../components/UI/components/Card.svelte'
	import FormattedTime from '../../../../components/UI/components/FormattedTime.svelte'
	import type { MatchResults } from '../../../../lib/MatchResults/MatchResults'

	export let matchResults: MatchResults
	const { results } = matchResults
	const { players } = matchResults.matchManager
</script>

<Card>
	<h2 class="mb-[5px] font-headline">Live Ranking</h2>

	<h3 class="text-[0.7em] mb-[30px]">{$players.length} Player{$players.length > 1 ? 's' : ''}</h3>

	<div>
		{#each $results as result}
			<div
				class="grid grid-cols-2 gap-[40px] text-[0.8em] border-b border-orange py-[5px] first:border-t"
			>
				<div class="">
					<h3 class="whitespace-nowrap">
						{#if result.record?.rank !== undefined}
							<span class="w-[2ch] inline-block">
								{result.record?.rank}.
							</span>
						{/if}
						<span class="whitespace-nowrap">
							{result.player.presence.username}
						</span>
					</h3>
				</div>

				<div class="text-right">
					<FormattedTime time={result.record?.score ?? 0} />
				</div>
			</div>
		{/each}
	</div>
</Card>
