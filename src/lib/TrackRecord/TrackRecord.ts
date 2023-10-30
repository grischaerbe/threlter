import { derived } from 'svelte/store'
import type { Track } from '../TrackData/TrackData'
import { jsonCurrentWritable } from '../utils/jsonCurrentWritable'
import { Ghost } from './Ghost'
import { formatTime } from '../utils/formatters'

/**
 * A track record is a record of a track with a specific validation id.
 * It contains the time and respawns of the player.
 * It also contains a ghost of the player's run.
 * It is saved to local storage except for the ghost.
 */
export class TrackRecord {
	public trackId: string
	public trackValidationId: string

	public ghost: Ghost | undefined

	public time = jsonCurrentWritable(0)

	public timeFormatted = derived(this.time, (time) => formatTime(time))

	public respawns = jsonCurrentWritable(0)

	constructor(trackId: string, trackValidationId: string, ghost?: Ghost) {
		this.trackId = trackId
		this.trackValidationId = trackValidationId
		this.ghost = ghost
	}

	public static fromTrackData(trackData: Track, ghost?: Ghost) {
		return new TrackRecord(trackData.trackId, trackData.validationId, ghost)
	}

	get trackRecordId() {
		return TrackRecord.makeTrackRecordId(this.trackId, this.trackValidationId)
	}

	public initializeGhost() {
		this.ghost = new Ghost()
	}

	public toJSON() {
		// save this but without the ghost
		const { ghost, ...rest } = this
		return rest
	}

	public saveToLocalStorage() {
		localStorage.setItem(this.trackRecordId, JSON.stringify(this))
	}

	public static makeTrackRecordId(trackData: Track): string
	public static makeTrackRecordId(trackId: string, trackValidationId: string): string
	public static makeTrackRecordId(trackIdOrTrackData: string | Track, trackValidationId?: string) {
		if (typeof trackIdOrTrackData === 'string') {
			return `Record-${trackIdOrTrackData}-${trackValidationId}`
		} else {
			return `Record-${trackIdOrTrackData.trackId}-${trackIdOrTrackData.validationId}`
		}
	}

	public static fromLocalStorage(trackData: Track) {
		/**
		 * Only return a record for a track if the track is validated
		 */
		if (!trackData.validated.current) return undefined
		const data = localStorage.getItem(TrackRecord.makeTrackRecordId(trackData))
		if (data) return TrackRecord.fromString(data)
		return undefined
	}

	public static fromString(string: string) {
		const data = JSON.parse(string)
		return TrackRecord.fromJSON(data)
	}

	public static fromJSON(data: any) {
		const record = new TrackRecord(data.trackId, data.trackValidationId)
		record.time.set(data.time)
		record.respawns.set(data.respawns)

		// The ghost is not saved to local storage, so it may be undefined
		if (data.ghost) record.ghost = Ghost.fromJSON(data.ghost)

		return record
	}

	/**
	 * Check if a TrackRecord is a new record in comparison to another TrackRecord.
	 */
	public static isNewTrackRecord(currentTrackRecord: TrackRecord, newTrackRecord: TrackRecord) {
		const isSameTrack = currentTrackRecord.trackId === newTrackRecord.trackId
		const isSameValidation =
			currentTrackRecord.trackValidationId === newTrackRecord.trackValidationId
		const isBetterTime = currentTrackRecord.time.current > newTrackRecord.time.current
		const isBetterRespawns = currentTrackRecord.respawns.current < newTrackRecord.respawns.current
		return isSameTrack && isSameValidation && (isBetterTime || isBetterRespawns)
	}
}
