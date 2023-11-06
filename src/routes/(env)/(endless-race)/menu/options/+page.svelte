<script lang="ts">
	import Card from '$components/UI/components/Card.svelte'
	import Checkbox from '$components/UI/components/Checkbox.svelte'
	import TextInput from '$components/UI/components/TextInput.svelte'
	import { appState } from '$stores/app'
	import { spring } from 'svelte/motion'
	import { useKeyboardNavigation } from '../../../../../components/UI/KeyboardNavigation.svelte'
	import BlurryCard from '../../../../../components/UI/components/BlurryCard.svelte'
	import SpecialButton from '../../../../../components/UI/components/SpecialButton.svelte'
	import { UserManager } from '../../../../../lib/nakama/UserManager'
	import { c } from '../../../../../lib/utils/classes'

	const { audio, video, player, debug } = appState.options

	const { name, color } = player
	const { music, sfx } = audio
	const { postprocessing, shadows, resolution } = video

	const colors = ['#fe3d00', '#BABACA', '#353535', '#6892be', '#FFD700']

	let currentPlayerName = appState.options.player.name.current
	let error = false

	const { keyboardNavigationAction } = useKeyboardNavigation()

	let cardOpacity = spring(1)

	let hoveringOverColor = false
</script>

<BlurryCard
	class={c(
		'h-full grid grid-cols-2 gap-[15px] transition-colors',
		hoveringOverColor && 'bg-transparent border-transparent backdrop-blur-none'
	)}
>
	<Card
		class={c(
			'flex flex-col items-start justify-start transition',
			hoveringOverColor && 'bg-transparent'
		)}
	>
		<div class="mb-[10px] font-headline">Color</div>
		<div
			class="flex flex-row gap-[10px]"
			on:pointerenter={() => {
				cardOpacity.set(0.25)
				hoveringOverColor = true
			}}
			on:pointerleave={() => {
				cardOpacity.set(1)
				hoveringOverColor = false
			}}
		>
			{#each colors as c}
				<button
					use:keyboardNavigationAction
					class="h-[20px] w-[20px] block border-[3px] border-white/20 rounded-sm outline-none"
					style="background-color: {c};"
					on:click={() => {
						color.set(c)
					}}
					on:focus={() => {
						cardOpacity.set(0.25)
						hoveringOverColor = true
					}}
					on:blur={() => {
						cardOpacity.set(1)
						hoveringOverColor = false
					}}
				/>
			{/each}
		</div>

		<div class={c('transition mt-[20px]', hoveringOverColor && 'opacity-0')}>
			<div class="mb-[10px] font-headline">Name</div>

			<div class="flex flex-row items-end text-[0.8em] w-full">
				<TextInput
					label="Name"
					labelClass="hidden"
					id="name"
					inputClass="!rounded-r-none !border-r-0 h-[46px]"
					preventFocusOnFocusLost
					bind:value={currentPlayerName}
					on:input={() => {
						error = false
					}}
				/>

				<SpecialButton
					class="h-[46px] !rounded-l-none"
					on:click={async () => {
						if (!currentPlayerName.length || currentPlayerName.length > 24) {
							error = true
							return
						}

						const { success } = await UserManager.updateAccount(currentPlayerName)

						if (!success) {
							error = true
						} else {
							error = false
							name.set(currentPlayerName)
						}
					}}
				>
					Save
				</SpecialButton>
			</div>

			{#if !currentPlayerName.length && error}
				<div class="mt-[5px] text-red-500 text-[0.8em] mb-[20px]">Please insert a name</div>
			{:else if error}
				<div class="mt-[5px] text-red-500 text-[0.8em] mb-[20px]">Name already taken</div>
			{/if}

			{#if currentPlayerName.length > 24}
				<div class="mt-[5px] text-red-500 text-[0.8em] mb-[20px]">Name too long</div>
			{/if}
		</div>
	</Card>

	<Card
		class={c(
			'flex flex-col items-start justify-start transition',
			hoveringOverColor && 'bg-transparent opacity-0'
		)}
	>
		<div class="mb-[10px] font-headline">Video</div>

		<Checkbox class="pl-0" bind:checked={$shadows}>SHADOWS</Checkbox>
		<Checkbox class="pl-0" bind:checked={$postprocessing}>POST PROCESSING</Checkbox>

		<div class="mb-[10px] mt-[20px] font-headline">Resolution</div>

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

	<Card
		class={c(
			'flex flex-col items-start justify-start transition',
			hoveringOverColor && 'bg-transparent opacity-0'
		)}
	>
		<div class="mb-[10px] font-headline">Audio</div>

		<Checkbox class="pl-0" bind:checked={$music}>Music</Checkbox>

		<Checkbox class="pl-0" bind:checked={$sfx}>SFX</Checkbox>
	</Card>

	<Card
		class={c(
			'flex flex-col items-start justify-start transition',
			hoveringOverColor && 'bg-transparent opacity-0'
		)}
	>
		<div class="mb-[10px] font-headline">Misc</div>

		<Checkbox class="pl-0" bind:checked={$debug}>DEBUG</Checkbox>
	</Card>
</BlurryCard>
