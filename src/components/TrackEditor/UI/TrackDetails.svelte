<script lang="ts">
	import TextInput from '$components/UI/components/TextInput.svelte'
	import { toWritable } from '../../../lib/utils/toStore'
	import SpecialButton from '../../UI/components/SpecialButton.svelte'
	import { useTrackEditor } from '../context'

	const { track } = useTrackEditor()

	let newTrackName = track.trackName
</script>

<div class="flex flex-row items-end text-[0.8em]">
	<TextInput
		label="Track Name"
		id="track-name"
		inputClass="!rounded-r-none !border-r-0 h-[46px]"
		preventFocusOnFocusLost
		bind:value={newTrackName}
	/>

	<SpecialButton
		disabled={!newTrackName.length}
		class="h-[46px] !rounded-l-none"
		on:click={() => {
			if (!newTrackName.length) return
			track.trackName = newTrackName
		}}
	>
		Save
	</SpecialButton>
</div>
