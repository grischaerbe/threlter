<script lang="ts">
	import Button from '$components/UI/components/Button.svelte'
	import TextInput from '$components/UI/components/TextInput.svelte'
	import { useTrackEditor } from '../context'

	const { trackData } = useTrackEditor()

	let trackName = trackData.trackName.current
</script>

<div class="flex flex-row gap-[2px] items-end text-[0.65em]">
	<TextInput label="Track Name" id="track-name" preventFocusOnFocusLost bind:value={trackName} />

	<Button
		disabled={!trackName.length}
		style="grey"
		on:click={() => {
			if (!trackName.length) return
			trackData.trackName.set(trackName)
		}}
	>
		Save
	</Button>
</div>
