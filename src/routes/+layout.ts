import { SessionManager } from '../lib/nakama/SessionManager'
import type { LayoutLoad } from './$types'

export const ssr = false

export const load = (async () => {
	await SessionManager.initializeSession()
	return {}
}) satisfies LayoutLoad
