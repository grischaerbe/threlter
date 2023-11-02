<script lang="ts">
	import TrackTimes from '$components/UI/components/TrackTimes.svelte'
	import type { Track } from '$lib/Track/Track'
	import { TrackRecord } from '$lib/TrackRecord/TrackRecord'
	import { c } from '$lib/utils/classes'
	import { createEventDispatcher } from 'svelte'
	import BlurryCard from '../components/BlurryCard.svelte'
	import ButtonGroup from '../components/ButtonGroup/ButtonGroup.svelte'
	import Card from '../components/Card.svelte'
	import PlainButton from '../components/PlainButton.svelte'
	import SpecialButton from '../components/SpecialButton.svelte'

	export let tracks: Track[]

	export let tracksCanBeEdited = false
	export let tracksCanBeDuplicated = false
	export let tracksCanBeDeleted = false
	export let tracksCanBeValidated = false
	export let tracksCanBeExported = false
	export let showAuthor = false
	export let headline: string | undefined = undefined

	let selectedTrackId: string | undefined = undefined

	export let trackSelected = false
	$: trackSelected = !!selectedTrackId

	const selectTrack = (trackId: string) => {
		selectedTrackId = trackId
	}

	const dispatch = createEventDispatcher<{
		playtrack: { track: Track }
		edittrack: { track: Track }
		deletetrack: { track: Track }
		duplicatetrack: { track: Track }
		exporttrack: { track: Track }
		validatetrack: { track: Track }
	}>()
</script>

{#if headline}
	<div class="font-headline text-orange mb-[15px]">{headline}</div>
{/if}

<BlurryCard class="grid grid-cols-3 gap-[15px] h-full min-h-0">
	<slot />

	{#if tracks.length}
		<Card class="h-min !p-0 overflow-hidden border-2 border-blue-950">
			<div class="flex flex-col col-span-1 h-min overflow-auto text-[0.8em]">
				{#each tracks as track, index}
					{#if track}
						<PlainButton
							on:click={() => selectTrack(track.trackId)}
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

	{#if selectedTrackId}
		{@const track = tracks.find((track) => track.trackId === selectedTrackId)}
		{#if track}
			{@const trackRecord = TrackRecord.fromLocalStorage(track)}
			<div class="col-span-2">
				<Card
					class={c(
						'flex flex-col gap-[10px]',
						(tracksCanBeDeleted ||
							tracksCanBeDuplicated ||
							tracksCanBeEdited ||
							tracksCanBeValidated) &&
							'!rounded-br-none'
					)}
				>
					<div class="flex flex-row justify-between items-start mb-[15px]">
						<div>
							<span class="font-headline">
								{track.trackName}
							</span>

							{#if track.authorName.length && showAuthor}
								<div class="text-[0.8em]">
									{track.authorName}
								</div>
							{/if}
						</div>

						{#if track.validated}
							<SpecialButton
								style="green-inverted"
								on:click={() => {
									dispatch('playtrack', { track })
								}}
							>
								Play
							</SpecialButton>
						{/if}
					</div>

					{#if tracksCanBeValidated && !track.validated}
						<div class="text-[0.8em]">
							Track is not validated yet.
							<br />
							To play it, you need to validate it first.
						</div>
					{/if}

					{#if track.validated}
						<TrackTimes class="w-[27ch] text-[0.8em]" {track} {trackRecord} />
					{/if}
				</Card>

				{#if tracksCanBeDeleted || tracksCanBeDuplicated || tracksCanBeEdited || tracksCanBeValidated}
					<div class="flex flex-row justify-end items-stretch mb-[2px]">
						<ButtonGroup let:divider={Divider} class="text-[0.7em] !rounded-t-none !border-t-0">
							{#if !track.validated && tracksCanBeValidated}
								<PlainButton
									on:click={() => {
										dispatch('validatetrack', { track })
									}}
									class="font-mono uppercase tracking-wide px-2 py-1 text-blue-darkest bg-green-500/80 hover:bg-green-500 focus:bg-green-500"
								>
									Validate
								</PlainButton>
								<Divider />
							{/if}
							{#if tracksCanBeEdited}
								<PlainButton
									on:click={() => {
										dispatch('edittrack', { track })
									}}
									class="font-mono uppercase tracking-wide px-2 py-1 text-orange bg-blue-950/60 hover:bg-blue-950/80 focus:bg-blue-950/80"
								>
									Edit
								</PlainButton>
								<Divider />
							{/if}
							{#if tracksCanBeDuplicated}
								<PlainButton
									class="font-mono uppercase tracking-wide px-2 py-1 text-orange bg-blue-950/60 hover:bg-blue-950/80 focus:bg-blue-950/80"
									on:click={() => {
										dispatch('duplicatetrack', { track })
									}}
								>
									Duplicate
								</PlainButton>
								<Divider />
							{/if}
							{#if tracksCanBeExported}
								<PlainButton
									class="font-mono uppercase tracking-wide px-2 py-1 text-orange bg-blue-950/60 hover:bg-blue-950/80 focus:bg-blue-950/80"
									on:click={() => {
										dispatch('exporttrack', { track })
									}}
								>
									Export
								</PlainButton>
								<Divider />
							{/if}
							{#if tracksCanBeDeleted}
								<PlainButton
									class="font-mono uppercase tracking-wide px-2 py-1 text-blue-darkest bg-red-500/80 hover:bg-red-500 focus:bg-red-500"
									on:click={() => {
										dispatch('deletetrack', { track })
									}}
								>
									Delete
								</PlainButton>
							{/if}
						</ButtonGroup>
					</div>
				{/if}
			</div>
		{/if}
	{/if}
</BlurryCard>
