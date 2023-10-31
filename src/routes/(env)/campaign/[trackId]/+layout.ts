import { redirect } from '@sveltejs/kit'
import type { LayoutLoad } from './$types'

export const load = (async ({ params, parent }) => {
	const parentData = await parent()

	const track = parentData.campaign.tracks.find((track) => {
		return track.trackId === params.trackId
	})

	if (!track) {
		throw redirect(307, '/menu/main')
	}

	return {
		track
	}
}) satisfies LayoutLoad
