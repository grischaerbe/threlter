<script lang="ts">
	import Button from '$components/UI/components/Button.svelte'
	import { useTrackEditor } from '../context'

	const { track, currentlySelectedElement } = useTrackEditor()
	const validated = track.validated

	const duplicateElement = () => {
		if (!$currentlySelectedElement) return
		const newTrackElement = track.duplicateTrackElement($currentlySelectedElement.id)
		currentlySelectedElement.set(newTrackElement)
	}
</script>

<Button style="regular" class="font-mono" disabled={$validated} on:click={duplicateElement}>
	Duplicate
</Button>
