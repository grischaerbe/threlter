<script lang="ts">
	import Car from '$components/Car/Car.svelte'
	import { trackElementPrototypes } from '$components/TrackElements/elements'
	import TrackElement from '$components/TrackViewer/TrackElement.svelte'
	import TrackElementTransform from '$components/TrackViewer/TrackElementTransform.svelte'
	import TrackViewer from '$components/TrackViewer/TrackViewer.svelte'
	import UiWrapper from '$components/UI/UiWrapper.svelte'
	import BackButton from '$components/UI/components/BackButton.svelte'
	import Button from '$components/UI/components/Button.svelte'
	import Card from '$components/UI/components/Card.svelte'
	import TopBarLayout from '$components/UI/layouts/TopBarLayout.svelte'
	import { useKeyDown } from '$hooks/useKeyDown'
	import { useKeyUp } from '$hooks/useKeyUp'
	import type { TrackData } from '$lib/TrackData/TrackData'
	import { T, currentWritable } from '@threlte/core'
	import { OrbitControls, interactivity } from '@threlte/extras'
	import { Euler } from 'three'
	import { DEG2RAD } from 'three/src/math/MathUtils'
	import TrackEditorElementSelection from './TrackEditorElementSelection.svelte'
	import TrackEditorElementSelector from './TrackEditorElementSelector.svelte'
	import TrackEditorElementTransformControls from './TrackEditorElementTransformControls.svelte'
	import AddElement from './UI/AddOrReplaceElement.svelte'
	import DuplicateElement from './UI/DuplicateElement.svelte'
	import TrackEditorInfo from './UI/TrackEditorInfo.svelte'
	import TrackEditorMenu from './UI/TrackEditorMenu.svelte'
	import ElementDetails from './UI/ElementDetails.svelte'
	import RemoveElement from './UI/RemoveElement.svelte'
	import RotateElement from './UI/RotateElement.svelte'
	import { createTrackEditorContext } from './context'
	import { useEvent } from '../../hooks/useEvents'

	export let trackData: TrackData

	const showMenu = currentWritable(false)
	const showInfo = currentWritable(false)
	const view = currentWritable<'car' | 'orbit'>('orbit')

	$: carActive = $view === 'car' && !$showMenu

	const validated = trackData.validated

	interactivity()

	const { currentlySelectedElement, transformMode, transformSpace, transformSnap } =
		createTrackEditorContext(trackData)

	$: currentlySelectedElementType = $currentlySelectedElement?.type

	useKeyDown('t', () => {
		if ($showMenu) return
		transformMode.set('translate')
	})

	useKeyDown('r', () => {
		if ($showMenu) return
		transformMode.set('rotate')
	})

	useKeyDown('Shift+R', () => {
		if ($showMenu) return
		if (!$currentlySelectedElement) return
		const euler = new Euler().set(...$currentlySelectedElement.rotation.current)
		// snap to the next 90 degree rotation on the y axis
		euler.y += 90 * DEG2RAD
		// modulo 360
		euler.y = euler.y % (Math.PI * 2)
		const newRotation = euler.toArray()
		trackData.setTrackElementRotation($currentlySelectedElement.id, newRotation as any)
	})

	useKeyDown('g', () => {
		if ($showMenu) return
		transformSpace.update((space) => {
			if (space === 'local') {
				return 'world'
			} else {
				return 'local'
			}
		})
	})

	useKeyDown('Shift+D', () => {
		if ($showMenu) return
		if (!$currentlySelectedElement) return
		const newElement = trackData.duplicateTrackElement($currentlySelectedElement.id)
		currentlySelectedElement.set(newElement)
	})

	useKeyDown('Control+Backspace', () => {
		if ($showMenu) return
		if (!$currentlySelectedElement) return
		trackData.removeTrackElement($currentlySelectedElement.id)
		currentlySelectedElement.set(undefined)
	})

	useKeyDown('Shift', () => {
		if ($showMenu) return
		transformSnap.set(true)
	})

	useKeyUp('Shift', () => {
		if ($showMenu) return
		transformSnap.set(false)
	})

	useKeyDown('v', () => {
		if ($showMenu) return
		if ($view === 'car') {
			view.set('orbit')
		} else {
			view.set('car')
		}
	})

	const respawnCar = useEvent('respawn-car')

	useKeyDown('Enter', () => {
		if ($view === 'car') {
			respawnCar()
		}
	})
</script>

<!-- UI -->
{#if $showInfo}
	<TrackEditorInfo
		on:close={() => {
			showInfo.set(false)
		}}
	/>
{:else if $showMenu}
	<TrackEditorMenu
		on:close={() => {
			showMenu.set(false)
		}}
	/>
{:else if $view === 'orbit'}
	<UiWrapper>
		<TopBarLayout>
			<div slot="topbar-left" class="flex flex-col gap-[2px] w-fit">
				<Button
					on:click={() => {
						showMenu.set(true)
					}}
				>
					Menu
				</Button>

				<Button
					on:click={() => {
						showInfo.set(true)
					}}
				>
					Info
				</Button>
			</div>

			<div slot="topbar-center">Track editor</div>

			<Button
				slot="topbar-right"
				on:click={() => {
					view.set('car')
				}}
			>
				Play
			</Button>

			{#if $validated}
				<Card class="flex flex-col gap-[20px] max-w-[400px]">
					<div>Track is validated</div>

					<div class="text-[0.65em]">
						The track is validated and can be played. While the track is validated, you cannot edit
						it. If you want to edit the track, you have to unlock it first.
					</div>

					<div class="pb-[2px]">
						<Button
							style="red"
							on:click={() => {
								trackData.invalidate()
							}}
						>
							Unlock
						</Button>
					</div>
				</Card>
			{/if}

			<div class="absolute bottom-0 left-0">
				<AddElement />
			</div>

			{#if $currentlySelectedElement && $currentlySelectedElementType}
				<div class="absolute bottom-0 right-0">
					<Card>
						<div class="mb-[20px]">
							{trackElementPrototypes[$currentlySelectedElementType].buttonLabel}
						</div>
						<div class="mb-[20px]">
							{#key $currentlySelectedElement.id}
								<ElementDetails currentlySelectedTrackElement={$currentlySelectedElement} />
							{/key}
						</div>
						<div class="flex flex-row justify-between gap-[2px] text-[0.65em] pb-[2px]">
							<div class="flex flex-row gap-[2px]">
								<DuplicateElement />
								<RotateElement />
							</div>
							<RemoveElement />
						</div>
					</Card>
				</div>
			{/if}
		</TopBarLayout>
	</UiWrapper>
{:else if $view === 'car'}
	<UiWrapper>
		<TopBarLayout>
			<div slot="topbar-left" class="flex flex-col gap-[2px] w-fit">
				<BackButton
					on:click={() => {
						view.set('orbit')
					}}
				>
					Track
				</BackButton>
				<Button
					forceFocusOnMount
					on:click={() => {
						respawnCar()
					}}
				>
					Reset
				</Button>
			</div>
		</TopBarLayout>
	</UiWrapper>
{/if}

<!-- 3D -->
<TrackViewer {trackData} let:trackElement>
	<TrackEditorElementTransformControls {trackElement} />

	<TrackElementTransform reactive {trackElement}>
		<TrackEditorElementSelector {trackElement} let:selected>
			<TrackElement {trackElement}>
				<svelte:fragment slot="track-element-selection">
					{#if selected}
						<TrackEditorElementSelection />
					{/if}
				</svelte:fragment>
			</TrackElement>
		</TrackEditorElementSelector>
	</TrackElementTransform>
</TrackViewer>

<Car active={carActive} useCarCamera={carActive} volume={carActive ? 1 : 0} />

<T.PerspectiveCamera
	makeDefault={$view === 'orbit'}
	on:create={({ ref }) => {
		ref.position.set(30, 30, 30)
		ref.lookAt(0, 0, 0)
	}}
>
	<OrbitControls />
</T.PerspectiveCamera>
