import { TrackManager } from '../../../../../lib/TrackManager/TrackManager'
import { LoadDependencies } from '../../../../../lib/loadDependencies'
import { SessionManager } from '../../../../../lib/nakama/SessionManager'
import type { PageLoad } from './$types'

export const load = (async ({ depends }) => {
	depends(LoadDependencies['menu/my-tracks'])

	if (!SessionManager.userId) throw new Error('Not logged in')

	const tracks = await TrackManager.getOwnTracks()
	const users = await TrackManager.getUser([SessionManager.userId])

	return {
		tracks,
		users
	}
}) satisfies PageLoad
