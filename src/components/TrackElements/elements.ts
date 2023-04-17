// Elements
import BarrierEnd from './BarrierEnd.svelte'
import BarrierTurnLeft from './BarrierTurnLeft.svelte'
import BasicBox from './BasicBox.svelte'
import Boost from './Boost.svelte'
import Checkpoint from './Checkpoint.svelte'
import CheckpointRing from './CheckpointRing.svelte'
import DoubleBarrier from './DoubleBarrier.svelte'
import Finish from './Finish/Finish.svelte'
import HalfBox from './HalfBox.svelte'
import Ramp from './Ramp.svelte'
import RampInverse from './RampInverse.svelte'
import Slope from './Slope.svelte'
import Tiltfullmediumbend from './Tilts/TiltFullMediumBend/Tiltfullmediumbend.svelte'
import Tiltfulltightbend from './Tilts/TiltFullTightBend/Tiltfulltightbend.svelte'
import Tilttransitionleft from './Tilts/TiltTransitions/TiltTransitionLeft/Tilttransitionleft.svelte'
import Tilttransitionleftlong from './Tilts/TiltTransitions/TiltTransitionLeftLong/Tilttransitionleftlong.svelte'
import Tilttransitionright from './Tilts/TiltTransitions/TiltTransitionRight/Tilttransitionright.svelte'
import Tilttransitionrightlong from './Tilts/TiltTransitions/TiltTransitionRightLong/Tilttransitionrightlong.svelte'
// import Barrier from './Barrier.svelte'

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
		buttonLabel: 'Box',
		component: BasicBox,
		category: 'basics'
	},

	HalfBox: {
		buttonLabel: 'Half Box',
		component: HalfBox,
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

	// WHY WON'T THIS WORK???
	// Barrier: {
	// 	buttonLabel: 'Barrier',
	// 	component: Barrier,
	// 	category: 'barriers'
	// },

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
