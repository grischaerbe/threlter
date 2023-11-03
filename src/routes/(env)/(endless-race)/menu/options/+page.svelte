<script lang="ts">
	import Card from '$components/UI/components/Card.svelte'
	import Checkbox from '$components/UI/components/Checkbox.svelte'
	import TextInput from '$components/UI/components/TextInput.svelte'
	import { appState } from '$stores/app'
	import BlurryCard from '../../../../../components/UI/components/BlurryCard.svelte'
	import SpecialButton from '../../../../../components/UI/components/SpecialButton.svelte'
	import { nakama } from '../../../../../lib/nakama'

	const { audio, video, player, debug } = appState.options

	const { name } = player
	const { music, sfx } = audio
	const { postprocessing, shadows, resolution } = video

	let oldPlayerName = appState.options.player.name.current
</script>

<BlurryCard class="h-full grid grid-cols-2 gap-[15px]">
	<Card class="flex flex-col items-start justify-start">
		<div class="mb-[10px] font-headline">Audio</div>

		<Checkbox forceFocusOnMount class="pl-0" bind:checked={$music}>Music</Checkbox>

		<Checkbox class="pl-0" bind:checked={$sfx}>SFX</Checkbox>
	</Card>

	<Card class="flex flex-col items-start justify-start">
		<div class="mb-[10px] font-headline">Video</div>

		<Checkbox class="pl-0" bind:checked={$shadows}>SHADOWS</Checkbox>
		<Checkbox class="pl-0" bind:checked={$postprocessing}>POST PROCESSING</Checkbox>

		<div class="my-[10px] font-headline">Resolution</div>

		<Checkbox
			class="pl-0"
			checked={$resolution === 'high'}
			on:click={() => {
				resolution.set('high')
			}}
		>
			HIGH
		</Checkbox>
		<Checkbox
			class="pl-0"
			checked={$resolution === 'medium'}
			on:click={() => {
				resolution.set('medium')
			}}
		>
			MEDIUM
		</Checkbox>
		<Checkbox
			class="pl-0"
			checked={$resolution === 'low'}
			on:click={() => {
				resolution.set('low')
			}}
		>
			LOW
		</Checkbox>
	</Card>

	<Card class="flex flex-col items-start justify-start">
		<div class="mb-[10px] font-headline">Player</div>

		<div class="flex flex-row items-end text-[0.8em] w-full">
			<TextInput
				label="Name"
				id="name"
				inputClass="!rounded-r-none !border-r-0 h-[46px]"
				preventFocusOnFocusLost
				bind:value={oldPlayerName}
			/>

			<SpecialButton
				disabled={!oldPlayerName.length}
				class="h-[46px] !rounded-l-none"
				on:click={() => {
					name.set(oldPlayerName)
					nakama.updateAccount()
				}}
			>
				Save
			</SpecialButton>
		</div>
	</Card>

	<Card class="flex flex-col items-start justify-start">
		<div class="mb-[10px] font-headline">Misc</div>

		<Checkbox class="pl-0" bind:checked={$debug}>DEBUG</Checkbox>
	</Card>
</BlurryCard>
