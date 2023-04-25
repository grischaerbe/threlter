<script lang="ts">
	import Button from '$components/UI/components/Button.svelte'
	import { useTrackEditor } from '../context'

	const { trackData, currentlySelectedElement, cameraControls } = useTrackEditor()
	const { validated } = trackData

	const focusElement = () => {
		if (!$currentlySelectedElement || !cameraControls.current) return
		cameraControls.current.moveTo(...$currentlySelectedElement.position.current, true)
		cameraControls.current.dollyTo(50, true)
	}
</script>

<Button style="regular" class="font-mono" disabled={$validated} on:click={focusElement}>
	Focus
</Button>
