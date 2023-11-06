import { redirect } from '@sveltejs/kit'
import { TrackManager } from '../../../../../lib/TrackManager/TrackManager'
import { SessionManager } from '../../../../../lib/nakama/SessionManager'
import type { LayoutLoad } from './$types'

export const load = (async ({ params, url }) => {
	if (!SessionManager.userId) throw redirect(307, '/')

	const page = Number(url.searchParams.get('page') ?? 1)

	const limit = 10

	const { tracks, hasMore } = await TrackManager.getOwnTracks(page, limit)

	return {
		tracks,
		selectedTrackId: params.trackId,
		hasMore,
		page
	}
}) satisfies LayoutLoad
