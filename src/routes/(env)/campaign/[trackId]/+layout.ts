import type { LayoutLoad } from './$types'
import { redirect } from '@sveltejs/kit'

export const load = (async ({ params, parent }) => {
	const parentData = await parent()

	const trackData = parentData.campaign.tracks.find((track) => {
		return track.trackId === params.trackId
	})

	if (!trackData) {
		throw redirect(307, '/menu/main')
	}

	return {
		trackData
	}
}) satisfies LayoutLoad
