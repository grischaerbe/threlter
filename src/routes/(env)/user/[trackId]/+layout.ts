import { redirect } from '@sveltejs/kit'
import { TrackData } from '../../../../lib/TrackData/TrackData'
import type { LayoutLoad } from './$types'

export const load = (async ({ params }) => {
	const trackData = TrackData.fromLocalStorage(params.trackId)

	if (!trackData) {
		throw redirect(307, '/menu/main')
	}

	return {
		trackData
	}
}) satisfies LayoutLoad
