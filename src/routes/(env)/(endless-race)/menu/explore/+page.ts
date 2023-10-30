import { TrackManager } from '../../../../../lib/TrackData/TrackDataManager'
import type { PageLoad } from './$types'

export const load = (async () => {
	const trackDatas = await TrackManager.getCommunityTracks('popular', 20)
	return {
		trackDatas
	}
}) satisfies PageLoad
