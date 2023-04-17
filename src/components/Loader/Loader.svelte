<script lang="ts">
	import { preloadMuscleCar } from '$components/Car/Models/MuscleCar.svelte'
	import { preloadMuscleCarWheel } from '$components/Car/Models/MuscleCarWheel.svelte'
	import { preloadEnv } from '$components/Common/Env.svelte'
	import { preloadBarrier } from '$components/TrackElements/Barrier.svelte'
	import { preloadBarrierEnd } from '$components/TrackElements/BarrierEnd.svelte'
	import { preloadBarrierTurnLeft } from '$components/TrackElements/BarrierTurnLeft.svelte'
	import { preloadBasicBox } from '$components/TrackElements/BasicBox.svelte'
	import { preloadBoost } from '$components/TrackElements/Boost.svelte'
	import { preloadCheckpoint } from '$components/TrackElements/Checkpoint.svelte'
	import { preloadDoubleBarrier } from '$components/TrackElements/DoubleBarrier.svelte'
	import { preloadHalfbox } from '$components/TrackElements/HalfBox.svelte'
	import { preloadRamp } from '$components/TrackElements/Ramp.svelte'
	import { preloadRampInverse } from '$components/TrackElements/RampInverse.svelte'
	import { preloadSlope } from '$components/TrackElements/Slope.svelte'
	import { preloadSounds } from '$components/Utilities/AudioProvider.svelte'
	import { useProgress } from '@threlte/extras'

	import LoadingUi from '$components/UI/LoadingUi.svelte'
	import { preloadTiltfulltightbend } from '../TrackElements/Tilts/TiltFullTightBend/Tiltfulltightbend.svelte'
	import { preloadTilttransitionleft } from '../TrackElements/Tilts/TiltTransitions/TiltTransitionLeft/Tilttransitionleft.svelte'
	import { preloadTilttransitionright } from '../TrackElements/Tilts/TiltTransitions/TiltTransitionRight/Tilttransitionright.svelte'
	import { preloadTiltfullmediumbend } from '../TrackElements/Tilts/TiltFullMediumBend/Tiltfullmediumbend.svelte'
	import { preloadTilttransitionleftlong } from '../TrackElements/Tilts/TiltTransitions/TiltTransitionLeftLong/Tilttransitionleftlong.svelte'
	import { preloadTilttransitionrightlong } from '../TrackElements/Tilts/TiltTransitions/TiltTransitionRightLong/Tilttransitionrightlong.svelte'
	import { preloadFinish } from '../TrackElements/Finish/Finish.svelte'

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
			preloadBarrier(),
			preloadSlope(),
			preloadEnv(),
			preloadBasicBox(),
			preloadSounds(),
			preloadTilttransitionleft(),
			preloadTilttransitionright(),
			preloadTiltfullmediumbend(),
			preloadTiltfulltightbend(),
			preloadTilttransitionleftlong(),
			preloadTilttransitionrightlong(),
			preloadFinish()
		])
	}

	const { progress } = useProgress()
</script>

{#await preload()}
	<LoadingUi progress={$progress} />
{:then}
	<slot />
{/await}
