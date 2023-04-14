<script lang="ts">
	import UiWrapper from '$components/UI/UiWrapper.svelte'
	import BackButton from '$components/UI/components/BackButton.svelte'
	import Button from '$components/UI/components/Button.svelte'
	import Card from '$components/UI/components/Card.svelte'
	import TopBarLayout from '$components/UI/layouts/TopBarLayout.svelte'
	import { createEventDispatcher } from 'svelte'
	import SaveTrack from './SaveTrack.svelte'
	import StartTrackValidation from './StartTrackValidation.svelte'
	import TrackDetails from './TrackDetails.svelte'

	const dispatch = createEventDispatcher<{
		close: undefined
	}>()
</script>

<UiWrapper>
	<!-- Prevent user interaction on canvas -->
	<div class="absolute top-0 left-0 w-full h-full bg-black/40 pointer-events-auto" />

	<TopBarLayout>
		<BackButton
			slot="topbar-left"
			on:click={() => {
				dispatch('close')
			}}
		/>

		<div slot="topbar-center">Track Menu</div>

		<Button slot="topbar-right" href="/menu/main">Main Menu</Button>

		<div class="flex flex-col gap-[15px]">
			<Card class="flex flex-col gap-[15px] max-w-[400px]">
				<div>Track details</div>
				<div class="pb-[2px]">
					<TrackDetails />
				</div>
			</Card>

			<Card class="flex flex-col gap-[15px] max-w-[400px]">
				<div>TRACK VALIDATION</div>

				<div class="text-[0.65em]">
					A track must be validated before it can be played. To validate a track, it must be
					completed from start to finish.
				</div>

				<div class="pb-[2px]">
					<StartTrackValidation />
				</div>
			</Card>

			<Card class="flex flex-col gap-[15px] max-w-[400px]">
				<div>Track export</div>

				<div class="text-[0.65em]">Share your track with your friends.</div>

				<div class="pb-[2px]">
					<SaveTrack />
				</div>
			</Card>
		</div>
	</TopBarLayout>
</UiWrapper>
