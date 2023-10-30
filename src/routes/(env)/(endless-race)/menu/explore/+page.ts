import { TrackManager } from '../../../../../lib/TrackData/TrackDataManager'
import type { PageLoad } from './$types'

export const load = (async () => {
	const trackDatas = await TrackManager.getCommunityTracks('recent', 20, 1)
	return {
		trackDatas
	}
}) satisfies PageLoad
