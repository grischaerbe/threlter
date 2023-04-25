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
			<div class="flex flex-col gap-[15px] h-full items-stretch">
				<Card class="flex flex-col gap-[10px] w-auto h-full">
					<div class="font-headline">Autosave</div>

					<div class="text-[0.65em]">
						Your changes are automatically saved. Your tracks are saved in your browser storage, so
						changing the browser or using an incognito window will make it necessary to export and
						import your tracks.
					</div>
				</Card>

				<Card class="flex flex-col gap-[10px] w-auto h-full">
					<div class="font-headline">TRACK VALIDATION</div>

					<div class="text-[0.65em]">
						A track must be validated before it can be played. To validate a track, it must be
						completed from start to finish. This means it must have a finish and you need to be able
						to reach the finish from the start.
					</div>
				</Card>

				<Card class="flex flex-col gap-[10px] w-auto h-full">
					<div class="font-headline">Track export</div>

					<div class="text-[0.65em]">
						Tracks can be exported to share them with other players. An exported track can then be
						imported in "User Tracks".
					</div>
				</Card>
			</div>

			<Card class="flex flex-col gap-[10px] w-auto">
				<div class="font-headline">Keyboard controls</div>

				<div
					class="text-[0.65em] grid grid-cols-[auto_auto] gap-x-[25px] [&_hr]:col-span-2 [&_hr]:border-orange [&_div]:py-[2px]"
				>
					<div class="col-span-2 bg-blue-900/40 px-[5px] !pt-[3px]">
						<div class="font-headline">General</div>
					</div>

					<hr />
					<div>V</div>
					<div>Toggle Test Drive Mode</div>
					<hr />

					<div class="col-span-2 bg-blue-900/40 px-[5px] !pt-[3px]">
						<div class="font-headline">View</div>
					</div>

					<hr />
					<div>Drag</div>
					<div>Rotate View</div>
					<hr />

					<div>
						Mousewheel + Drag
						<br />
						Shift + Drag
					</div>
					<div>Pan View</div>
					<hr />

					<div>Mousewheel</div>
					<div>Zoom View</div>
					<hr />

					<div>Shift + F</div>
					<div>Focus selected element</div>
					<hr />

					<div class="col-span-2 bg-blue-900/40 px-[5px] !pt-[3px]">
						<div class="font-headline">Elements</div>
					</div>

					<hr />
					<div>Shift + D</div>
					<div>Duplicate selected element</div>
					<hr />
					<div>Alt + Drag Element</div>
					<div>Duplicate element</div>
					<hr />
					<div>Shift + R</div>
					<div>Rotate selected element</div>
					<hr />
					<div>T</div>
					<div>Translate controls</div>
					<hr />
					<div>R</div>
					<div>Rotate controls</div>
					<hr />
					<div>G</div>
					<div>Toggle transform space "world"&nbsp;↔︎&nbsp;"local"</div>
					<hr />

					<div>Control + Backspace</div>
					<div>Delete selected element</div>
					<hr />
					<div>Shift + Drag</div>
					<div>Snap to grid</div>
					<hr />
				</div>
			</Card>
		</BlurryCard>
	</TopBarLayout>
</UiWrapper>
