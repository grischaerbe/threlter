import type { LeaderboardRecord } from '@heroiclabs/nakama-js'
import { currentWritable, type CurrentWritable } from '@threlte/core'
import { derived, type Readable } from 'svelte/store'
import type { MatchManager } from '../nakama/MatchManager'
import { Nakama } from '../nakama/Nakama'
import type { Player } from '../nakama/Player'
import { SessionManager } from '../nakama/SessionManager'
import type { MatchManagerPrototype } from '../nakama/MatchManagerPrototype'

export class MatchResults {
	public matchManager: MatchManagerPrototype<any, any, any, any, any>
	private records: CurrentWritable<LeaderboardRecord[]> = currentWritable([])

	public results: Readable<
		{
			player: Player
			record?: LeaderboardRecord
		}[]
	>

	constructor(matchManager: MatchManagerPrototype<any, any, any, any, any>) {
		this.matchManager = matchManager
		this.results = derived([this.records, this.matchManager.players], ([records, players]) => {
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

	public async update() {
		const results = await Nakama.client.listLeaderboardRecords(
			SessionManager.getSession(),
			this.matchManager.leaderboardId,
			this.matchManager.players.current.map((player) => player.presence.user_id),
			100
		)

		this.records.set(results.records ?? [])
	}

	public clearRecords() {
		this.records.set([])
	}
}
