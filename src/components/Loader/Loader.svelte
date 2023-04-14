<script lang="ts">
	import { useProgress } from '@threlte/extras'
	import { preloadEnv } from '$components/Common/Env.svelte'
	import { preloadBarrier } from '$components/TrackElements/Barrier.svelte'
	import { preloadMuscleCar } from '$components/Car/Models/MuscleCar.svelte'
	import { preloadMuscleCarWheel } from '$components/Car/Models/MuscleCarWheel.svelte'
	import { preloadCheckpoint } from '$components/TrackElements/Checkpoint.svelte'
	import { preloadHalfbox } from '$components/TrackElements/HalfBox.svelte'
	import { preloadRamp } from '$components/TrackElements/Ramp.svelte'
	import { preloadRampInverse } from '$components/TrackElements/RampInverse.svelte'
	import { preloadDoubleBarrier } from '$components/TrackElements/DoubleBarrier.svelte'
	import { preloadBarrierEnd } from '$components/TrackElements/BarrierEnd.svelte'
	import { preloadBoost } from '$components/TrackElements/Boost.svelte'
	import { preloadBarrierTurnLeft } from '$components/TrackElements/BarrierTurnLeft.svelte'
	import { preloadBarrierTurnRight } from '$components/TrackElements/BarrierTurnRight.svelte'
	import { preloadSlope } from '$components/TrackElements/Slope.svelte'
	import { preloadBasicBox } from '$components/TrackElements/BasicBox.svelte'
	import { preloadSounds } from '$components/Utilities/AudioProvider.svelte'

	import LoadingUi from '$components/UI/LoadingUi.svelte'

	const preload = () => {
		return Promise.all([
			preloadMuscleCar(),
			preloadMuscleCarWheel(),
			preloadCheckpoint(),
			preloadHalfbox(),
			preloadRamp(),
			preloadRampInverse(),
			preloadDoubleBarrier(),
			preloadBarrierEnd(),
			preloadBoost(),
			preloadBarrierTurnLeft(),
			preloadBarrierTurnRight(),
			preloadBarrier(),
			preloadSlope(),
			preloadEnv(),
			preloadBasicBox(),
			preloadSounds()
		])
	}

	const { progress } = useProgress()
</script>

{#await preload()}
	<LoadingUi progress={$progress} />
{:then}
	<slot />
{/await}
