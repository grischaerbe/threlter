<script lang="ts">
	import Button from '$components/UI/components/Button.svelte'
	import { toReadable } from '../../../lib/utils/toStore'
	import { useTrackEditor } from '../context'

	const { track, currentlySelectedElement } = useTrackEditor()

	const removeElement = () => {
		if (!$currentlySelectedElement) return
		track.removeTrackElement($currentlySelectedElement.id)
		currentlySelectedElement.set(undefined)
	}
</script>

<Button style="red" class="font-mono" on:click={removeElement}>Delete</Button>
