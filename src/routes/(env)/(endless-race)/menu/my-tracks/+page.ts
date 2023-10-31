import { TrackManager } from '../../../../../lib/TrackManager/TrackManager'
import type { PageLoad } from './$types'

export const load = (async ({ depends }) => {
	depends('user:my-tracks')

	const tracks = await TrackManager.getOwnTracks()
	return {
		tracks
	}
}) satisfies PageLoad
