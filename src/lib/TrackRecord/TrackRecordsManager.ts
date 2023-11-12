import { Dispatcher } from '../Track/Dispatcher'
import { TrackManager } from '../TrackManager/TrackManager'
import { SessionManager } from '../nakama/SessionManager'
import { TrackRecord } from './TrackRecord'

type Events = {
	change: any
	newPersonalRecord: TrackRecord
	newRankedRecord: TrackRecord
}

export class TrackRecordsManager extends Dispatcher<Events> {
	userId: string
	trackId: string
	rankedRecord?: TrackRecord
	previousPersonalRecord?: TrackRecord
	personalRecord?: TrackRecord
	#ghosts = { own: false, ranked: false }
	ghostRecords: TrackRecord[] = []
	current: TrackRecord

	static async fromTrackId(trackId: string) {
		const [rankedTrackRecord, ownTrackRecord] = await Promise.all([
			TrackManager.getTrackRecord(trackId, 1),
			TrackManager.getOwnTrackRecord(trackId)
		])
		return new TrackRecordsManager(
			SessionManager.getUserId(),
			trackId,
			rankedTrackRecord,
			ownTrackRecord
		)
	}

	setGhostRecords(own: boolean, ranked: boolean) {
		this.#ghosts = { own, ranked }
		this.updateGhostRecords()
	}

	updateGhostRecords() {
		let newGhostRecords: TrackRecord[] = []
		if (this.#ghosts.own && this.personalRecord) {
			newGhostRecords.push(this.personalRecord)
		}
		if (this.#ghosts.ranked && this.rankedRecord) {
			newGhostRecords.push(this.rankedRecord)
		}
		newGhostRecords.sort((a, b) => {
			return a.time - b.time
		})
		newGhostRecords = newGhostRecords.filter((record, index) => {
			// filter duplicates by recordId and userId
			return (
				newGhostRecords.findIndex((ghostRecord) => {
					return ghostRecord.recordId === record.recordId || ghostRecord.userId === record.userId
				}) === index
			)
		})
		this.ghostRecords = newGhostRecords
	}

	constructor(userId: string, trackId: string, ranked?: TrackRecord, own?: TrackRecord) {
		super()
		this.userId = userId
		this.trackId = trackId
		this.rankedRecord = ranked
		this.personalRecord = own
		this.current = new TrackRecord(userId, trackId)
	}

	reset() {
		this.updateGhostRecords()
		this.current = new TrackRecord(this.userId, this.trackId)
	}

	async publish() {
		try {
			await TrackManager.addTrackRecord(this.current)
		} catch (error) {
			console.warn(error)
		}
	}

	setCurrentFinalTime(time: number) {
		this.current.time = time
		Object.freeze(this.current)
		if (this.isNewPersonalRecord()) {
			this.previousPersonalRecord = this.personalRecord
			this.personalRecord = this.current
		}
	}

	isNewRankedRecord() {
		if (!this.rankedRecord) return true
		return TrackRecord.isNewTrackRecord(this.rankedRecord, this.current)
	}

	isNewPersonalRecord() {
		if (!this.personalRecord) return true
		return TrackRecord.isNewTrackRecord(this.personalRecord, this.current)
	}
}
