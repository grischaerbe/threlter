import { redirect } from '@sveltejs/kit'
import { toSearchParamsString } from '../../../../../lib/utils/queryParamsString'
import type { PageLoad } from './$types'

// If the user navigates to /menu/explore, redirect them to the first track in the list
export const load = (async ({ parent, url }) => {
	const data = await parent()

	const firstTrack = data.tracks[0]

	if (firstTrack) {
		throw redirect(
			307,
			`/menu/explore/${firstTrack.trackId}${toSearchParamsString(url.searchParams)}`
		)
	}

	return {}
}) satisfies PageLoad
