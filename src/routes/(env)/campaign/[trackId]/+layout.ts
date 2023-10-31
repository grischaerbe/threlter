import type { Track } from '$lib/Track/Track'
import type { LayoutLoad } from './$types'
import { redirect } from '@sveltejs/kit'

export const load = (async ({ params, parent }) => {
	// const parentData = await parent()

	// const track = parentData.campaign.tracks.find((track) => {
	// 	return track.trackId === params.trackId
	// })

	// if (!track) {
	throw redirect(307, '/menu/main')
	// }

	return {
		track: undefined as any as Track
	}
}) satisfies LayoutLoad
