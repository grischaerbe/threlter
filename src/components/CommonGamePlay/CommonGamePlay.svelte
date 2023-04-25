<script lang="ts">
	import { useKeyDown } from '$hooks/useKeyDown'
	import type { TrackData } from '$lib/TrackData/TrackData'
	import { Ghost } from '$lib/TrackRecord/Ghost'
	import { TrackRecord } from '$lib/TrackRecord/TrackRecord'
	import { appState } from '$stores/app'
	import { T, currentWritable, useFrame, watch } from '@threlte/core'
	import { Suspense } from '@threlte/extras'
	import { derived } from 'svelte/store'
	import { DEG2RAD } from 'three/src/math/MathUtils'
	import { useEvent } from '../../hooks/useEvents'
	import Car from '../Car/Car.svelte'
	import TrackElement from '../TrackViewer/TrackElement.svelte'
	import TrackElementTransform from '../TrackViewer/TrackElementTransform.svelte'
	import TrackViewer from '../TrackViewer/TrackViewer.svelte'
	import LoadingUi from '../UI/LoadingUi.svelte'
	import UiWrapper from '../UI/UiWrapper.svelte'
	import BoundingSphere from './BoundingSphere.svelte'
	import CameraControls from '../CameraControls/CameraControls.svelte'
	import GhostPlayer from './GhostPlayer.svelte'
	import GhostRecorder from './GhostRecorder.svelte'
	import CountIn from './UI/CountIn.svelte'
	import GamePlay from './UI/GamePlay.svelte'
	import { spring } from 'svelte/motion'

	export let trackData: TrackData

	let currentTrackRecord = TrackRecord.fromLocalStorage(trackData)
	let workingTrackRecord = TrackRecord.fromTrackData(trackData, new Ghost())

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

	useKeyDown('Escape', () => {
		if ($state === 'playing') {
			paused.set(true)
		}
	})
	useKeyDown('p', () => {
		if ($state === 'playing') {
			paused.set(true)
		}
	})

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
			workingTrackRecord = TrackRecord.fromTrackData(trackData, new Ghost())
		}
	})

	const softReset = () => {
		respawnCar()
		resetTrackViewer()
		state.set('count-in')
		time.set(0)
	}

	useKeyDown('Enter', () => {
		if ($state === 'playing' && !$paused) {
			softReset()
		}
	})

	const onFinishReached = () => {
		state.set('finished')
		workingTrackRecord.time.set($time)
		if (
			!currentTrackRecord ||
			TrackRecord.isNewTrackRecord(currentTrackRecord, workingTrackRecord)
		) {
			workingTrackRecord.saveToLocalStorage()
			currentTrackRecord = workingTrackRecord
		}
	}
</script>

<Suspense final let:suspended>
	<LoadingUi slot="fallback" />

	<!-- 3D -->
	{#if trackData}
		<BoundingSphere let:center let:radius let:sphere>
			<TrackViewer let:trackElement {trackData} on:trackcompleted={onFinishReached}>
				<TrackElementTransform {trackElement}>
					<TrackElement {trackElement} />
				</TrackElementTransform>
			</TrackViewer>

			{#if radius > 0 && $state === 'intro'}
				<T.PerspectiveCamera makeDefault position.x={radius}>
					<CameraControls
						autoRotate
						autoRotateSpeed={0.5}
						truckSpeed={0}
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
		let:carState
		useCarCamera={$state !== 'intro'}
	>
		{#if workingTrackRecord.ghost && $state === 'playing'}
			<GhostRecorder ghost={workingTrackRecord.ghost} time={$time} {carState} />
		{/if}

		{#if currentTrackRecord?.ghost && $state === 'playing'}
			<GhostPlayer {carState} ghost={currentTrackRecord.ghost} time={$time} />
		{/if}
	</Car>

	{#if !suspended}
		<!-- UI -->
		<UiWrapper>
			{#if $paused}
				<slot name="ui-paused" {proceed} {restart} trackRecord={currentTrackRecord} />
			{:else if $state === 'intro'}
				<slot name="ui-intro" {proceed} trackRecord={currentTrackRecord} />
			{:else if $state === 'count-in'}
				<slot name="ui-count-in" {proceed} trackRecord={currentTrackRecord}>
					<CountIn on:countindone={proceed} time={$time} />
				</slot>
			{:else if $state === 'playing'}
				<slot name="ui-playing" time={$time} trackRecord={currentTrackRecord}>
					<GamePlay time={$time} />
				</slot>
			{:else if $state === 'finished'}
				<slot name="ui-finished" {restart} time={$time} trackRecord={currentTrackRecord} />
			{/if}
		</UiWrapper>
	{/if}
</Suspense>

<slot {proceed} {restart} time={$time} trackRecord={currentTrackRecord} />
