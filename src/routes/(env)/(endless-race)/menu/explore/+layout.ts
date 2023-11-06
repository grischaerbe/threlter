import { redirect } from '@sveltejs/kit'
import { TrackManager } from '../../../../../lib/TrackManager/TrackManager'
import { SessionManager } from '../../../../../lib/nakama/SessionManager'
import type { LayoutLoad } from './$types'
import { cache } from '../../../../../lib/Cache/cache'

export const load = (async ({ url }) => {
	if (!SessionManager.userId) throw redirect(307, '/')

	const sort = (url.searchParams.get('sort') as any) ?? TrackManager.Sort.TopMonthly
	const limit = 10
	const page = Number(url.searchParams.get('page') ?? 1)

	// cache with SWR for 5 seconds
	const { tracks, hasMore } = await cache.cacheable(
		async () => {
			return await TrackManager.getCommunityTracks(sort, 10, page)
		},
		`explore-${sort}-${page}-${limit}`,
		{
			cachePolicy: 'stale-while-revalidate',
			maxAge: 5e3
		}
	)

	return {
		tracks,
		hasMore,
		page
	}
}) satisfies LayoutLoad
