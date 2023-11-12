import { redirect } from '@sveltejs/kit'
import { TrackManager } from '../../../../lib/TrackManager/TrackManager'
import { SessionManager } from '../../../../lib/nakama/SessionManager'
import type { LayoutLoad } from './$types'

export const load = (async ({ params, parent, route }) => {
	await SessionManager.awaitSession()

	let fetchIntent = TrackManager.FetchIntent.View
	if (route.id.includes('edit')) {
		fetchIntent = TrackManager.FetchIntent.Edit
	} else if (route.id.includes('time-attack')) {
		fetchIntent = TrackManager.FetchIntent.Play
	} else if (route.id.includes('validate')) {
		fetchIntent = TrackManager.FetchIntent.Validate
	}

	const track = await TrackManager.getUserTrack(params.trackId, fetchIntent)

	// if the track doesn't exist, redirect to the main menu
	if (!track) {
		throw redirect(307, '/menu/main')
	}

	// 1. if the track is not owned by the current user, redirect to the main menu
	//    if the user is trying to edit it
	// 2. if the track is public and the user is trying to edit or validate it,
	//    return to the my tracks menu
	if (
		(route.id.includes('edit') || route.id.includes('validate')) &&
		(track.userId !== SessionManager.getUserId() || track.public)
	) {
		throw redirect(307, '/menu/main')
	}

	return {
		track
	}
}) satisfies LayoutLoad
