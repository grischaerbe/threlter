<script lang="ts">
	import { useKeyDown } from '$hooks/useKeyDown'
	import type { Track } from '$lib/Track/Track'
	import { T, currentWritable, useFrame } from '@threlte/core'
	import { useGamepad, useSuspense } from '@threlte/extras'
	import type CC from 'camera-controls'
	import { createEventDispatcher, type ComponentProps } from 'svelte'
	import { spring } from 'svelte/motion'
	import { derived } from 'svelte/store'
	import type { Box3 } from 'three'
	import { DEG2RAD } from 'three/src/math/MathUtils'
	import { useKeyUp } from '../../hooks/useKeyUp'
	import { TrackRecord } from '../../lib/TrackRecord/TrackRecord'
	import { SessionManager } from '../../lib/nakama/SessionManager'
	import { MatchState } from '../../lib/nakama/matchHandler/time-trial/types'
	import CameraControls from '../CameraControls/CameraControls.svelte'
	import Car from '../Car/Car.svelte'
	import Bounds from '../CommonGamePlay/Bounds.svelte'
	import BoundsState from '../CommonGamePlay/BoundsState.svelte'
	import GhostRecorder from '../CommonGamePlay/GhostRecorder.svelte'
	import OutOfBounds from '../CommonGamePlay/UI/OutOfBounds.svelte'
	import TrackElement from '../TrackViewer/TrackElement.svelte'
	import TrackElementTransform from '../TrackViewer/TrackElementTransform.svelte'
	import TrackViewer from '../TrackViewer/TrackViewer.svelte'
	import UiWrapper from '../UI/UiWrapper.svelte'
	import EmitCarState from './EmitCarState.svelte'

	export let track: Track
	export let matchState: MatchState
	export let matchEndTime: number

	let currentTrackRecord = new TrackRecord(SessionManager.getUserId(), track.trackId)

	const dispatch = createEventDispatcher<{
		trackcompleted: {
			trackRecord: TrackRecord
		}
	}>()

	// forwarded from <Car>
	let takeSnapshot: ComponentProps<Car>['takeSnapshot']
	let restore: ComponentProps<Car>['restore']
	let clearSnapshot: ComponentProps<Car>['clearSnapshot']
	let respawn: ComponentProps<Car>['respawn']
	let hasSnapshot: ComponentProps<Car>['hasSnapshot']

	// forwarded from <TrackViewer>
	let resetTrackViewer: ComponentProps<TrackViewer>['reset']

	const state = currentWritable<'warm-up' | 'count-in' | 'playing' | 'finished' | 'cool-down'>(
		'warm-up'
	)
	const paused = currentWritable(false)
	const time = currentWritable(0)

	$: if (matchState === MatchState.InProgress) {
		state.set('count-in')
	} else if (matchState === MatchState.CoolDown) {
		clearSnapshot?.()
		resetTrackViewer?.()
		state.set('cool-down')
	} else if (matchState === MatchState.WarmUp) {
		clearSnapshot?.()
		resetTrackViewer?.()
		state.set('warm-up')
	}

	const carActive = derived([paused, state], ([paused, state]) => {
		if (paused) return false
		if (state === 'playing') return true
		return false
	})

	const carFrozen = derived([state], ([state]) => {
		if (state === 'playing' || state === 'finished' || state === 'cool-down') return false
		return true
	})

	const useCarCamera = derived([state], ([state]) => {
		if (state === 'warm-up') return false
		if (state === 'cool-down') return false
		return true
	})

	const freezeCamera = derived([state], ([state]) => {
		if (state === 'finished') return true
		return false
	})

	const carVolumeSpring = spring(0)
	const carVolume = derived([state], ([state]) => {
		if (state === 'count-in' || state === 'playing' || state === 'finished') return 1
		return 0
	})
	$: carVolumeSpring.set($carVolume)

	useFrame((_, delta) => {
		if ($state === 'playing') {
			time.update((t) => t + delta * 1000)
		}
	})

	const gamepad = useGamepad()

	const togglePause = () => {
		if ($state === 'playing') {
			paused.set(!paused.current)
		}
	}

	gamepad.start.on('press', togglePause)
	useKeyDown('Escape', togglePause)
	useKeyDown('p', togglePause)

	const proceed = () => {
		if ($paused) {
			paused.set(false)
		}
	}

	const restart = () => {
		paused.set(false)
		clearSnapshot?.()
		respawn?.()
		resetTrackViewer?.()
		state.set('count-in')
		time.set(0)
		// create new track record
		currentTrackRecord = new TrackRecord(SessionManager.getUserId(), track.trackId)
	}

	gamepad.clusterRight.on('press', () => {
		if ($state === 'warm-up' || $state === 'cool-down') return
		if ($paused) return
		restart()
	})

	useKeyDown('Backspace', (e) => {
		if ($state === 'warm-up' || $state === 'cool-down') return
		if ($paused) return
		e.preventDefault()
		restart()
	})

	// pressing enter restores the car to the last checkpoint
	gamepad.clusterBottom.on('press', () => {
		if ($state === 'finished') restart()
		if ($state === 'warm-up' || $state === 'cool-down') return
		if ($paused) return
		if (hasSnapshot?.()) {
			restore?.()
		} else {
			restart()
		}
	})
	useKeyDown('Enter', (e) => {
		if ($state === 'finished') restart()
		if ($state === 'warm-up' || $state === 'cool-down') return
		if ($paused) return
		e.preventDefault()
		if (hasSnapshot?.()) {
			restore?.()
		} else {
			restart()
		}
	})

	const onFinishReached = () => {
		clearSnapshot?.()
		state.set('finished')
		currentTrackRecord.time = $time
		dispatch('trackcompleted', {
			trackRecord: currentTrackRecord
		})
		// make new track record
		currentTrackRecord = new TrackRecord(SessionManager.getUserId(), track.trackId)
	}

	let cc: CC
	let autoRotate = true
	useFrame(() => {
		if (cc && (gamepad.leftStick.x !== 0 || gamepad.leftStick.y !== 0)) {
			cc.rotate(gamepad.leftStick.x * 0.02, gamepad.leftStick.y * 0.02, true)
			autoRotate = false
		}
	})

	let showLeaderboard = false
	useKeyDown('Tab', (e) => {
		e.preventDefault()
		showLeaderboard = true
	})
	useKeyUp('Tab', () => {
		showLeaderboard = false
	})

	let boundsBox3: Box3 | undefined

	const { suspended } = useSuspense()
</script>

<Car
	freeze={$carFrozen}
	active={$carActive}
	volume={$carVolumeSpring}
	freezeCamera={$freezeCamera}
	useCarCamera={$useCarCamera}
	bind:takeSnapshot
	bind:restore
	bind:clearSnapshot
	bind:respawn
	bind:hasSnapshot
	let:carState
>
	<slot name="ghosts" {carState} />

	<EmitCarState on:carstate {carState} />

	{#if $state === 'playing' && boundsBox3}
		<BoundsState {boundsBox3} {carState} let:isOutOfBounds>
			{#if isOutOfBounds}
				<UiWrapper>
					<slot name="ui-out-of-bounds" {restart}>
						<OutOfBounds />
					</slot>
				</UiWrapper>
			{/if}
		</BoundsState>
	{/if}

	{#if $state === 'playing'}
		<GhostRecorder ghost={currentTrackRecord.ghost} time={$time} {carState} />
	{/if}
</Car>

<Bounds let:center let:radius let:sphere bind:boundsBox3>
	<TrackViewer
		let:trackElement
		{track}
		on:trackcompleted={onFinishReached}
		on:checkpointReached={() => {
			takeSnapshot?.()
		}}
		bind:reset={resetTrackViewer}
	>
		<TrackElementTransform {trackElement}>
			<TrackElement {trackElement} />
		</TrackElementTransform>
	</TrackViewer>

	{#if radius > 0 && $state === 'warm-up'}
		<T.PerspectiveCamera makeDefault position.x={radius}>
			<CameraControls
				{autoRotate}
				autoRotateSpeed={0.5}
				truckSpeed={0}
				bind:ref={cc}
				on:create={async ({ ref }) => {
					await ref.moveTo(center.x, center.y, center.z)
					await ref.fitToSphere(sphere, false)
					const currentDist = ref.distance
					ref.polarAngle = 75 * DEG2RAD
					ref.minDistance = currentDist
					ref.maxDistance = currentDist
				}}
			/>
		</T.PerspectiveCamera>
	{/if}
</Bounds>

{#if !$suspended}
	<UiWrapper>
		{#if $paused}
			<slot time={$time} {proceed} {restart} name="ui-paused" />
		{:else if $state === 'warm-up'}
			<slot name="ui-warm-up" />
		{:else if $state === 'count-in'}
			<slot
				name="ui-count-in"
				time={$time}
				start={() => {
					state.set('playing')
				}}
			/>
		{:else if $state === 'playing'}
			{#if showLeaderboard}
				<slot name="ui-leaderboard" />
			{/if}

			<slot name="ui-playing" time={$time} />
		{:else if $state === 'finished'}
			<slot name="ui-finished" time={$time} />
		{:else if $state === 'cool-down'}
			<slot name="ui-cool-down" time={$time} />
		{/if}
	</UiWrapper>
{/if}
