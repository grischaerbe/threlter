import { Track } from '../lib/Track/Track'

const filterUndefined = <T>(value: T | undefined): value is T => {
	return value !== undefined
}

export const load = async () => {
	const jsons = await import.meta.glob('../CampaignTracks/*.json', { eager: true })
	const tracks = Object.values(jsons)
		.map((json) => {
			return new Track().setFromData((json as any).default)
		})
		.filter(filterUndefined)
	return {
		campaign: {
			tracks
		}
	}
}

export const ssr = false
