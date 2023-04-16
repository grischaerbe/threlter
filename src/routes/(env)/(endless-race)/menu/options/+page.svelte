<script lang="ts">
	import UiWrapper from '$components/UI/UiWrapper.svelte'
	import BackButton from '$components/UI/components/BackButton.svelte'
	import Button from '$components/UI/components/Button.svelte'
	import Card from '$components/UI/components/Card.svelte'
	import Checkbox from '$components/UI/components/Checkbox.svelte'
	import TextInput from '$components/UI/components/TextInput.svelte'
	import TopBarLayout from '$components/UI/layouts/TopBarLayout.svelte'
	import { appState } from '$stores/app'

	const { audio, video, player, debug } = appState.options

	const { name } = player
	const { music, sfx } = audio
	const { postprocessing, shadows } = video

	let oldPlayerName = appState.options.player.name.current
</script>

<UiWrapper>
	<TopBarLayout>
		<BackButton slot="topbar-left" href="/menu/main" />
		<div slot="topbar-center">OPTIONS</div>

		<div class="flex flex-col gap-[15px] w-1/2">
			<Card class="flex flex-col items-start justify-start">
				<div class="mb-[10px]">Audio</div>

				<Checkbox forceFocusOnMount class="pl-0" bind:checked={$music}>Music</Checkbox>

				<Checkbox class="pl-0" bind:checked={$sfx}>SFX</Checkbox>
			</Card>

			<Card class="flex flex-col items-start justify-start">
				<div class="mb-[10px]">Video</div>

				<Checkbox class="pl-0" bind:checked={$shadows}>SHADOWS</Checkbox>
				<Checkbox class="pl-0" bind:checked={$postprocessing}>POST PROCESSING</Checkbox>
			</Card>

			<Card class="flex flex-col items-start justify-start">
				<div class="mb-[10px]">Player</div>

				<TextInput class="mb-[10px]" label="Name" id="name" bind:value={oldPlayerName} />
				<div class="pb-[2px]">
					<Button
						style="grey"
						disabled={!oldPlayerName.length}
						on:click={() => {
							name.set(oldPlayerName)
						}}
					>
						Save
					</Button>
				</div>
			</Card>

			<Card class="flex flex-col items-start justify-start">
				<div class="mb-[10px]">Misc</div>

				<Checkbox class="pl-0" bind:checked={$debug}>DEBUG</Checkbox>
			</Card>
		</div>
	</TopBarLayout>
</UiWrapper>
