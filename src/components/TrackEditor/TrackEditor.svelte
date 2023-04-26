<script lang="ts">
	import Car from '$components/Car/Car.svelte'
	import { trackElementPrototypes } from '$components/TrackElements/elements'
	import TrackElement from '$components/TrackViewer/TrackElement.svelte'
	import TrackElementTransform from '$components/TrackViewer/TrackElementTransform.svelte'
	import TrackViewer from '$components/TrackViewer/TrackViewer.svelte'
	import UiWrapper from '$components/UI/UiWrapper.svelte'
	import Card from '$components/UI/components/Card.svelte'
	import TopBarLayout from '$components/UI/layouts/TopBarLayout.svelte'
	import { useKeyDown } from '$hooks/useKeyDown'
	import { useKeyUp } from '$hooks/useKeyUp'
	import type { TrackData } from '$lib/TrackData/TrackData'
	import { T, currentWritable } from '@threlte/core'
	import { interactivity } from '@threlte/extras'
	import CC from 'camera-controls'
	import { Euler } from 'three'
	import { DEG2RAD } from 'three/src/math/MathUtils'
	import { useEvent } from '../../hooks/useEvents'
	import { c } from '../../lib/utils/classes'
	import { appState } from '../../stores/app'
	import CameraControls from '../CameraControls/CameraControls.svelte'
	import SolidBackground from '../Common/SolidBackground.svelte'
	import Wireframe from '../Common/Wireframe.svelte'
	import PlainButton from '../UI/components/PlainButton.svelte'
	import SpecialButton from '../UI/components/SpecialButton.svelte'
	import TrackEditorElementSelection from './TrackEditorElementSelection.svelte'
	import TrackEditorElementSelector from './TrackEditorElementSelector.svelte'
	import TrackEditorElementTransformControls from './TrackEditorElementTransformControls.svelte'
	import AddElement from './UI/AddOrReplaceElement.svelte'
	import DuplicateElement from './UI/DuplicateElement.svelte'
	import ElementDetails from './UI/ElementDetails.svelte'
	import RemoveElement from './UI/RemoveElement.svelte'
	import RotateElement from './UI/RotateElement.svelte'
	import TrackEditorInfo from './UI/TrackEditorInfo.svelte'
	import TrackEditorMenu from './UI/TrackEditorMenu.svelte'
	import { createTrackEditorContext } from './context'

	const { visibility } = appState

	export let trackData: TrackData

	let shiftState = false
	useKeyDown('Shift', (e) => {
		shiftState = true
	})
	useKeyUp('Shift', (e) => {
		shiftState = false
	})

	const showMenu = currentWritable(false)
	const showInfo = currentWritable(false)
	const view = currentWritable<'car' | 'edit'>('edit')
	const editView = currentWritable<
		'orbit' | 'x' | 'x-inverse' | 'y' | 'y-inverse' | 'z' | 'z-inverse'
	>('orbit')

	$: carActive = $view === 'car' && !$showMenu && !$showInfo && $visibility === 'visible'
	$: carFrozen = $view === 'edit' || $showMenu || $showInfo || $visibility === 'hidden'
	$: useOrthoCam =
		$view === 'edit' &&
		($editView === 'x' ||
			$editView === 'y' ||
			$editView === 'z' ||
			$editView === 'x-inverse' ||
			$editView === 'y-inverse' ||
			$editView === 'z-inverse')

	let cameraControlsActive = true

	let wireframe = false

	const validated = trackData.validated

	interactivity()

	const { currentlySelectedElement, transformMode, transformSpace, transformSnap, cameraControls } =
		createTrackEditorContext(trackData)

	$: currentlySelectedElementType = $currentlySelectedElement?.type

	$: if ($currentlySelectedElement) {
		cameraControls.current.forEach((cc) => {
			cc.setOrbitPoint(
				$currentlySelectedElement!.position.current[0],
				$currentlySelectedElement!.position.current[1],
				$currentlySelectedElement!.position.current[2]
			)
		})
	}

	const angles: Record<
		Exclude<typeof $editView, 'orbit'>,
		{ azimuthAngle: number; polarAngle: number }
	> = {
		y: { azimuthAngle: 90 * DEG2RAD, polarAngle: 0 },
		'y-inverse': { azimuthAngle: 90 * DEG2RAD, polarAngle: 180 * DEG2RAD },
		x: { azimuthAngle: 90 * DEG2RAD, polarAngle: 90 * DEG2RAD },
		'x-inverse': { azimuthAngle: 270 * DEG2RAD, polarAngle: 90 * DEG2RAD },
		z: { azimuthAngle: 0, polarAngle: 90 * DEG2RAD },
		'z-inverse': { azimuthAngle: 180 * DEG2RAD, polarAngle: 90 * DEG2RAD }
	}

	const setOrthoView = (editView: Exclude<typeof $editView, 'orbit'>) => {
		cameraControls.current[1].azimuthAngle = angles[editView].azimuthAngle
		cameraControls.current[1].polarAngle = angles[editView].polarAngle
		cameraControls.current[1].setFocalOffset(0, 0, 0, false)
	}

	$: if ($editView !== 'orbit') setOrthoView($editView)

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

	const focusCurrentlySelectedElement = () => {
		if ($showMenu) return
		if (!$currentlySelectedElement || !cameraControls.current) return
		cameraControls.current.forEach((cc) =>
			cc.moveTo(...$currentlySelectedElement!.position.current, true)
		)
		cameraControls.current.forEach((cc) => cc.dollyTo(50, true))
		cameraControls.current.forEach((cc) => cc.setFocalOffset(0, 0, 0, true))
	}

	useKeyDown('Shift+F', () => {
		focusCurrentlySelectedElement()
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
			view.set('edit')
		} else {
			view.set('car')
		}
	})

	useKeyDown('Escape', () => {
		if ($view === 'car') {
			view.set('edit')
		}
	})

	const setEditView = (view: 'x' | 'y' | 'z') => {
		editView.update((currentView) => {
			if (currentView === 'x' && view === 'x') return 'x-inverse'
			else if (view === 'x') return 'x'
			else if (currentView === 'y' && view === 'y') return 'y-inverse'
			else if (view === 'y') return 'y'
			else if (currentView === 'z' && view === 'z') return 'z-inverse'
			else if (view === 'z') return 'z'
			else return currentView
		})
	}

	// edit view
	useKeyDown('x', () => {
		if ($view !== 'edit') return
		setEditView('x')
	})
	useKeyDown('y', () => {
		if ($view !== 'edit') return
		setEditView('y')
	})
	useKeyDown('z', () => {
		if ($view !== 'edit') return
		setEditView('z')
	})
	useKeyDown('o', () => {
		if ($view !== 'edit') return
		editView.set('orbit')
	})

	useKeyDown('w', () => {
		if ($view !== 'edit') return
		wireframe = !wireframe
	})

	const respawnCar = useEvent('respawn-car')
	const resetTrackViewer = useEvent('reset-track-viewer')

	useKeyDown('Enter', () => {
		if ($view === 'car') {
			respawnCar()
			resetTrackViewer()
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
{:else if $view === 'edit'}
	<UiWrapper>
		<TopBarLayout>
			<div slot="topbar-left" class="flex flex-row gap-[15px] w-fit">
				<SpecialButton
					on:click={() => {
						showMenu.set(true)
					}}
				>
					Menu
				</SpecialButton>

				<SpecialButton
					on:click={() => {
						showInfo.set(true)
					}}
				>
					Info
				</SpecialButton>
			</div>

			<div slot="topbar-right" class="flex flex-col gap-[15px] items-end">
				<SpecialButton
					on:click={() => {
						view.set('car')
					}}
				>
					Play
				</SpecialButton>

				<div class="flex flex-col gap-[15px] items-end">
					<!-- Wireframe -->
					<PlainButton
						class={c(
							'aspect-square bg-gray-200 border-2 border-gray-600 text-gray-600 rounded-full inline-block px-[0.2em] [&_svg]:w-[0.85em] [&_svg]:h-[0.85em] [&_svg]:!fill-current',
							wireframe && 'bg-gray-600 !text-white'
						)}
						disabled={$validated}
						on:click={() => (wireframe = !wireframe)}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="48"
							height="48"
							fill="#000000"
							viewBox="0 0 256 256"
						>
							<path
								d="M224.5,95.53v0l-64-64A12,12,0,0,0,152,28H40A12,12,0,0,0,28,40V152a11.94,11.94,0,0,0,3,7.93c.15.18.31.36.5.56l64,64h0A12,12,0,0,0,104,228H216a12,12,0,0,0,12-12V104A12,12,0,0,0,224.5,95.53ZM164,69l23,23H164ZM92,187,69,164H92Zm0-47H52V69l40,40ZM69,52h71V92H109Zm71,64v24H116V116Zm-24,88V164h31l40,40Zm88-17-40-40V116h40Z"
							/>
						</svg>
					</PlainButton>

					<!-- Focus -->
					<PlainButton
						class={c(
							'aspect-square bg-gray-200 border-2 border-gray-600 text-gray-600 rounded-full inline-block px-[0.2em] [&_svg]:w-[0.85em] [&_svg]:h-[0.85em] [&_svg]:!fill-current',
							!$currentlySelectedElement && 'bg-gray-300 !text-gray-400 border-gray-400'
						)}
						disabled={$validated}
						on:click={focusCurrentlySelectedElement}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="48"
							height="48"
							fill="#000000"
							viewBox="0 0 256 256"
						>
							<path
								d="M196,157.43V98.57a17,17,0,0,0-8.42-14.71L136.24,54.21a16.55,16.55,0,0,0-16.48,0L68.43,83.86A17,17,0,0,0,60,98.57v58.86a17,17,0,0,0,8.42,14.71l51.34,29.65a16.53,16.53,0,0,0,16.48,0l51.33-29.65A17,17,0,0,0,196,157.43ZM128,77.17,160.59,96,128,114.81,95.41,96Zm-44,40,32,18.48v36.3L84,153.42Zm56,54.78V135.6l32-18.48v36.3ZM236,48V88a12,12,0,0,1-24,0V60H184a12,12,0,0,1,0-24h40A12,12,0,0,1,236,48ZM84,208a12,12,0,0,1-12,12H32a12,12,0,0,1-12-12V168a12,12,0,0,1,24,0v28H72A12,12,0,0,1,84,208Zm152-40v40a12,12,0,0,1-12,12H184a12,12,0,0,1,0-24h28V168a12,12,0,0,1,24,0ZM20,88V48A12,12,0,0,1,32,36H72a12,12,0,0,1,0,24H44V88a12,12,0,0,1-24,0Z"
							/>
						</svg>
					</PlainButton>

					<!-- Orbit -->
					<PlainButton
						class={c(
							'aspect-square bg-gray-200 border-2 border-gray-600 text-gray-600 rounded-full inline-block px-[0.2em] [&_svg]:w-[0.85em] [&_svg]:h-[0.85em] [&_svg]:!fill-current',
							$editView === 'orbit' && 'bg-gray-600 !text-white'
						)}
						disabled={$validated}
						on:click={() => ($editView = 'orbit')}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="60"
							height="60"
							fill="#000000"
							viewBox="0 0 256 256"
						>
							<path
								d="M244,56v48a12,12,0,0,1-12,12H184a12,12,0,1,1,0-24H201.1l-19-17.38c-.13-.12-.26-.24-.38-.37A76,76,0,1,0,127,204h1a75.53,75.53,0,0,0,52.15-20.72,12,12,0,0,1,16.49,17.45A99.45,99.45,0,0,1,128,228h-1.37A100,100,0,1,1,198.51,57.06L220,76.72V56a12,12,0,0,1,24,0Z"
							/>
						</svg>
					</PlainButton>
					<div class="flex flex-row gap-[5px] items-end">
						<PlainButton
							class={c(
								'aspect-square bg-red-200 border-2 border-red-600 text-red-600 rounded-full inline-block text-[0.85em] px-[0.4em]',
								($editView === 'x' || $editView === 'x-inverse') && 'bg-red-600 !text-white'
							)}
							disabled={$validated}
							on:click={() => setEditView('x')}
						>
							X
						</PlainButton>
						<div class="flex flex-col gap-[5px]">
							<PlainButton
								class={c(
									'aspect-square bg-green-200 border-2 border-green-600 text-green-600 rounded-full inline-block text-[0.85em] px-[0.4em]',
									($editView === 'y' || $editView === 'y-inverse') && 'bg-green-600 !text-white'
								)}
								disabled={$validated}
								on:click={() => setEditView('y')}
							>
								Y
							</PlainButton>
							<PlainButton
								class={c(
									'aspect-square bg-blue-200 border-2 border-blue-600 text-blue-600 rounded-full inline-block text-[0.85em] px-[0.4em]',
									($editView === 'z' || $editView === 'z-inverse') && 'bg-blue-600 !text-white'
								)}
								disabled={$validated}
								on:click={() => setEditView('z')}
							>
								Z
							</PlainButton>
						</div>
					</div>
				</div>
			</div>

			{#if $validated}
				<Card class="flex flex-col gap-[15px] max-w-[28ch]">
					<div class="font-headline">Track validated</div>

					<div class="text-[0.8em]">
						<p class="mb-[10px]">
							The track is validated and can be played. A validated track cannot be edited.
						</p>
						<p>If you want to edit the track, you have to unlock it first.</p>
					</div>

					<div class="pb-[2px]">
						<SpecialButton
							style="red-inverted"
							on:click={() => {
								trackData.invalidate()
							}}
						>
							Unlock
						</SpecialButton>
					</div>
				</Card>
			{/if}

			<div class="absolute bottom-0 left-0">
				<AddElement />
			</div>

			{#if $currentlySelectedElement && $currentlySelectedElementType}
				<div class="absolute bottom-0 right-0">
					<Card>
						<div class="mb-[10px] font-headline">
							{trackElementPrototypes[$currentlySelectedElementType].buttonLabel}
						</div>
						<div class="mb-[20px]">
							{#key $currentlySelectedElement.id}
								<ElementDetails currentlySelectedTrackElement={$currentlySelectedElement} />
							{/key}
						</div>
						<div class="flex flex-row justify-between gap-[2px] text-[0.65em] pb-[2px]">
							<div class="flex flex-row gap-[5px]">
								<DuplicateElement />
								<RotateElement />
							</div>
							<RemoveElement />
						</div>
					</Card>
				</div>
			{:else}
				<div class="absolute bottom-0 right-0" />
			{/if}
		</TopBarLayout>
	</UiWrapper>
{:else if $view === 'car'}
	<UiWrapper>
		<TopBarLayout>
			<SpecialButton
				slot="topbar-left"
				on:click={() => {
					view.set('edit')
				}}
			>
				Edit
			</SpecialButton>

			<SpecialButton
				slot="topbar-right"
				forceFocusOnMount
				on:click={() => {
					respawnCar()
					resetTrackViewer()
				}}
			>
				Reset
			</SpecialButton>
		</TopBarLayout>
	</UiWrapper>
{/if}

<!-- 3D -->
<TrackViewer {trackData} let:trackElement>
	<TrackEditorElementTransformControls
		{trackElement}
		on:mouseDown={() => (cameraControlsActive = false)}
		on:mouseUp={() => (cameraControlsActive = true)}
	/>

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

<Car freeze={carFrozen} active={carActive} useCarCamera={carActive} volume={carActive ? 1 : 0} />

<T.PerspectiveCamera
	makeDefault={$view === 'edit' && $editView === 'orbit'}
	position={[50, 50, 50]}
>
	<CameraControls
		enabled={cameraControlsActive}
		smoothTime={0.1}
		dollyToCursor
		infinityDolly
		draggingSmoothTime={0.05}
		mouseButtons.left={shiftState ? CC.ACTION.TRUCK : CC.ACTION.ROTATE}
		dollySpeed={shiftState ? 0.1 : 1}
		maxDistance={1000}
		bind:ref={$cameraControls[0]}
	/>
</T.PerspectiveCamera>

<T.OrthographicCamera makeDefault={useOrthoCam} position.x={40} zoom={50}>
	<CameraControls
		enabled={cameraControlsActive}
		smoothTime={0.1}
		dollyToCursor
		draggingSmoothTime={0.05}
		mouseButtons.left={CC.ACTION.TRUCK}
		bind:ref={$cameraControls[1]}
	/>
</T.OrthographicCamera>

{#if useOrthoCam || ($view === 'edit' && wireframe)}
	<SolidBackground />
{/if}

{#if $view === 'edit' && wireframe}
	<Wireframe />
{/if}
