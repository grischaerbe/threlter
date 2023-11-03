import { TrackManager } from '../../../../../lib/TrackManager/TrackManager'
import { LoadDependencies } from '../../../../../lib/loadDependencies'
import { nakama } from '../../../../../lib/nakama'
import type { PageLoad } from './$types'

export const load = (async ({ depends }) => {
	if (!nakama.session.current?.user_id) throw new Error('Not logged in')

	depends(LoadDependencies['menu/my-tracks'])

	const tracks = await TrackManager.getOwnTracks()
	const users = await TrackManager.getUser([nakama.session.current.user_id])

	return {
		tracks,
		users
	}
}) satisfies PageLoad
