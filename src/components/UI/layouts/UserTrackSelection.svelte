<script lang="ts">
	import { c } from '$lib/utils/classes'
	import { createRawEventDispatcher } from '@threlte/core'
	import type { UserTrack } from '../../../lib/Track/UserTrack'
	import BlurryCard from '../components/BlurryCard.svelte'
	import Card from '../components/Card.svelte'
	import PlainButton from '../components/PlainButton.svelte'

	export let tracks: UserTrack[]
	export let selectedTrackId: string | undefined = undefined

	export let headline: string | undefined = undefined

	type $$Events = {
		trackSelected: UserTrack
	}
	const dispatch = createRawEventDispatcher<$$Events>()
</script>

{#if headline}
	<div class="font-headline text-orange mb-[15px]">{headline}</div>
{/if}

<BlurryCard class="grid grid-cols-3 gap-[15px] h-full min-h-0">
	{#if tracks.length}
		<Card class="h-min !p-0 overflow-hidden border-2 border-blue-950">
			<div class="flex flex-col col-span-1 h-min overflow-auto text-[0.8em]">
				{#each tracks as track, index}
					{#if track}
						<PlainButton
							on:click={() => dispatch('trackSelected', track)}
							class={c(
								'text-orange text-left px-[12px] py-[8px] hover:bg-blue-darker focus:bg-blue-darker outline-none',
								selectedTrackId === track.trackId && '!bg-orange !text-blue-darkest',
								index === 0 && 'pt-[11px]',
								index === tracks.length - 1 && 'pb-[11px]'
							)}
						>
							{track.trackName}
						</PlainButton>
					{/if}
				{/each}
			</div>
		</Card>
	{/if}

	<slot />
</BlurryCard>
