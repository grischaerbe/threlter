import { Leaderboard } from '../../../../../lib/Leaderboard/Leaderboard'
import { TrackRecordsManager } from '../../../../../lib/TrackRecord/TrackRecordsManager'
import { SessionManager } from '../../../../../lib/nakama/SessionManager'
import type { PageLoad } from './$types'

export const load = (async ({ params }) => {
	await SessionManager.awaitSession()

	const trackRecordsManager = TrackRecordsManager.fromTrackId(params.trackId)
	const leaderboard = await Leaderboard.fromTrackId(params.trackId)
	return {
		trackRecordsManager,
		leaderboard
	}
}) satisfies PageLoad
