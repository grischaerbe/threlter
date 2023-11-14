import type { Presence } from '@heroiclabs/nakama-js'
import { currentWritable, type CurrentWritable } from '@threlte/core'

/**
 * This class represents a player in a multiplayer game.
 */
export class Player {
	public presence: Presence
	public position: CurrentWritable<[number, number, number]> = currentWritable([0, 0, 0])
	public quaternion: CurrentWritable<[number, number, number, number]> = currentWritable([
		0, 0, 0, 1
	])

	constructor(presence: Presence) {
		this.presence = presence
	}
}
