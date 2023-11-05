import type { TrackRecord } from '../TrackRecord/TrackRecord'
import { Nakama } from '../nakama/Nakama'

export class LeaderboardEntry {
	public trackId: string
	public userId: string
	public username: string
	public time: number
	public rank: number
	public trackRecord: TrackRecord

	constructor(
		trackId: string,
		userId: string,
		username: string,
		time: number,
		rank: number,
		trackRecord: TrackRecord
	) {
		this.trackId = trackId
		this.userId = userId
		this.username = username
		this.time = time
		this.rank = rank
		this.trackRecord = trackRecord
	}
}
