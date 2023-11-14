import type { CurrentWritable } from '@threlte/core'

export type OtherPlayer = {
	userId: string
	username: string
	transform: CurrentWritable<{
		position: [number, number, number]
		rotation: [number, number, number, number]
	}>
}
