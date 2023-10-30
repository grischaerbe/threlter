import { TrackManager } from '../../../../../lib/TrackData/TrackDataManager'
import type { PageLoad } from './$types'

export const load = (async ({ depends }) => {
	depends('user:my-tracks')

	const trackDatas = await TrackManager.getOwnTrackDatas()
	return {
		trackDatas
	}
}) satisfies PageLoad
