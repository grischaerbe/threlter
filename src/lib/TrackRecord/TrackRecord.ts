import { z, type TypeOf } from 'zod'
import { Ghost, GhostSchema } from './Ghost'
import { v4 } from 'uuid'

export const TrackRecordSchema = z.object({
	recordId: z.string(),
	trackId: z.string(),
	userId: z.string(),
	ghost: GhostSchema,
	time: z.number(),
	respawns: z.number()
})

/**
 * A track record is a record of a track with a specific validation id.
 * It contains the time and respawns of the player.
 * It also contains a ghost of the player's run.
 * It is saved to local storage except for the ghost.
 */
export class TrackRecord {
	recordId: string = v4()
	public trackId: string
	public userId: string

	public ghost: Ghost
	public time = Number.MAX_SAFE_INTEGER
	public respawns = Number.MAX_SAFE_INTEGER

	constructor(userId: string, trackId: string) {
		this.userId = userId
		this.trackId = trackId
		this.ghost = new Ghost()
	}

	public static fromData(data: any) {
		const parsed = TrackRecordSchema.parse(data)
		const trackRecord = new TrackRecord(parsed.userId, parsed.trackId)
		trackRecord.recordId = parsed.recordId
		trackRecord.trackId = parsed.trackId
		trackRecord.ghost.setFromData(parsed.ghost)
		trackRecord.time = parsed.time
		trackRecord.respawns = parsed.respawns
		return trackRecord
	}

	public setFromData(data: any) {
		const parsed = TrackRecordSchema.parse(data)
		this.trackId = parsed.trackId
		this.ghost.setFromData(parsed.ghost)
		this.time = parsed.time
		this.respawns = parsed.respawns
		return this
	}

	public toJSON(): TypeOf<typeof TrackRecordSchema> {
		return {
			recordId: this.recordId,
			trackId: this.trackId,
			userId: this.userId,
			ghost: this.ghost.toJSON(),
			time: this.time,
			respawns: this.respawns
		}
	}

	/**
	 * Check if a TrackRecord is a new record in comparison to another TrackRecord.
	 */
	public static isNewTrackRecord(currentTrackRecord: TrackRecord, newTrackRecord: TrackRecord) {
		const isSameTrack = currentTrackRecord.trackId === newTrackRecord.trackId
		const isBetterTime = currentTrackRecord.time > newTrackRecord.time
		const isBetterRespawns = currentTrackRecord.respawns < newTrackRecord.respawns
		return isSameTrack && (isBetterTime || isBetterRespawns)
	}
}
