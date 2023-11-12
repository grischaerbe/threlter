import { TrackRecordsManager } from '../../../../../lib/TrackRecord/TrackRecordsManager'
import { SessionManager } from '../../../../../lib/nakama/SessionManager'
import type { PageLoad } from './$types'

export const load = (async ({ parent }) => {
	await SessionManager.awaitSession()

	const parentData = await parent()

	const trackRecordsManager = new TrackRecordsManager(
		SessionManager.getUserId(),
		parentData.track.trackId
	)

	return {
		trackRecordsManager
	}
}) satisfies PageLoad
