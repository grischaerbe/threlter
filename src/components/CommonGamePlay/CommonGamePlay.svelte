<script lang="ts">
	import { useFrame } from '@threlte/core'
	import { derived } from 'svelte/store'
	import Car from '../Car/Car.svelte'
	import TrackElement from '../TrackViewer/TrackElement.svelte'
	import TrackElementTransform from '../TrackViewer/TrackElementTransform.svelte'
	import TrackViewer from '../TrackViewer/TrackViewer.svelte'
	import UiWrapper from '../UI/UiWrapper.svelte'
	import { actions, appState, gameState } from '$stores/app'
	import { useGameIsPausable } from '$hooks/useGameIsPausable'
	import { useKeyDown } from '$hooks/useKeyDown'
	import TrackRecord from './TrackRecord.svelte'
	import CountIn from './UI/CountIn.svelte'
	import Ghost from './Ghost.svelte'
	import type { TrackData } from '$lib/TrackData/TrackData'

	export let trackData: TrackData

	const { visibility } = appState
	const { common, paused } = gameState

	const { state, finishReached, showGhost } = common

	const carActive = derived([state, visibility, paused], ([state, visibility, paused]) => {
		if (visibility === 'hidden') return false
		if (paused) return false
		if (state === 'playing' || state === 'finished') return true
		return false
	})

	const carVolume = derived([paused], ([paused]) => {
		return paused ? 0 : 1
	})

	useKeyDown('Enter', () => {
		if ($state === 'playing') {
			actions.goToCountIn()
		}
	})

	useKeyDown('g', () => {
		const show = !$showGhost
		actions.setShowGhost(show)
	})

	useGameIsPausable()

	useFrame((_, delta) => {
		if ($paused || $state !== 'playing' || $finishReached) return
		actions.incrementGameTime(delta * 1000)
	})
</script>

<!-- UI -->
<UiWrapper>
	{#if $paused}
		<slot name="ui-paused" />
	{:else if $state === 'intro'}
		<slot name="ui-intro" />
	{:else if $state === 'count-in'}
		<slot name="ui-count-in">
			<CountIn
				on:countindone={() => {
					actions.startPlaying()
				}}
			/>
		</slot>
	{:else if $state === 'playing'}
		<slot name="ui-playing" />
	{:else if $state === 'finished'}
		<slot name="ui-finished" />
	{/if}
</UiWrapper>

<!-- TRACK -->
{#if trackData}
	<TrackViewer let:trackElement {trackData}>
		<TrackElementTransform {trackElement}>
			<TrackElement {trackElement} />
		</TrackElementTransform>
	</TrackViewer>
{/if}

<!-- GAME RECORDER -->
<TrackRecord />

<!-- GHOST -->
{#if $showGhost}
	<Ghost />
{/if}

<!-- CAR -->
<Car active={$carActive} volume={$carVolume} />
