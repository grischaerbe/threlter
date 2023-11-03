import { TrackManager } from '../../../../../lib/TrackManager/TrackManager'
import type { PageLoad } from './$types'

export const load = (async () => {
	const tracks = await TrackManager.getCommunityTracks('recent', 20, 1)
	const userIds = tracks
		.map((track) => track.userId)
		// filter duplicates
		.filter((userId, index, array) => {
			return array.indexOf(userId) === index
		})
	const users = await TrackManager.getUser(userIds)
	users.sort((a, b) => {
		return userIds.indexOf(a.id ?? '') - userIds.indexOf(b.id ?? '')
	})
	return {
		tracks,
		users
	}
}) satisfies PageLoad
