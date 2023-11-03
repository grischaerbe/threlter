import { TrackRecordsManager } from '../../../../../lib/TrackRecord/TrackRecordsManager'
import type { PageLoad } from './$types'

export const load = (async ({ params, parent }) => {
	const trackRecordsManager = TrackRecordsManager.fromTrackId(params.trackId)
	return {
		trackRecordsManager
	}
}) satisfies PageLoad
