import type { LeaderboardRecord, Presence } from '@heroiclabs/nakama-js'
import { currentWritable, type CurrentWritable } from '@threlte/core'
import { derived, type Readable } from 'svelte/store'
import { AbstractMatchManager } from '../../MatchManagerPrototype'
import { Nakama } from '../../Nakama'
import { Player } from '../../Player'
import { SessionManager } from '../../SessionManager'
import { SocketManager } from '../../SocketManager'
import {
	ClientOpCode,
	MatchState,
	ServerOpCode,
	type ClientMessage,
	type ServerMessage
} from './types'

export class TimeTrialMatchManager extends AbstractMatchManager<
	typeof ClientOpCode,
	typeof ServerOpCode,
	ClientMessage,
	ServerMessage
> {
	leaderboardId: string
	matchState: CurrentWritable<MatchState>
	matchEndTime: CurrentWritable<number>
	matchStartTime: CurrentWritable<number>
	restartMatchTime: CurrentWritable<number>
	round: CurrentWritable<number>
	tickRate: CurrentWritable<number>
	trackId: CurrentWritable<string | undefined>
	players: CurrentWritable<Player[]>
	results: Readable<
		{
			player: Player
			record?: LeaderboardRecord
		}[]
	>

	private records: CurrentWritable<LeaderboardRecord[]> = currentWritable([])

	constructor(matchId: string) {
		super(matchId, SocketManager.socket, ClientOpCode, ServerOpCode)

		this.leaderboardId = AbstractMatchManager.getMatchLeaderboardId(matchId)
		this.matchState = currentWritable(MatchState.WarmUp)
		this.matchEndTime = currentWritable(0)
		this.matchStartTime = currentWritable(0)
		this.restartMatchTime = currentWritable(0)
		this.round = currentWritable(0)
		this.tickRate = currentWritable(0)
		this.trackId = currentWritable(undefined)
		this.players = currentWritable([])
		this.results = derived([this.records, this.players], ([records, players]) => {
			return players
				.map((player) => {
					return {
						player,
						record: records.find((record) => {
							return record.owner_id === player.presence.user_id
						})
					}
				})
				.sort((a, b) => {
					if (a.record?.rank === undefined && b.record?.rank === undefined) return 0
					if (a.record?.rank === undefined) return 1
					if (b.record?.rank === undefined) return -1
					return a.record.rank - b.record.rank
				})
		})
	}

	processMessage<OpCode extends keyof ServerMessage>(
		message: OpCode extends keyof ServerMessage
			? { opcode: OpCode; data: ServerMessage[OpCode] }
			: never
	): void {
		switch (message.opcode) {
			case this.ServerOpCode.GameUpdate:
				this.matchState.set(message.data.matchState)
				this.trackId.set(message.data.trackId)
				this.tickRate.set(message.data.tickRate)
				this.matchEndTime.set(message.data.matchEndTime)
				this.matchStartTime.set(message.data.matchStartTime)
				this.restartMatchTime.set(message.data.restartMatchTime)
				break
			case this.ServerOpCode.MatchStarted:
				this.matchState.set(MatchState.InProgress)
				break
			case this.ServerOpCode.MatchFinished:
				this.matchState.set(MatchState.CoolDown)
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
				this.round.update((round) => round + 1)
				this.matchStartTime.set(message.data.matchStartTime)
				this.restartMatchTime.set(message.data.restartMatchTime)
				this.matchEndTime.set(message.data.matchEndTime)
				// clear all records
				this.clearMatchResults()
				// reset all player positions and rotations
				this.players.update((players) => {
					for (const player of players) {
						player.position.set([0, 0, 0])
						player.quaternion.set([0, 0, 0, 1])
					}
					return players
				})
				this.matchState.set(MatchState.WarmUp)
				this.trackId.set(message.data.trackId)
				break
			case this.ServerOpCode.UpdateLeaderboard:
				// update the leaderboard
				this.updateMatchResults()
				break
			default:
				console.warn('Unhandled message', message)
		}
	}

	processJoins(joins: Presence[]): void {
		this.players.update((players) => {
			return [...players, ...joins.map((presence) => new Player(presence))]
		})
	}

	processLeaves(leaves: Presence[]): void {
		this.players.update((players) => {
			return players.filter((player) => {
				return !leaves.find((presence) => presence.user_id === player.presence.user_id)
			})
		})
	}

	private clearMatchResults() {
		this.records.set([])
	}

	private async updateMatchResults() {
		const results = await Nakama.client.listLeaderboardRecords(
			SessionManager.getSession(),
			this.leaderboardId,
			this.players.current.map((player) => player.presence.user_id),
			100
		)

		this.records.set(results.records ?? [])
	}

	protected onLeave(): void {}

	protected onJoin(): void {}
}
