import { error } from '@sveltejs/kit'
import { SessionManager } from '../../../../lib/nakama/SessionManager'
import { SocketManager } from '../../../../lib/nakama/SocketManager'
import { TimeTrialMatchManager } from '../../../../lib/nakama/matchHandler/time-trial/TimeTrialMatchManager'
import { ClientOpCode, ServerOpCode } from '../../../../lib/nakama/matchHandler/time-trial/types'
import type { PageLoad } from './$types'

export const load = (async ({ params }) => {
	await SessionManager.awaitSession()

	await SocketManager.connect()

	const matchManager = new TimeTrialMatchManager(params.matchId)

	try {
		await matchManager.join()
	} catch (e) {
		const err = e as any
		if (err.message === 'Match not found') {
			throw error(404, { message: 'Match not found' })
		} else {
			throw error(500, { message: 'Unknown Error' })
		}
	}

	return {
		matchManager,
		ClientOpCode: ClientOpCode,
		ServerOpCode: ServerOpCode
	}
}) satisfies PageLoad
