import { TrackData } from '../lib/TrackData/TrackData'
import type { LayoutLoad } from './$types'

const filterUndefined = <T>(value: T | undefined): value is T => {
	return value !== undefined
}

export const load = (async () => {
	const jsons = await import.meta.glob('../CampaignTracks/*.json', { eager: true })
	const tracks = Object.values(jsons)
		.map((json) => {
			return TrackData.fromJSON((json as any).default)
		})
		.filter(filterUndefined)
	return {
		campaign: {
			tracks
		}
	}
}) satisfies LayoutLoad

export const ssr = false
