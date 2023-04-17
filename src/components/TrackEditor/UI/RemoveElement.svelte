<script lang="ts">
	import Button from '$components/UI/components/Button.svelte'
	import { useTrackEditor } from '../context'

	const { trackData, currentlySelectedElement } = useTrackEditor()
	const { validated } = trackData

	const removeElement = () => {
		if (!$currentlySelectedElement) return
		trackData.removeTrackElement($currentlySelectedElement.id)
		currentlySelectedElement.set(undefined)
	}
</script>

<Button style="red" disabled={$validated} class="font-mono" on:click={removeElement}>Delete</Button>
