import type { Client } from '@heroiclabs/nakama-js'
import { debounce } from 'lodash-es'
import { nakama } from '../nakama'
import { Track } from './TrackData'

const filterUndefined = <T>(d: T | undefined): d is T => {
	return !!d
}

export class TrackManager {
	public static client: Client = nakama.client
	public static session = nakama.session

	static async getOwnTrackDatas() {
		if (!TrackManager.session.current) throw new Error('Session not set')

		const response = await TrackManager.client.rpc(
			TrackManager.session.current,
			'get_user_tracks',
			{
				sort: 'recent',
				userId: TrackManager.session.current.user_id
			}
		)

		const { objects } = response.payload as { objects: { value: any }[] }

		return objects
			.filter(filterUndefined)
			.map((object) => {
				return Track.fromJSON(object.value)
			})
			.filter((trackData) => {
				return !!trackData.validated.current
			})
	}

	static async getUserTrackData(trackId: string) {
		if (!TrackManager.session.current) throw new Error('Session not set')

		console.log(trackId)

		const response = await TrackManager.client.rpc(TrackManager.session.current, 'get_user_track', {
			trackId
		})
		const { object } = response.payload as { object: { value: any } }
		if (!object) return undefined
		return Track.fromJSON(object.value)
	}

	static async deleteUserTrackData(trackId: string) {
		if (!TrackManager.session.current) throw new Error('Session not set')
		await TrackManager.client.deleteStorageObjects(TrackManager.session.current, {
			object_ids: [
				{
					collection: 'user-tracks',
					key: trackId
				}
			]
		})
		await TrackManager.getOwnTrackDatas()
	}

	static saveUserTrackDataDebounced = debounce(TrackManager.saveUserTrackData, 500)

	static async saveUserTrackData(trackData: Track) {
		if (!TrackManager.session.current) throw new Error('Session not set')
		const object = JSON.parse(JSON.stringify(trackData))
		await TrackManager.client.writeStorageObjects(TrackManager.session.current, [
			{
				collection: 'user-tracks',
				key: trackData.trackId,
				value: object,
				permission_read: 2,
				permission_write: 1
			}
		])
		await TrackManager.getOwnTrackDatas()
	}

	/**
	 * Tracks by other users, only validated tracks.
	 */
	public static async getCommunityTracks(sort: 'popular' | 'recent', limit: number, page: number) {
		if (!TrackManager.session.current) throw new Error('Session not set')

		const response = await TrackManager.client.rpc(
			TrackManager.session.current,
			'get_user_tracks',
			{
				sort,
				limit,
				page,
				validated: true
			}
		)

		const { objects } = response.payload as { objects: { value: any }[] }

		return objects
			.filter(filterUndefined)
			.map((object) => {
				return Track.fromJSON(object.value)
			})
			.filter((trackData) => {
				return !!trackData.validated.current
			})
	}
}
