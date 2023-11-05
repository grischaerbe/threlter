import { redirect } from '@sveltejs/kit'
import { TrackManager } from '../../../../../lib/TrackManager/TrackManager'
import { LoadDependencies } from '../../../../../lib/loadDependencies'
import { SessionManager } from '../../../../../lib/nakama/SessionManager'
import type { LayoutLoad } from './$types'

export const load = (async ({ depends, params, url }) => {
	depends(LoadDependencies['menu/my-tracks'])

	if (!SessionManager.userId) throw redirect(307, '/')

	const page = Number(url.searchParams.get('page') ?? 1)

	const { tracks, hasMore } = await TrackManager.getOwnTracks(page, 10)

	return {
		tracks,
		selectedTrackId: params.trackId,
		hasMore,
		page
	}
}) satisfies LayoutLoad
