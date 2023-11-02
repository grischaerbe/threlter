<script lang="ts">
	import { T } from '@threlte/core'
	import type { TrackElement } from '../../lib/Track/TrackElement'
	import { useTrackEditor } from './context'
	import { toReadable } from '../../lib/utils/toStore'

	export let trackElement: TrackElement

	const { currentlySelectedElement, isDragging, track } = useTrackEditor()

	const validated = toReadable(track, 'validated')

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
