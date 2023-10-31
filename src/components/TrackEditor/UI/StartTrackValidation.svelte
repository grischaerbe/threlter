<script lang="ts">
	import Button from '$components/UI/components/Button.svelte'
	import SpecialButton from '../../UI/components/SpecialButton.svelte'
	import { useTrackEditor } from '../context'

	const { track } = useTrackEditor()

	const { validated } = track
</script>

{#if $validated}
	<SpecialButton
		class="w-max"
		style="red-inverted"
		on:click={() => {
			track.invalidate()
		}}
	>
		Unlock Track
	</SpecialButton>
{:else}
	<SpecialButton class="w-max" style="green-inverted" href={`/user/${track.trackId}/validate`}>
		Validate Track
	</SpecialButton>
{/if}
