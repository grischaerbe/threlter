<script lang="ts">
	import Button from '$components/UI/components/Button.svelte'
	import { useTrackEditor } from '../context'

	const { trackData } = useTrackEditor()

	// export trackData
	const onClick = () => {
		trackData.saveTrackToDisk()
	}
</script>

<Button forceFocusOnMount style="inverted" on:click={onClick}>Export Track</Button>
