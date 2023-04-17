<script lang="ts">
	import { useKeyDown } from '$hooks/useKeyDown'
	import type { TrackData } from '$lib/TrackData/TrackData'
	import { TrackRecord } from '$lib/TrackRecord/TrackRecord'
	import { c } from '$lib/utils/classes'
	import { formatTime } from '$lib/utils/formatters'
	import { createEventDispatcher } from 'svelte'
	import Button from '../components/Button.svelte'
	import TrackTimes from '$components/UI/components/TrackTimes.svelte'
	import Card from '../components/Card.svelte'
	import PlainButton from '../components/PlainButton.svelte'
	import SpecialButton from '../components/SpecialButton.svelte'
	import ButtonGroup from '../components/ButtonGroup/ButtonGroup.svelte'
	import BlurryCard from '../components/BlurryCard.svelte'

	export let trackDatas: TrackData[]

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
		playtrack: { trackId: string }
		edittrack: { trackId: string }
		deletetrack: { trackId: string }
		duplicatetrack: { trackId: string }
		exporttrack: { trackId: string }
		validatetrack: { trackId: string }
	}>()
</script>

{#if headline}
	<div class="font-headline text-orange mb-[15px]">{headline}</div>
{/if}

<BlurryCard class="grid grid-cols-3 gap-[15px] h-full min-h-0">
	<slot />

	{#if trackDatas.length}
		<Card class="h-min !p-0 overflow-hidden border-2 border-blue-950">
			<div class="flex flex-col col-span-1 h-min overflow-auto text-[0.8em]">
				{#each trackDatas as trackData, index}
					{#if trackData}
						<PlainButton
							on:click={() => selectTrack(trackData.trackId)}
							class={c(
								'text-orange text-left px-[12px] py-[8px] hover:bg-blue-darker focus:bg-blue-darker outline-none',
								selectedTrackId === trackData.trackId && '!bg-orange !text-blue-darkest',
								index === 0 && 'pt-[11px]',
								index === trackDatas.length - 1 && 'pb-[11px]'
							)}
						>
							{trackData.trackName.current}
						</PlainButton>
					{/if}
				{/each}
			</div>
		</Card>
	{/if}

	{#if selectedTrackId}
		{@const trackData = trackDatas.find((trackData) => trackData.trackId === selectedTrackId)}
		{#if trackData}
			{@const trackRecord = TrackRecord.fromLocalStorage(trackData)}
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
								{trackData.trackName.current}
							</span>

							{#if trackData.authorName.current.length && showAuthor}
								<div class="text-[0.8em]">
									{trackData.authorName.current}
								</div>
							{/if}
						</div>

						{#if trackData.validated.current}
							<SpecialButton
								style="green-inverted"
								on:click={() => {
									dispatch('playtrack', { trackId: trackData.trackId })
								}}
							>
								Play
							</SpecialButton>
						{/if}
					</div>

					{#if tracksCanBeValidated && !trackData.validated.current}
						<div class="text-[0.8em]">
							Track is not validated yet.
							<br />
							To play it, you need to validate it first.
						</div>
					{/if}

					{#if trackData.validated.current}
						<TrackTimes class="w-[27ch] text-[0.8em]" {trackData} {trackRecord} />
					{/if}
				</Card>

				{#if tracksCanBeDeleted || tracksCanBeDuplicated || tracksCanBeEdited || tracksCanBeValidated}
					<div class="flex flex-row justify-end items-stretch mb-[2px]">
						<ButtonGroup let:divider={Divider} class="text-[0.7em] !rounded-t-none !border-t-0">
							{#if !trackData.validated.current && tracksCanBeValidated}
								<PlainButton
									on:click={() => {
										dispatch('validatetrack', { trackId: trackData.trackId })
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
										dispatch('edittrack', { trackId: trackData.trackId })
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
										dispatch('duplicatetrack', { trackId: trackData.trackId })
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
										dispatch('exporttrack', { trackId: trackData.trackId })
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
										dispatch('deletetrack', { trackId: trackData.trackId })
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
