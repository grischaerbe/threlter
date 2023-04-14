import type { Vector } from '@dimforge/rapier3d-compat'

export const length = (v: Vector): number => {
  return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z)
}

export const normalize = (v: Vector): Vector => {
  const l = length(v)
  return {
    x: v.x / l,
    y: v.y / l,
    z: v.z / l
  }
}

export const fromAToB = (a: Vector, b: Vector): Vector => {
  return {
    x: b.x - a.x,
    y: b.y - a.y,
    z: b.z - a.z
  }
}

export const add = (a: Vector, b: Vector): Vector => {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
    z: a.z + b.z
  }
}
