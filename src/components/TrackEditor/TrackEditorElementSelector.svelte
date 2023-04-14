<script lang="ts">
	import type { TrackElement } from '$lib/TrackData/TrackData'
	import { T } from '@threlte/core'
	import { useTrackEditor } from './context'

	export let trackElement: TrackElement

	const { currentlySelectedElement, isDragging, trackData } = useTrackEditor()

	const { validated } = trackData

	$: if ($validated) currentlySelectedElement.set(undefined)

	$: selected = $currentlySelectedElement?.id === trackElement.id
</script>

<T.Group
	on:click={(e) => {
		e.stopPropagation()
		if ($isDragging || $validated) return
		currentlySelectedElement.set(trackElement)
	}}
	on:pointermissed={() => {
		if ($isDragging || $validated) return
		currentlySelectedElement.set(undefined)
	}}
>
	<slot {selected} />
</T.Group>
