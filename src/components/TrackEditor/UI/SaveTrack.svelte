<script lang="ts">
	import SpecialButton from '../../UI/components/SpecialButton.svelte'
	import { useTrackEditor } from '../context'

	const { track } = useTrackEditor()

	// export track
	const onClick = () => {
		track.saveTrackToDisk()
	}
</script>

<SpecialButton class="w-max" style="inverted" forceFocusOnMount on:click={onClick}>
	Export Track
</SpecialButton>
