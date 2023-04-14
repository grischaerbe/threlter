<script lang="ts" context="module">
	type TrackViewerContext = {
		trackData: TrackData
		checkpointReached: (trackElementId: string) => void
		finishReached: () => void
		checkpointsReached: CurrentWritable<Set<string>>
		trackCompleted: CurrentWritable<boolean>
	}

	export const useTrackViewer = (): TrackViewerContext => {
		const ctx = getContext<TrackViewerContext>('track-context')
		if (!ctx) {
			throw new Error('No track context found')
		}
		return ctx
	}
</script>

<script lang="ts">
	import type { TrackData } from '$lib/TrackData/TrackData'
	import { currentWritable, type CurrentWritable } from '@threlte/core'
	import { createEventDispatcher, getContext, setContext } from 'svelte'
	import { useEvent } from '../../hooks/useEvents'

	export let trackData: TrackData
	$: elements = trackData.trackElements

	const dispatch = createEventDispatcher<{
		trackcompleted: void
	}>()

	const checkpointsReached = currentWritable<Set<string>>(new Set())
	const trackCompleted = currentWritable(false)

	const checkpointReached = (trackElementId: string) => {
		checkpointsReached.update((set) => {
			set.add(trackElementId)
			return set
		})
	}

	const finishReached = () => {
		trackCompleted.set(true)
		dispatch('trackcompleted')
	}

	const ctx: TrackViewerContext = {
		trackData,
		checkpointReached,
		finishReached,
		checkpointsReached,
		trackCompleted
	}

	setContext('track-context', ctx)

	useEvent('reset-track-viewer', () => {
		checkpointsReached.update((set) => {
			set.clear()
			return set
		})
		trackCompleted.set(false)
	})
</script>

{#each $elements as element (element.id)}
	<slot trackElement={element} />
{/each}
