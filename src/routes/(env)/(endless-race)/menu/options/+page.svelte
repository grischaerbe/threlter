<script lang="ts">
	import UiWrapper from '$components/UI/UiWrapper.svelte'
	import Card from '$components/UI/components/Card.svelte'
	import Checkbox from '$components/UI/components/Checkbox.svelte'
	import TextInput from '$components/UI/components/TextInput.svelte'
	import TopBarLayout from '$components/UI/layouts/TopBarLayout.svelte'
	import { appState } from '$stores/app'
	import BlurryCard from '../../../../../components/UI/components/BlurryCard.svelte'
	import SpecialButton from '../../../../../components/UI/components/SpecialButton.svelte'
	import TopMenu from '../../../../../components/UI/layouts/TopMenu.svelte'

	const { audio, video, player, debug } = appState.options

	const { name } = player
	const { music, sfx } = audio
	const { postprocessing, shadows } = video

	let oldPlayerName = appState.options.player.name.current
</script>

<UiWrapper>
	<TopBarLayout>
		<TopMenu slot="topbar-center" />

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
			</Card>

			<Card class="flex flex-col items-start justify-start">
				<div class="mb-[10px] font-headline">Player</div>

				<div class="flex flex-row items-end text-[0.8em] w-full">
					<TextInput
						label="Name"
						id="name"
						inputClass="!rounded-r-none !border-r-0"
						preventFocusOnFocusLost
						bind:value={oldPlayerName}
					/>

					<SpecialButton
						disabled={!oldPlayerName.length}
						class="h-[46px] !rounded-l-none"
						on:click={() => {
							name.set(oldPlayerName)
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
	</TopBarLayout>
</UiWrapper>
