import { redirect } from '@sveltejs/kit'
import { TrackManager } from '../../../../lib/TrackData/TrackDataManager'
import type { LayoutLoad } from './$types'

export const load = (async ({ params, parent, route }) => {
	// the parent layout logs in the user and creates the nakama session, so we
	// need to wait for it
	await parent()

	const trackData = await TrackManager.getUserTrackData(params.trackId)

	// if the track doesn't exist, redirect to the main menu
	if (!trackData) {
		throw redirect(307, '/menu/main')
	}

	// if the track is not owned by the current user, redirect to the main menu if
	// the user is trying to edit it
	if (route.id.includes('edit') && trackData.userId !== TrackManager.session.current?.user_id) {
		throw redirect(307, '/menu/main')
	}

	return {
		trackData
	}
}) satisfies LayoutLoad
