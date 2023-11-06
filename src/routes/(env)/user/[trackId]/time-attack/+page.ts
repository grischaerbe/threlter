import { Leaderboard } from '../../../../../lib/Leaderboard/Leaderboard'
import { TrackRecordsManager } from '../../../../../lib/TrackRecord/TrackRecordsManager'
import type { PageLoad } from './$types'

export const load = (async ({ params, parent }) => {
	const trackRecordsManager = TrackRecordsManager.fromTrackId(params.trackId)
	const leaderboard = await Leaderboard.fromTrackId(params.trackId)
	return {
		trackRecordsManager,
		leaderboard
	}
}) satisfies PageLoad
