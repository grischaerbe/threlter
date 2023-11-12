import { redirect } from '@sveltejs/kit'
import { get } from 'svelte/store'
import { Leaderboard } from '../../../../../../lib/Leaderboard/Leaderboard'
import { TrackManager } from '../../../../../../lib/TrackManager/TrackManager'
import { currentSearchParamsString } from '../../../../../../lib/utils/queryParamsString'
import type { PageLoad } from './$types'
import { SessionManager } from '../../../../../../lib/nakama/SessionManager'

export const load = (async ({ params }) => {
	await SessionManager.awaitSession()

	const track = await TrackManager.getUserTrack(params.trackId, TrackManager.FetchIntent.View)

	if (!track) throw redirect(307, `/menu/explore${get(currentSearchParamsString)}`)

	const [leaderboard, user] = await Promise.all([
		Leaderboard.fromTrackId(params.trackId),
		TrackManager.getUser([track.userId])
	])

	return {
		track,
		leaderboard,
		user: user[0]
	}
}) satisfies PageLoad
