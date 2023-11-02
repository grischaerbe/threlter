import { redirect } from '@sveltejs/kit'
import type { LayoutLoad } from './$types'
import { Track } from '../../../../lib/Track/Track'

const filterUndefined = <T>(value: T | undefined): value is T => {
	return value !== undefined
}

export const load = (async ({ params, parent }) => {
	// the parent layout logs in the user and creates the nakama session, so we
	// need to wait for it
	await parent()

	const jsons = await import.meta.glob('../../../../CampaignTracks/*.json', { eager: true })
	const tracks = Object.values(jsons)
		.map((json) => {
			return new Track().setFromData((json as any).default)
		})
		.filter(filterUndefined)

	const track = tracks.find((track) => {
		return track.trackId === params.trackId
	})

	if (!track) {
		throw redirect(307, '/menu/main')
	}

	return {
		track
	}
}) satisfies LayoutLoad
