<script lang="ts">
	import UiWrapper from '$components/UI/UiWrapper.svelte'
	import BackButton from '$components/UI/components/BackButton.svelte'
	import Card from '$components/UI/components/Card.svelte'
	import TopBarLayout from '$components/UI/layouts/TopBarLayout.svelte'
	import { createEventDispatcher } from 'svelte'
	import SpecialButton from '../../UI/components/SpecialButton.svelte'
	import BlurryCard from '../../UI/components/BlurryCard.svelte'

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

		<BlurryCard class="h-full grid grid-cols-2 gap-[15px]">
			<Card class="flex flex-col gap-[10px] w-auto">
				<div class="font-headline">Keyboard controls</div>

				<div class="text-[0.65em]">
					Shift + D - Duplicate selected element
					<br />
					Shift + R - Rotate selected element
					<br />
					T - Translate controls
					<br />
					R - Rotate controls
					<br />
					G - Toggle Transformation spaces "world" and "local"
					<br />
					V - Toggle Test Drive Mode
					<br />
					Control + Backspace - Delete selected element
					<br />
					Shift + Drag - Snap to grid
				</div>
			</Card>

			<Card class="flex flex-col gap-[10px] w-auto">
				<div class="font-headline">TRACK VALIDATION</div>

				<div class="text-[0.65em]">
					A track must be validated before it can be played. To validate a track, it must be
					completed from start to finish. This means it must have a finish and you need to be able
					to reach the finish from the start.
				</div>
			</Card>

			<Card class="flex flex-col gap-[10px] w-auto">
				<div class="font-headline">Track export</div>

				<div class="text-[0.65em]">
					Tracks can be exported to share them with other players. An exported track can then be
					imported in "User Tracks".
				</div>
			</Card>
		</BlurryCard>
	</TopBarLayout>
</UiWrapper>
