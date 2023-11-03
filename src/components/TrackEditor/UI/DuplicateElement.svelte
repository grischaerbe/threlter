<script lang="ts">
	import Button from '$components/UI/components/Button.svelte'
	import { toReadable } from '../../../lib/utils/toStore'
	import { useTrackEditor } from '../context'

	const { track, currentlySelectedElement } = useTrackEditor()

	const duplicateElement = () => {
		if (!$currentlySelectedElement) return
		const newTrackElement = track.duplicateTrackElement($currentlySelectedElement.id)
		currentlySelectedElement.set(newTrackElement)
	}
</script>

<Button style="regular" class="font-mono" on:click={duplicateElement}>Duplicate</Button>
