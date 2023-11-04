import { debounce } from 'lodash-es'
import { UserTrack } from '../Track/UserTrack'
import { TrackRecord } from '../TrackRecord/TrackRecord'
import { Nakama } from '../nakama/Nakama'
import { SessionManager } from '../nakama/SessionManager'

const filterUndefined = <T>(d: T | undefined): d is T => {
	return !!d
}

export class TrackManager {
	static async getOwnTracks() {
		const response = await Nakama.client.rpc(await SessionManager.getSession(), 'get_user_tracks', {
			sort: 'recent',
			own: true
		})

		const { objects } = response.payload as { objects: { value: any }[] }

		return objects.filter(filterUndefined).map((object) => {
			return UserTrack.fromData(object.value)
		})
	}

	static async getUserTrack(trackId: string) {
		const response = await Nakama.client.rpc(await SessionManager.getSession(), 'get_user_track', {
			trackId
		})
		const { object } = response.payload as { object: { value: any } }
		if (!object) return undefined
		return UserTrack.fromData(object)
	}

	static async deleteUserTrack(trackId: string) {
		await Nakama.client.deleteStorageObjects(await SessionManager.getSession(), {
			object_ids: [
				{
					collection: 'user-tracks',
					key: trackId
				}
			]
		})
		await TrackManager.getOwnTracks()
	}

	static saveUserTrackDebounced = debounce(TrackManager.saveUserTrack, 500)
	static async saveUserTrack(userTrack: UserTrack) {
		await Nakama.client.rpc(await SessionManager.getSession(), 'save_user_track', userTrack)
	}

	static async publishUserTrack(userTrack: UserTrack, trackRecord: TrackRecord) {
		await Nakama.client.rpc(await SessionManager.getSession(), 'publish_user_track', {
			userTrack,
			trackRecord
		})
	}

	/**
	 * Tracks by other users, only validated tracks.
	 */
	public static async getCommunityTracks(sort: 'popular' | 'recent', limit: number, page: number) {
		const response = await Nakama.client.rpc(await SessionManager.getSession(), 'get_user_tracks', {
			sort,
			limit,
			page
		})

		const { objects } = response.payload as { objects: { value: any }[] }

		return objects
			.filter(filterUndefined)
			.map((object) => {
				return UserTrack.fromData(object.value)
			})
			.filter((track) => {
				return !!track.public
			})
	}

	public static async addTrackRecord(trackRecord: TrackRecord) {
		await Nakama.client.rpc(await SessionManager.getSession(), 'add_track_record', {
			trackRecord
		})
	}

	public static async getLeaderboard(trackId: string, limit: number, cursor?: string) {
		const response = await Nakama.client.listLeaderboardRecords(
			await SessionManager.getSession(),
			trackId,
			undefined,
			limit,
			cursor
		)
		const records =
			response.records
				?.map((record) => {
					if (!record || !record.metadata) return undefined
					return {
						rank: record.rank,
						trackRecord: TrackRecord.fromData(record.metadata)
					}
				})
				.filter(filterUndefined) ?? []

		const users = await TrackManager.getUser([
			...new Set(records.map((records) => records.trackRecord.userId))
		])

		return {
			records: records
				.map((record, index) => {
					const user = users.find((user) => user.id === record.trackRecord.userId)
					if (!user) return undefined
					return {
						record,
						user
					}
				})
				.filter(filterUndefined),
			hasNext: !!response.next_cursor,
			next: () => {
				return TrackManager.getLeaderboard(trackId, limit, response.next_cursor)
			},
			hasPrevious: !!response.prev_cursor,
			previous: () => {
				return TrackManager.getLeaderboard(trackId, limit, response.prev_cursor)
			}
		}
	}

	public static async getUser(userIds: string[]) {
		const response = await Nakama.client.getUsers(
			await SessionManager.getSession(),
			userIds,
			undefined,
			undefined
		)
		return response.users ?? []
	}

	public static async getTrackRecord(trackId: string, rank: number) {
		try {
			const response = await Nakama.client.listLeaderboardRecords(
				await SessionManager.getSession(),
				trackId,
				undefined,
				rank,
				undefined
			)
			const trackRecords = response.records?.map((record) => {
				if (!record || !record.metadata) return undefined
				return TrackRecord.fromData(record.metadata)
			})
			return trackRecords?.[0]
		} catch (error) {
			return undefined
		}
	}

	public static async getOwnTrackRecord(trackId: string) {
		if (!SessionManager.userId) throw new Error('User not logged in')
		try {
			const response = await Nakama.client.listLeaderboardRecordsAroundOwner(
				await SessionManager.getSession(),
				trackId,
				SessionManager.userId,
				1
			)
			const trackRecords = response.records?.map((record) => {
				if (!record || !record.metadata) return undefined
				return TrackRecord.fromData(record.metadata)
			})
			return trackRecords?.[0]
		} catch (error) {
			return undefined
		}
	}
}
