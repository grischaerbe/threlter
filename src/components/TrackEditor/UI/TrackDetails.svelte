<script lang="ts">
	import TextInput from '$components/UI/components/TextInput.svelte'
	import SpecialButton from '../../UI/components/SpecialButton.svelte'
	import { useTrackEditor } from '../context'

	const { track } = useTrackEditor()

	let trackName = track.trackName.current
</script>

<div class="flex flex-row items-end text-[0.8em]">
	<TextInput
		label="Track Name"
		id="track-name"
		inputClass="!rounded-r-none !border-r-0 h-[46px]"
		preventFocusOnFocusLost
		bind:value={trackName}
	/>

	<SpecialButton
		disabled={!trackName.length}
		class="h-[46px] !rounded-l-none"
		on:click={() => {
			if (!trackName.length) return
			track.setTrackName(trackName)
			track.toLocalStorage(0)
		}}
	>
		Save
	</SpecialButton>
</div>
