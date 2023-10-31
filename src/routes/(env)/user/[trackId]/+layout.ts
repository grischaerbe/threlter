import { redirect } from '@sveltejs/kit'
import type { LayoutLoad } from './$types'
import { TrackManager } from '../../../../lib/TrackManager/TrackManager'

export const load = (async ({ params, parent, route }) => {
	// the parent layout logs in the user and creates the nakama session, so we
	// need to wait for it
	await parent()

	const track = await TrackManager.getUserTracks(params.trackId)

	// if the track doesn't exist, redirect to the main menu
	if (!track) {
		throw redirect(307, '/menu/main')
	}

	// if the track is not owned by the current user, redirect to the main menu if
	// the user is trying to edit it
	if (route.id.includes('edit') && track.userId !== TrackManager.session.current?.user_id) {
		throw redirect(307, '/menu/main')
	}

	return {
		track
	}
}) satisfies LayoutLoad
