<script lang="ts">
	import { useKeyDown } from '$hooks/useKeyDown'
	import { actions, appState } from '$stores/app'
	import UiWrapper from '$components/UI/UiWrapper.svelte'
	import type { PageData } from './$types'
	import TopBarLayout from '$components/UI/layouts/TopBarLayout.svelte'
	import Checkbox from '$components/UI/components/Checkbox.svelte'
	import BackButton from '$components/UI/components/BackButton.svelte'
	import Card from '$components/UI/components/Card.svelte'
	import TextInput from '$components/UI/components/TextInput.svelte'
	import Button from '$components/UI/components/Button.svelte'

	const { audio, video } = appState.options

	let oldPlayerName = appState.options.player.name.current
</script>

<UiWrapper>
	<TopBarLayout>
		<BackButton slot="topbar-left" href="/menu/main" />
		<div slot="topbar-center">OPTIONS</div>

		<div class="flex flex-col gap-[15px] w-1/2">
			<Card class="flex flex-col items-start justify-start">
				<div class="mb-[10px]">Audio</div>

				<Checkbox
					forceFocusOnMount
					class="pl-0"
					checked={audio.music.current}
					on:change={(value) => {
						actions.setMusic(value.detail)
					}}
				>
					Music
				</Checkbox>

				<Checkbox
					class="pl-0"
					checked={audio.sfx.current}
					on:change={(value) => {
						actions.setSfx(value.detail)
					}}
				>
					SFX
				</Checkbox>
			</Card>

			<Card class="flex flex-col items-start justify-start">
				<div class="mb-[10px]">Video</div>

				<Checkbox
					class="pl-0"
					checked={video.shadows.current}
					on:change={(value) => {
						actions.setShadows(value.detail)
					}}
				>
					SHADOWS
				</Checkbox>
				<Checkbox
					class="pl-0"
					checked={video.postprocessing.current}
					on:change={(value) => {
						actions.setPostprocessing(value.detail)
					}}
				>
					POST PROCESSING
				</Checkbox>
			</Card>

			<Card class="flex flex-col items-start justify-start">
				<div class="mb-[10px]">Player</div>

				<TextInput class="mb-[10px]" label="Name" id="name" bind:value={oldPlayerName} />
				<div class="pb-[2px]">
					<Button
						style="grey"
						disabled={!oldPlayerName.length}
						on:click={() => {
							actions.setPlayerName(oldPlayerName)
						}}
					>
						Save
					</Button>
				</div>
			</Card>
		</div>
	</TopBarLayout>
</UiWrapper>
