<script lang="ts" context="module">
	type TrackViewerContext = {
		track: Track
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
	import type { Track } from '$lib/Track/Track'
	import { currentWritable, type CurrentWritable } from '@threlte/core'
	import { createEventDispatcher, getContext, setContext } from 'svelte'
	import { toReadable } from '../../lib/utils/toStore'
	import { appState } from '../../stores/app'
	import { useAudioProvider } from '../Utilities/AudioProvider.svelte'

	const { sfx } = appState.options.audio

	export let track: Track

	const elements = toReadable(track.trackData, 'trackElements')

	const dispatch = createEventDispatcher<{
		trackcompleted: void
		checkpointReached: { trackElementId: string }
	}>()

	const { playAudio } = useAudioProvider()

	const checkpointsReached = currentWritable<Set<string>>(new Set())
	const trackCompleted = currentWritable(false)

	const checkpointReached = (trackElementId: string) => {
		if (checkpointsReached.current.has(trackElementId)) return
		if ($sfx) {
			playAudio('success1')
		}
		checkpointsReached.update((set) => {
			set.add(trackElementId)
			return set
		})
		dispatch('checkpointReached', { trackElementId })
	}

	const finishReached = () => {
		// player didn't go through all checkpoints
		if (checkpointsReached.current.size !== track.trackData.checkpointCount) return

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
		track: track,
		checkpointReached,
		finishReached,
		checkpointsReached,
		trackCompleted
	}

	setContext('track-context', ctx)

	export const reset = () => {
		checkpointsReached.update((set) => {
			set.clear()
			return set
		})
		trackCompleted.set(false)
	}
</script>

{#each $elements as element (element.id)}
	<slot trackElement={element} />
{/each}
