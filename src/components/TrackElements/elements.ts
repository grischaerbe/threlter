// Elements
import BarrierEnd from './Barriers/BarrierEnd/BarrierEnd.svelte'
import BarrierTurnLeft from './Barriers/BarrierTurnLeft/BarrierTurnLeft.svelte'
import Box from './Boxes/Box/Box.svelte'
import Boost from './Boosts/Boost/Boost.svelte'
import Checkpoint from './Checkpoints/Checkpoint/Checkpoint.svelte'
import CheckpointRing from './Checkpoints/CheckpointRing/CheckpointRing.svelte'
import DoubleBarrier from './Barriers/DoubleBarrier/DoubleBarrier.svelte'
import Finish from './Finish/Finish.svelte'
import HalfBox from './Boxes/HalfBox/HalfBox.svelte'
import Ramp from './Ramps/Ramp/Ramp.svelte'
import RampInverse from './Ramps/RampInverse/RampInverse.svelte'
import HalfUnitBox from './Boxes/HalfUnitBox/HalfUnitBox.svelte'
import Slope from './Ramps/Slope/Slope.svelte'
import Tiltfullmediumbend from './Tilts/TiltFullMediumBend/Tiltfullmediumbend.svelte'
import Tiltfulltightbend from './Tilts/TiltFullTightBend/Tiltfulltightbend.svelte'
import Tilttransitionleft from './Tilts/TiltTransitions/TiltTransitionLeft/Tilttransitionleft.svelte'
import Tilttransitionleftlong from './Tilts/TiltTransitions/TiltTransitionLeftLong/Tilttransitionleftlong.svelte'
import Tilttransitionright from './Tilts/TiltTransitions/TiltTransitionRight/Tilttransitionright.svelte'
import Tilttransitionrightlong from './Tilts/TiltTransitions/TiltTransitionRightLong/Tilttransitionrightlong.svelte'
import TransitionFullMediumBend from './Tilts/TransitionFullMediumBend/TransitionFullMediumBend.svelte'
import Barrier from './Barriers/Barrier/Barrier.svelte'

export const elementCategories = {
	basics: {
		label: 'Basics'
	},
	ramps: {
		label: 'Ramps'
	},
	barriers: {
		label: 'Barriers'
	},
	boosts: {
		label: 'Boosts'
	},
	checkpoints: {
		label: 'Checkpoints'
	},
	tilts: {
		label: 'Tilts'
	}
}

export type TrackElementCategory = keyof typeof elementCategories

export const trackElementPrototypes = {
	Box: {
		buttonLabel: 'Full Box',
		component: Box,
		category: 'basics'
	},

	HalfBox: {
		buttonLabel: 'Half Box',
		component: HalfBox,
		category: 'basics'
	},

	HalfUnitBox: {
		buttonLabel: 'Half Unit Box',
		component: HalfUnitBox,
		category: 'basics'
	},

	Ramp: {
		buttonLabel: 'Ramp',
		component: Ramp,
		category: 'ramps'
	},

	RampInverse: {
		buttonLabel: 'Inverse Ramp',
		component: RampInverse,
		category: 'ramps'
	},

	Checkpoint: {
		buttonLabel: 'Checkpoint',
		component: Checkpoint,
		category: 'checkpoints'
	},

	CheckpointRing: {
		buttonLabel: 'Ring Checkpoint',
		component: CheckpointRing,
		category: 'checkpoints'
	},

	Boost: {
		buttonLabel: 'Boost',
		component: Boost,
		category: 'boosts'
	},

	Barrier: {
		buttonLabel: 'Barrier',
		component: Barrier,
		category: 'barriers'
	},

	DoubleBarrier: {
		buttonLabel: 'Double Barrier',
		component: DoubleBarrier,
		category: 'barriers'
	},

	BarrierEnd: {
		buttonLabel: 'Barrier End',
		component: BarrierEnd,
		category: 'barriers'
	},

	BarrierTurnLeft: {
		buttonLabel: 'Barrier Turn Left',
		component: BarrierTurnLeft,
		category: 'barriers'
	},

	Slope: {
		buttonLabel: 'Slope',
		component: Slope,
		category: 'basics'
	},

	Finish: {
		buttonLabel: 'Finish',
		component: Finish,
		category: 'basics'
	},

	TiltTransitionLeft: {
		buttonLabel: 'Tilt Transition Left',
		component: Tilttransitionleft,
		category: 'tilts'
	},

	TiltTransitionLeftLong: {
		buttonLabel: 'Tilt Transition Left Long',
		component: Tilttransitionleftlong,
		category: 'tilts'
	},

	TiltTransitionRight: {
		buttonLabel: 'Tilt Transition Right',
		component: Tilttransitionright,
		category: 'tilts'
	},

	TiltTransitionRightLong: {
		buttonLabel: 'Tilt Transition Right Long',
		component: Tilttransitionrightlong,
		category: 'tilts'
	},

	TiltFullTightBend: {
		buttonLabel: 'Tilt Full Tight Bend',
		component: Tiltfulltightbend,
		category: 'tilts'
	},

	TiltFullMediumBend: {
		buttonLabel: 'Tilt Full Medium Bend',
		component: Tiltfullmediumbend,
		category: 'tilts'
	},

	TransitionFullMediumBend: {
		buttonLabel: 'Transition Full Medium Bend',
		component: TransitionFullMediumBend,
		category: 'tilts'
	}
} satisfies Record<
	string,
	{
		buttonLabel: string
		component: any
		category: keyof typeof elementCategories
	}
>

export type TrackElementPrototypeType = keyof typeof trackElementPrototypes
