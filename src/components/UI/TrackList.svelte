<script lang="ts">
	import { c } from '$lib/utils/classes'
	import { createRawEventDispatcher } from '@threlte/core'
	import type { UserTrack } from '../../lib/Track/UserTrack'
	import Card from './components/Card.svelte'
	import PlainButton from './components/PlainButton.svelte'

	export let tracks: UserTrack[]
	export let selectedTrackId: string | undefined = undefined
	export let hasNextPage: boolean = false
	export let hasPreviousPage: boolean = false
	export let selectTrackHref: ((track: UserTrack) => string) | undefined = undefined

	let _class = ''
	export { _class as class }

	type $$Events = {
		trackSelected: UserTrack
		nextPage: void
		previousPage: void
	}
	const dispatch = createRawEventDispatcher<$$Events>()
</script>

{#if tracks.length}
	<Card class={c('h-min !p-0 overflow-hidden border-2 border-blue-950', _class)}>
		<div class="flex flex-col col-span-1 h-min overflow-auto text-[0.8em]">
			{#each tracks as track, index}
				{#if track}
					<PlainButton
						on:click={() => dispatch('trackSelected', track)}
						href={selectTrackHref ? selectTrackHref(track) : undefined}
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

		{#if hasNextPage || hasPreviousPage}
			<div class="text-[0.8em] flex justify-stretch [&>*]:flex-1 gap-[5px] px-[5px] py-[10px]">
				<PlainButton
					on:click={() => {
						if (!hasPreviousPage) return
						dispatch('previousPage')
					}}
				>
					Previous
				</PlainButton>
				<PlainButton
					on:click={() => {
						if (!hasNextPage) return
						dispatch('nextPage')
					}}
				>
					Next
				</PlainButton>
			</div>
		{/if}
	</Card>
{/if}
