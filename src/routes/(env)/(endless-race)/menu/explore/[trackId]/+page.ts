import { redirect } from '@sveltejs/kit'
import { Leaderboard } from '../../../../../../lib/Leaderboard/Leaderboard'
import { TrackManager } from '../../../../../../lib/TrackManager/TrackManager'
import type { PageLoad } from './$types'
import { currentSearchParamsString } from '../../../../../../lib/utils/queryParamsString'
import { get } from 'svelte/store'

export const load = (async ({ params }) => {
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
