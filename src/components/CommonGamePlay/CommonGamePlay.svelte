<script lang="ts">
	import { useKeyDown } from '$hooks/useKeyDown'
	import type { TrackData } from '$lib/TrackData/TrackData'
	import { appState } from '$stores/app'
	import { currentWritable, useFrame, watch } from '@threlte/core'
	import { derived } from 'svelte/store'
	import Car from '../Car/Car.svelte'
	import TrackElement from '../TrackViewer/TrackElement.svelte'
	import TrackElementTransform from '../TrackViewer/TrackElementTransform.svelte'
	import TrackViewer from '../TrackViewer/TrackViewer.svelte'
	import UiWrapper from '../UI/UiWrapper.svelte'
	import GhostPlayer from './GhostPlayer.svelte'
	import { Ghost } from '$lib/TrackRecord/Ghost'
	import { TrackRecord } from '$lib/TrackRecord/TrackRecord'
	import { useEvent } from '../../hooks/useEvents'
	import GhostRecorder from './GhostRecorder.svelte'
	import CountIn from './UI/CountIn.svelte'
	import GamePlay from './UI/GamePlay.svelte'

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

	const carVolume = derived([paused], ([paused]) => {
		return paused ? 0 : 1
	})

	useFrame((_, delta) => {
		if ($paused || $state !== 'playing') return
		time.update((t) => t + delta * 1000)
	})

	useKeyDown('Escape', () => {
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

<!-- UI -->
<UiWrapper>
	{#if $paused}
		<slot name="ui-paused" {proceed} {restart} trackRecord={currentTrackRecord} />
	{:else if $state === 'intro'}
		<slot name="ui-intro" {proceed} trackRecord={currentTrackRecord} />
	{:else if $state === 'count-in'}
		<slot name="ui-count-in" {proceed} trackRecord={currentTrackRecord}>
			<CountIn on:countindone={proceed} />
		</slot>
	{:else if $state === 'playing'}
		<slot name="ui-playing" time={$time} trackRecord={currentTrackRecord}>
			<GamePlay time={$time} />
		</slot>
	{:else if $state === 'finished'}
		<slot name="ui-finished" {restart} time={$time} trackRecord={currentTrackRecord} />
	{/if}
</UiWrapper>

<!-- 3D -->
{#if trackData}
	<TrackViewer let:trackElement {trackData} on:trackcompleted={onFinishReached}>
		<TrackElementTransform {trackElement}>
			<TrackElement {trackElement} />
		</TrackElementTransform>
	</TrackViewer>
{/if}

<Car
	active={$carActive}
	volume={$carVolume}
	freeze={$carFrozen}
	freezeCamera={$state === 'finished'}
	let:carState
>
	{#if workingTrackRecord.ghost && $state === 'playing'}
		<GhostRecorder ghost={workingTrackRecord.ghost} time={$time} {carState} />
	{/if}
</Car>

{#if currentTrackRecord?.ghost && $state === 'playing'}
	<GhostPlayer ghost={currentTrackRecord.ghost} time={$time} />
{/if}

<slot {proceed} {restart} time={$time} trackRecord={currentTrackRecord} />
