import { Leaderboard } from '../../../../../../lib/Leaderboard/Leaderboard'
import { TrackManager } from '../../../../../../lib/TrackManager/TrackManager'
import type { PageLoad } from './$types'

export const load = (async ({ params }) => {
	const track = await TrackManager.getUserTrack(params.trackId, TrackManager.FetchIntent.View)

	if (!track) throw new Error('Track not found')

	if (!track.public) {
		return {
			track
		}
	}

	const leaderboard = await Leaderboard.fromTrackId(params.trackId)

	return {
		track,
		leaderboard
	}
}) satisfies PageLoad
