<script lang="ts">
	import Button from '$components/UI/components/Button.svelte'
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
	<Button style="green" href={`/user/${trackData.trackId}/validate`}>Validate Track</Button>
{/if}
