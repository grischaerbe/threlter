import { TrackManager } from '../../../../../lib/TrackManager/TrackManager'
import { SessionManager } from '../../../../../lib/nakama/SessionManager'
import type { LayoutLoad } from './$types'

export const load = (async ({ params, url }) => {
	await SessionManager.awaitSession()

	const page = Number(url.searchParams.get('page') ?? 1)

	const limit = 10

	const { tracks, hasMore } = await TrackManager.getOwnTracks(page, limit)

	return {
		tracks,
		selectedTrackId: params.trackId,
		itemsPerPage: limit,
		hasMore,
		page
	}
}) satisfies LayoutLoad
