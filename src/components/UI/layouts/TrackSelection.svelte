<script lang="ts">
	import { useKeyDown } from '$hooks/useKeyDown'
	import type { TrackData } from '$lib/TrackData/TrackData'
	import { TrackRecord } from '$lib/TrackRecord/TrackRecord'
	import { c } from '$lib/utils/classes'
	import { formatTime } from '$lib/utils/formatters'
	import { createEventDispatcher } from 'svelte'
	import Button from '../components/Button.svelte'
	import TrackTimes from '$components/UI/components/TrackTimes.svelte'

	export let trackDatas: TrackData[]

	export let tracksCanBeEdited = false
	export let tracksCanBeDuplicated = false
	export let tracksCanBeDeleted = false
	export let showAuthor = false

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
	}>()
</script>

<div class="grid grid-cols-3 mt-[15px] gap-[15px] h-full min-h-0">
	<div class="flex flex-col col-span-1 gap-[2px] h-full overflow-auto pointer-events-auto">
		{#each trackDatas as trackData, index}
			{#if trackData}
				<Button
					forceFocusOnMount={index === 0}
					on:click={() => selectTrack(trackData.trackId)}
					class={c(selectedTrackId === trackData.trackId && '!bg-black !text-white')}
				>
					{trackData.trackName.current}
				</Button>
			{/if}
		{/each}
	</div>

	{#if selectedTrackId}
		{@const trackData = trackDatas.find((trackData) => trackData.trackId === selectedTrackId)}
		{#if trackData}
			{@const trackRecord = TrackRecord.fromLocalStorage(trackData)}
			<div class="col-span-2">
				<div class="bg-white rounded-sm px-[2px] text-black uppercase flex flex-col gap-[10px]">
					<div>
						"{trackData.trackName.current}"
						{#if trackData.authorName.current.length && showAuthor}
							<div>
								{trackData.authorName.current}
							</div>
						{/if}
					</div>

					<TrackTimes class="w-[27ch]" {trackData} {trackRecord} />

					<div class="flex flex-row justify-between items-center mb-[2px]">
						{#if trackData.validated.current}
							<Button
								forceFocusOnMount
								style="green"
								on:click={() => {
									dispatch('playtrack', { trackId: trackData.trackId })
								}}
							>
								Play
							</Button>
						{:else}
							<div />
						{/if}

						{#if tracksCanBeEdited || tracksCanBeDeleted}
							<div class="flex flex-row justify-end items-center gap-[2px]">
								{#if tracksCanBeEdited}
									<Button
										forceFocusOnMount={!trackData.validated.current}
										style="inverted"
										on:click={() => {
											dispatch('edittrack', { trackId: trackData.trackId })
										}}
									>
										Edit
									</Button>
								{/if}
								{#if tracksCanBeDuplicated}
									<Button
										style="inverted"
										on:click={() => {
											dispatch('duplicatetrack', { trackId: trackData.trackId })
										}}
									>
										Duplicate
									</Button>
								{/if}

								{#if tracksCanBeDeleted}
									<Button
										style="red"
										on:click={() => {
											dispatch('deletetrack', { trackId: trackData.trackId })
										}}
									>
										Delete
									</Button>
								{/if}
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/if}
	{/if}
</div>
