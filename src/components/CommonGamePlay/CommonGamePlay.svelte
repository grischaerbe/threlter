<script lang="ts">
	import { useKeyDown } from '$hooks/useKeyDown'
	import type { Track } from '$lib/Track/Track'
	import { appState } from '$stores/app'
	import { T, currentWritable, useFrame, watch } from '@threlte/core'
	import { Suspense, useGamepad } from '@threlte/extras'
	import type CC from 'camera-controls'
	import { spring } from 'svelte/motion'
	import { derived } from 'svelte/store'
	import { DEG2RAD } from 'three/src/math/MathUtils'
	import { useEvent } from '../../hooks/useEvents'
	import type { TrackRecordsManager } from '../../lib/TrackRecord/TrackRecordsManager'
	import { nakama } from '../../lib/nakama'
	import CameraControls from '../CameraControls/CameraControls.svelte'
	import Car from '../Car/Car.svelte'
	import TrackElement from '../TrackViewer/TrackElement.svelte'
	import TrackElementTransform from '../TrackViewer/TrackElementTransform.svelte'
	import TrackViewer from '../TrackViewer/TrackViewer.svelte'
	import LoadingUi from '../UI/LoadingUi.svelte'
	import UiWrapper from '../UI/UiWrapper.svelte'
	import BoundingSphere from './BoundingSphere.svelte'
	import GhostPlayer from './GhostPlayer.svelte'
	import GhostRecorder from './GhostRecorder.svelte'
	import CountIn from './UI/CountIn.svelte'
	import GamePlay from './UI/GamePlay.svelte'
	import { toReadable } from '../../lib/utils/toStore'

	const { userId } = nakama

	if (!$userId) throw new Error('No user id found')

	export let track: Track
	export let trackRecordsManager: TrackRecordsManager

	const currentRecord = toReadable(trackRecordsManager, 'current')
	const ghostRecords = toReadable(trackRecordsManager, 'ghostRecords')

	const { visibility } = appState

	const state = currentWritable<'intro' | 'count-in' | 'playing' | 'finished'>('intro')
	const paused = currentWritable(false)
	const time = currentWritable(0)

	const carActive = derived([state, visibility, paused], ([state, visibility, paused]) => {
		if (visibility === 'hidden') return false
		if (paused) return false
		if (state === 'playing') return true
		return false
	})

	const carFrozen = derived([state, visibility, paused], ([state, visibility, paused]) => {
		if (visibility === 'hidden') return true
		if (paused) return true
		if (state === 'playing' || state === 'finished') return false
		return true
	})

	const carVolumeSpring = spring(0)
	const carVolume = derived([paused, state], ([paused, state]) => {
		if (paused) return 0
		if (state === 'intro') return 0.3
		return 1
	})
	$: carVolumeSpring.set($carVolume)

	useFrame((_, delta) => {
		if ($paused || $state !== 'playing') return
		time.update((t) => t + delta * 1000)
	})

	const gamepad = useGamepad()

	const pauseGame = () => {
		if ($state === 'playing') {
			paused.set(true)
		}
	}

	gamepad.start.on('press', pauseGame)
	useKeyDown('Escape', pauseGame)
	useKeyDown('p', pauseGame)

	const proceed = () => {
		if ($paused) {
			paused.set(false)
		} else if ($state === 'intro') {
			state.set('count-in')
		} else if ($state === 'count-in') {
			state.set('playing')
		} else if ($state === 'playing') {
			state.set('finished')
		}
	}

	const resetTrackViewer = useEvent('reset-track-viewer')
	const respawnCar = useEvent('respawn-car')

	const restart = () => {
		paused.set(false)
		respawnCar()
		resetTrackViewer()
		state.set('intro')
		time.set(0)
	}

	watch(state, (state) => {
		// when we're "playing", we initialize a new working track record
		if (state === 'playing') {
			if (!$userId) {
				throw new Error('No user id found')
			}
			trackRecordsManager.reset()
		}
	})

	const softReset = () => {
		respawnCar()
		resetTrackViewer()
		state.set('count-in')
		time.set(0)
	}

	const softResetGame = () => {
		if ($state === 'playing' && !$paused) {
			softReset()
		}
	}

	gamepad.clusterBottom.on('press', softResetGame)
	useKeyDown('Enter', softResetGame)

	let newTrackRecord = false
	let newPersonalBest = false

	const onFinishReached = () => {
		trackRecordsManager.setCurrentFinalTime($time)
		state.set('finished')
	}

	let cc: CC
	let autoRotate = true
	useFrame(() => {
		if (cc && (gamepad.leftStick.x !== 0 || gamepad.leftStick.y !== 0)) {
			cc.rotate(gamepad.leftStick.x * 0.02, gamepad.leftStick.y * 0.02, true)
			autoRotate = false
		}
	})
</script>

<Suspense final let:suspended>
	<LoadingUi slot="fallback" />

	<!-- 3D -->
	{#if track}
		<BoundingSphere let:center let:radius let:sphere>
			<TrackViewer let:trackElement {track} on:trackcompleted={onFinishReached}>
				<TrackElementTransform {trackElement}>
					<TrackElement {trackElement} />
				</TrackElementTransform>
			</TrackViewer>

			{#if radius > 0 && $state === 'intro'}
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
		</BoundingSphere>
	{/if}

	<Car
		active={$carActive}
		volume={$carVolumeSpring}
		freeze={$carFrozen}
		freezeCamera={$state === 'finished'}
		useCarCamera={$state !== 'intro'}
		let:carState
	>
		{#if $state === 'playing'}
			<GhostRecorder ghost={$currentRecord.ghost} time={$time} {carState} />
		{/if}

		{#each $ghostRecords as trackRecord}
			<GhostPlayer {carState} ghost={trackRecord.ghost} time={$time} />
		{/each}
	</Car>

	{#if !suspended}
		<!-- UI -->
		<UiWrapper>
			{#if $paused}
				<slot time={$time} {proceed} {restart} name="ui-paused" />
			{:else if $state === 'intro'}
				<slot {proceed} name="ui-intro" />
			{:else if $state === 'count-in'}
				<slot name="ui-count-in" {proceed}>
					<CountIn on:countindone={proceed} time={$time} />
				</slot>
			{:else if $state === 'playing'}
				<slot name="ui-playing" time={$time}>
					<GamePlay time={$time} />
				</slot>
			{:else if $state === 'finished'}
				<slot name="ui-finished" {restart} time={$time} />
			{/if}
		</UiWrapper>
	{/if}
</Suspense>
