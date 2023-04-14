// Elements
import BarrierEnd from './BarrierEnd.svelte'
import BarrierTurnLeft from './BarrierTurnLeft.svelte'
import BarrierTurnRight from './BarrierTurnRight.svelte'
import BasicBox from './BasicBox.svelte'
import Boost from './Boost.svelte'
import Checkpoint from './Checkpoint.svelte'
import CheckpointRing from './CheckpointRing.svelte'
import DoubleBarrier from './DoubleBarrier.svelte'
import Finish from './Finish.svelte'
import HalfBox from './HalfBox.svelte'
import Ramp from './Ramp.svelte'
import RampInverse from './RampInverse.svelte'
import Slope from './Slope.svelte'

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

  // Barrier: {
  //   buttonLabel: 'Barrier',
  //   component: Barrier
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

  BarrierTurnRight: {
    buttonLabel: 'Barrier Turn Right',
    component: BarrierTurnRight,
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
