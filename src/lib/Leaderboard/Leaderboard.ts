import { TrackRecord } from '../TrackRecord/TrackRecord'
import { Nakama } from '../nakama/Nakama'
import { SessionManager } from '../nakama/SessionManager'
import { filterUndefined } from '../utils/filterUndefined'
import { LeaderboardEntry } from './LeaderboardEntry'

export class Leaderboard {
	public leaderboardId: string
	public leaderboardEntries: LeaderboardEntry[] = []
	public ownLeaderboardEntry?: LeaderboardEntry
	public page = 1
	public entriesPerPage = 10
	public loading = false
	private nextCursor?: string
	public get hasNextPage() {
		return !!this.nextCursor
	}
	private previousCursor?: string
	public get hasPreviousPage() {
		return !!this.previousCursor
	}

	private constructor(trackId: string) {
		this.leaderboardId = trackId
	}

	public static async fromTrackId(trackId: string) {
		const leaderboard = new Leaderboard(trackId)
		await Promise.all([leaderboard.fetchOwnEntry(), leaderboard.fetchEntries()])
		return leaderboard
	}

	public static async fromMatchId(matchId: string) {
		const leaderboard = new Leaderboard(`match:${matchId}`)
		await Promise.all([leaderboard.fetchOwnEntry(), leaderboard.fetchEntries()])
		return leaderboard
	}

	public static async fromLeaderboardId(leaderboardId: string) {
		const leaderboard = new Leaderboard(leaderboardId)
		await Promise.all([leaderboard.fetchOwnEntry(), leaderboard.fetchEntries()])
		return leaderboard
	}

	private async fetchOwnEntry() {
		const response = await Nakama.client.listLeaderboardRecordsAroundOwner(
			await SessionManager.getSession(),
			this.leaderboardId,
			SessionManager.getUserId(),
			1
		)

		const record = response.records?.[0]

		if (
			record === undefined ||
			record.metadata === undefined ||
			record.owner_id === undefined ||
			record.username === undefined ||
			record.score === undefined ||
			record.rank === undefined
		) {
			return
		}

		this.ownLeaderboardEntry = new LeaderboardEntry(
			this.leaderboardId,
			record.owner_id,
			record.username,
			record.score,
			record.rank,
			TrackRecord.fromData(record.metadata)
		)
	}

	private async fetchEntries(cursor: string | undefined = undefined) {
		this.loading = true

		const response = await Nakama.client.listLeaderboardRecords(
			await SessionManager.getSession(),
			this.leaderboardId,
			undefined,
			this.entriesPerPage,
			cursor
		)

		this.nextCursor = response.next_cursor
		this.previousCursor = response.prev_cursor

		this.leaderboardEntries =
			response.records
				?.map((record) => {
					if (
						record === undefined ||
						record.metadata === undefined ||
						record.owner_id === undefined ||
						record.username === undefined ||
						record.score === undefined ||
						record.rank === undefined
					)
						return undefined
					return new LeaderboardEntry(
						this.leaderboardId,
						record.owner_id,
						record.username,
						record.score,
						record.rank,
						TrackRecord.fromData(record.metadata)
					)
				})
				.filter(filterUndefined) ?? []

		this.loading = false
	}

	public async refresh() {
		await Promise.all([this.fetchOwnEntry(), this.fetchEntries()])
	}

	public async nextPage() {
		if (!this.hasNextPage || this.loading) return
		this.page++
		await this.fetchEntries(this.nextCursor)
	}

	public async previousPage() {
		if (!this.hasPreviousPage || this.loading) return
		this.page--
		await this.fetchEntries(this.previousCursor)
	}
}
