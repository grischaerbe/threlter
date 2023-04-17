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
	import { useAudioProvider } from '../Utilities/AudioProvider.svelte'
	import { appState } from '../../stores/app'

	const { sfx } = appState.options.audio

	export let trackData: TrackData
	$: elements = trackData.trackElements

	const dispatch = createEventDispatcher<{
		trackcompleted: void
	}>()

	const { playAudio } = useAudioProvider()

	const checkpointsReached = currentWritable<Set<string>>(new Set())
	const trackCompleted = currentWritable(false)

	const checkpointReached = (trackElementId: string) => {
		if (!checkpointsReached.current.has(trackElementId) && $sfx) {
			playAudio('success1')
		}
		checkpointsReached.update((set) => {
			set.add(trackElementId)
			return set
		})
	}

	const finishReached = () => {
		if ($sfx && !trackCompleted.current) {
			playAudio('success1', {
				detune: 500 // perfect fifth
			})
			playAudio('crowd-cheering', {
				volume: 0.3
			})
		}
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
