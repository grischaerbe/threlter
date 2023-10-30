import { TrackManager } from '../../../../../lib/TrackManager/TrackManager'
import type { PageLoad } from './$types'

export const load = (async () => {
	const trackDatas = await TrackManager.getCommunityTracks('recent', 20, 1)
	return {
		trackDatas
	}
}) satisfies PageLoad
