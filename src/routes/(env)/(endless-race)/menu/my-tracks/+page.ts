import { TrackManager } from '../../../../../lib/TrackManager/TrackManager'
import type { PageLoad } from './$types'

export const load = (async ({ depends }) => {
	depends('user:my-tracks')

	const trackDatas = await TrackManager.getOwnTrackDatas()
	return {
		trackDatas
	}
}) satisfies PageLoad
