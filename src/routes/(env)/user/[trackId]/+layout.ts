import { redirect } from '@sveltejs/kit'
import { TrackManager } from '../../../../lib/TrackManager/TrackManager'
import { SessionManager } from '../../../../lib/nakama/SessionManager'
import type { LayoutLoad } from './$types'

export const load = (async ({ params, parent, route }) => {
	// the parent layout logs in the user and creates the nakama session, so we
	// need to wait for it
	await parent()

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

	// if the track is not owned by the current user, redirect to the main menu if
	// the user is trying to edit it
	if (route.id.includes('edit') && track.userId !== SessionManager.userId) {
		throw redirect(307, '/menu/main')
	}

	// if the track is public and the user is trying to edit or validate it, return to the my tracks menu
	if (track.public && (route.id.includes('edit') || route.id.includes('validate'))) {
		throw redirect(307, '/menu/my-tracks')
	}

	return {
		track
	}
}) satisfies LayoutLoad
