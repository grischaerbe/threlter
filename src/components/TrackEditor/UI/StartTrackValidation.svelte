<script lang="ts">
	import Button from '$components/UI/components/Button.svelte'
	import SpecialButton from '../../UI/components/SpecialButton.svelte'
	import { useTrackEditor } from '../context'

	const { trackData } = useTrackEditor()

	const { validated } = trackData
</script>

{#if $validated}
	<SpecialButton
		style="red"
		on:click={() => {
			trackData.invalidate()
		}}
	>
		Unlock Track
	</SpecialButton>
{:else}
	<SpecialButton style="green-inverted" href={`/user/${trackData.trackId}/validate`}>
		Validate Track
	</SpecialButton>
{/if}
