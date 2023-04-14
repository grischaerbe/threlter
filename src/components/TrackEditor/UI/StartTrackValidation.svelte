<script lang="ts">
	import Button from '$components/UI/components/Button.svelte'
	import { actions } from '$stores/app'
	import { useTrackEditor } from '../context'

	const { trackData } = useTrackEditor()

	const { validated } = trackData
</script>

{#if $validated}
	<Button
		style="red"
		on:click={() => {
			trackData.invalidate()
		}}
	>
		Unlock Track
	</Button>
{:else}
	<Button
		style="green"
		on:click={() => {
			actions.startTrackValidation()
		}}
	>
		Validate Track
	</Button>
{/if}
