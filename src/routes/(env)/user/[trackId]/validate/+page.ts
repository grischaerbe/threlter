import { redirect } from '@sveltejs/kit'
import { SessionManager } from '../../../../../lib/nakama/SessionManager'
import type { PageLoad } from './$types'
import { TrackRecordsManager } from '../../../../../lib/TrackRecord/TrackRecordsManager'

export const load = (async ({ parent }) => {
	const parentData = await parent()

	const userId = SessionManager.userId
	if (!userId) throw redirect(307, '/menu/main')

	const trackRecordsManager = new TrackRecordsManager(userId, parentData.track.trackId)

	return {
		trackRecordsManager
	}
}) satisfies PageLoad
