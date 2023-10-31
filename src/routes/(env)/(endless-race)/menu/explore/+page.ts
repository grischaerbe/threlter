import { TrackManager } from '../../../../../lib/TrackManager/TrackManager'
import type { PageLoad } from './$types'

export const load = (async () => {
	const tracks = await TrackManager.getCommunityTracks('recent', 20, 1)
	return {
		tracks
	}
}) satisfies PageLoad
