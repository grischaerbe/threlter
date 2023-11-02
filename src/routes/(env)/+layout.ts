import { nakama } from '../../lib/nakama'
import type { LayoutLoad } from './$types'

export const load = (async () => {
	const id = localStorage['nakama.device.id'] ?? Math.random().toString(16).slice(2)
	localStorage['nakama.device.id'] = id

	await nakama.startSession(id)

	return {}
}) satisfies LayoutLoad
