<script lang="ts">
	import Button from '$components/UI/components/Button.svelte'
	import { useTrackEditor } from '../context'

	const { trackData, currentlySelectedElement } = useTrackEditor()
	const validated = trackData.validated

	const duplicateElement = () => {
		if (!$currentlySelectedElement) return
		const newTrackElement = trackData.duplicateTrackElement($currentlySelectedElement.id)
		currentlySelectedElement.set(newTrackElement)
	}
</script>

<Button style="grey" disabled={$validated} on:click={duplicateElement}>Duplicate</Button>
