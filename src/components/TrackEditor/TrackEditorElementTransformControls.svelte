<script lang="ts" context="module">
	let isDraggingTimeout: ReturnType<typeof setTimeout>
</script>

<script lang="ts">
	import { T, watch } from '@threlte/core'
	import { TransformControls } from '@threlte/extras'
	import { derived } from 'svelte/store'
	import type { Group } from 'three'
	import { useTrackEditor } from './context'
	import { onDestroy } from 'svelte'
	import type { TrackElement } from '$lib/Track/TrackElement'
	import { useKeyDown } from '../../hooks/useKeyDown'
	import { useKeyUp } from '../../hooks/useKeyUp'
	import { toReadable } from '../../lib/utils/toStore'

	export let trackElement: TrackElement

	const {
		currentlySelectedElement,
		track,
		transformMode,
		transformSpace,
		transformSnap,
		isDragging
	} = useTrackEditor()

	let currentPosition: TrackElement['position'] = [0, 0, 0]
	let currentRotation: TrackElement['rotation'] = [0, 0, 0, 'XYZ']

	watch(currentlySelectedElement, (currentlySelectedElement) => {
		if (!currentlySelectedElement) return
		const position = toReadable(currentlySelectedElement, 'position')
		const rotation = toReadable(currentlySelectedElement, 'rotation')
		const unsubscribePosition = position.subscribe((position) => {
			currentPosition = position
		})
		const unsubscribeRotation = rotation.subscribe((rotation) => {
			currentRotation = rotation
		})
		return () => {
			unsubscribePosition()
			unsubscribeRotation()
		}
	})

	const selected = derived(currentlySelectedElement, (currentlySelectedElement) => {
		return currentlySelectedElement?.id === trackElement.id
	})

	const onChange = (ref: Group) => {
		track.setTrackElementPosition(trackElement.id, ref.position.toArray())
		const rotation = ref.rotation.toArray() as TrackElement['rotation']
		track.setTrackElementRotation(trackElement.id, rotation)
	}

	let altIsDown = false
	useKeyDown('Alt', () => {
		altIsDown = true
	})
	useKeyUp('Alt', () => {
		altIsDown = false
	})

	const onMouseDown = () => {
		if (altIsDown) {
			track.duplicateTrackElement(trackElement.id)
		}
		clearTimeout(isDraggingTimeout)
		isDragging.set(true)
	}

	const onMouseUp = () => {
		clearTimeout(isDraggingTimeout)
		// we're delaying this a bit so that the click event on the track element selector
		// doesn't get triggered. this is a bit of a hack, but it works for now.
		isDraggingTimeout = setTimeout(() => {
			isDragging.set(false)
		}, 150)
	}
	onDestroy(() => {
		clearTimeout(isDraggingTimeout)
	})
</script>

{#if $selected && currentPosition && currentRotation}
	<T.Group position={currentPosition} rotation={currentRotation} let:ref>
		<TransformControls
			raycast={() => {
				return false
			}}
			object={ref}
			space={$transformSpace}
			mode={$transformMode}
			translationSnap={$transformSnap ? 1 : null}
			rotationSnap={$transformSnap ? (5 * Math.PI) / 180 : null}
			on:objectChange={() => {
				onChange(ref)
			}}
			on:mouseDown={onMouseDown}
			on:mouseUp={onMouseUp}
			on:mouseDown
			on:mouseUp
		/>
	</T.Group>
{/if}
