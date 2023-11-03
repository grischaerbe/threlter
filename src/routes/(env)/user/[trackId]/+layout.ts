import { redirect } from '@sveltejs/kit'
import type { LayoutLoad } from './$types'
import { TrackManager } from '../../../../lib/TrackManager/TrackManager'
import { TrackRecordsManager } from '../../../../lib/TrackRecord/TrackRecordsManager'

export const load = (async ({ params, parent, route }) => {
	// the parent layout logs in the user and creates the nakama session, so we
	// need to wait for it
	await parent()

	const track = await TrackManager.getUserTrack(params.trackId)

	// if the track doesn't exist, redirect to the main menu
	if (!track) {
		throw redirect(307, '/menu/main')
	}

	// if the track is not owned by the current user, redirect to the main menu if
	// the user is trying to edit it
	if (route.id.includes('edit') && track.userId !== TrackManager.session.current?.user_id) {
		throw redirect(307, '/menu/main')
	}

	// if the track is public and the user is trying to edit it, return to the my tracks menu
	if (track.public && route.id.includes('edit')) {
		throw redirect(307, '/menu/my-tracks')
	}

	return {
		track
	}
}) satisfies LayoutLoad
