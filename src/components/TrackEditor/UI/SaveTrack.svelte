<script lang="ts">
	import Button from '$components/UI/components/Button.svelte'
	import SpecialButton from '../../UI/components/SpecialButton.svelte'
	import { useTrackEditor } from '../context'

	const { trackData } = useTrackEditor()

	// export trackData
	const onClick = () => {
		trackData.saveTrackToDisk()
	}
</script>

<SpecialButton class="w-max" style="inverted" forceFocusOnMount on:click={onClick}>
	Export Track
</SpecialButton>
