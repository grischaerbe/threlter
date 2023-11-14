import { error } from '@sveltejs/kit'
import { MatchManager } from '../../../../lib/nakama/MatchManager'
import { SessionManager } from '../../../../lib/nakama/SessionManager'
import { SocketManager } from '../../../../lib/nakama/SocketManager'
import {
	ClientOpCode,
	ServerOpCode,
	type ClientMessage,
	type ServerMessage
} from '../../../../lib/nakama/matchHandler/time-trial/types'
import type { PageLoad } from './$types'

export const load = (async ({ params }) => {
	await SessionManager.awaitSession()

	await SocketManager.connect()

	const matchManager = new MatchManager<
		typeof ClientOpCode,
		typeof ServerOpCode,
		ClientMessage,
		ServerMessage
	>(params.matchId, SocketManager.socket, ClientOpCode, ServerOpCode)

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
