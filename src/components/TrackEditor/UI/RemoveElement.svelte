<script lang="ts">
	import Button from '$components/UI/components/Button.svelte'
	import { useTrackEditor } from '../context'

	const { track, currentlySelectedElement } = useTrackEditor()
	const { validated } = track

	const removeElement = () => {
		if (!$currentlySelectedElement) return
		track.removeTrackElement($currentlySelectedElement.id)
		currentlySelectedElement.set(undefined)
	}
</script>

<Button style="red" disabled={$validated} class="font-mono" on:click={removeElement}>Delete</Button>
