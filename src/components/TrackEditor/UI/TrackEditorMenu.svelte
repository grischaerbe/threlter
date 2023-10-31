<script lang="ts">
	import UiWrapper from '$components/UI/UiWrapper.svelte'
	import Card from '$components/UI/components/Card.svelte'
	import TopBarLayout from '$components/UI/layouts/TopBarLayout.svelte'
	import { createEventDispatcher } from 'svelte'
	import BlurryCard from '../../UI/components/BlurryCard.svelte'
	import SpecialButton from '../../UI/components/SpecialButton.svelte'
	import StartTrackValidation from './StartTrackValidation.svelte'
	import TrackDetails from './TrackDetails.svelte'

	const dispatch = createEventDispatcher<{
		close: undefined
	}>()
</script>

<UiWrapper>
	<!-- Prevent user interaction on canvas -->
	<div class="absolute top-0 left-0 w-full h-full pointer-events-auto" />

	<TopBarLayout>
		<SpecialButton
			slot="topbar-left"
			on:click={() => {
				dispatch('close')
			}}
		>
			CLOSE
		</SpecialButton>

		<SpecialButton slot="topbar-right" href="/menu/main">Main Menu</SpecialButton>

		<BlurryCard class="h-full grid grid-cols-2 gap-[15px]">
			<Card class="flex flex-col gap-[15px]">
				<div class="font-headline">Track details</div>
				<TrackDetails />
			</Card>

			<Card class="flex flex-col gap-[15px]">
				<div class="font-headline">TRACK VALIDATION</div>
				<div class="text-[0.8em]">
					A track must be validated before it can be played. To validate a track, it must be
					completed from start to finish.
				</div>
				<StartTrackValidation />
			</Card>
		</BlurryCard>
	</TopBarLayout>
</UiWrapper>
