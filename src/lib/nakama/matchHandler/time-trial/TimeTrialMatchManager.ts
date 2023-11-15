import type { Socket } from '@heroiclabs/nakama-js'
import { currentWritable, type CurrentWritable } from '@threlte/core'
import { MatchManagerPrototype } from '../../MatchManagerPrototype'
import {
	ClientOpCode,
	MatchState,
	ServerOpCode,
	type ClientMessage,
	type ServerMessage
} from './types'

export class TimeTrialMatchManager extends MatchManagerPrototype<
	typeof ClientOpCode,
	typeof ServerOpCode,
	ClientMessage,
	ServerMessage,
	{
		matchState: CurrentWritable<MatchState>
		tickRate: CurrentWritable<number>
		trackId: CurrentWritable<string | undefined>
		round: CurrentWritable<number>
		matchStartTime: CurrentWritable<number>
		matchEndTime: CurrentWritable<number>
		restartMatchTime: CurrentWritable<number>
	}
> {
	constructor(matchId: string, socket: Socket) {
		super(matchId, socket, ClientOpCode, ServerOpCode, {
			matchState: currentWritable(MatchState.WarmUp),
			matchEndTime: currentWritable(0),
			matchStartTime: currentWritable(0),
			restartMatchTime: currentWritable(0),
			round: currentWritable(0),
			tickRate: currentWritable(0),
			trackId: currentWritable(undefined)
		})
	}

	processMessage<OpCode extends keyof ServerMessage>(
		message: OpCode extends keyof ServerMessage
			? { opcode: OpCode; data: ServerMessage[OpCode] }
			: never
	): void {
		switch (message.opcode) {
			case this.ServerOpCode.GameUpdate:
				this.state.matchState.set(message.data.matchState)
				this.state.trackId.set(message.data.trackId)
				this.state.tickRate.set(message.data.tickRate)
				this.state.matchEndTime.set(message.data.matchEndTime)
				this.state.matchStartTime.set(message.data.matchStartTime)
				this.state.restartMatchTime.set(message.data.restartMatchTime)
				break
			case this.ServerOpCode.MatchStarted:
				this.state.matchState.set(MatchState.InProgress)
				break
			case this.ServerOpCode.MatchFinished:
				this.state.matchState.set(MatchState.CoolDown)
				break
			case this.ServerOpCode.TransformUpdates:
				for (const [userId, { position, rotation }] of Object.entries(message.data.transforms)) {
					const player = this.players.current.find((player) => player.presence.user_id === userId)
					if (!player) continue
					player.position.set(position)
					player.quaternion.set(rotation)
				}
				break
			case this.ServerOpCode.MatchRestart:
				this.state.round.update((round) => round + 1)
				this.state.matchStartTime.set(message.data.matchStartTime)
				this.state.restartMatchTime.set(message.data.restartMatchTime)
				this.state.matchEndTime.set(message.data.matchEndTime)
				// clear all records
				this.matchResults.clearRecords()
				// reset all player positions and rotations
				this.players.update((players) => {
					for (const player of players) {
						player.position.set([0, 0, 0])
						player.quaternion.set([0, 0, 0, 1])
					}
					return players
				})
				this.state.matchState.set(MatchState.WarmUp)
				this.state.trackId.set(message.data.trackId)
				break
			case this.ServerOpCode.UpdateLeaderboard:
				// update the leaderboard
				this.matchResults.update()
				break
			default:
				console.warn('Unhandled message', message)
		}
	}
}
