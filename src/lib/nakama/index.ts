import { Client, Session, type Socket } from '@heroiclabs/nakama-js'
import { currentWritable } from '@threlte/core'
import { derived } from 'svelte/store'

const client = new Client('defaultkey', '127.0.0.1', '7350')
const session = currentWritable<Session | undefined>(undefined)
const userId = derived(session, (session) => session?.user_id)
const authenticated = derived(session, (session) => !!session)
const socket = currentWritable<Socket | undefined>(undefined)

/**
 * Starts a new session with the given deviceId.
 *
 * @param deviceId The deviceId to use for authentication.
 */
const startSession = async (deviceId: string) => {
	const tokens = localStorage['nakama.tokens'] && JSON.parse(localStorage['nakama.tokens'])
	if (!tokens) {
		// no tokens, authenticating
		session.set(await client.authenticateDevice(deviceId, true))
		const tokens = [session.current?.token, session.current?.refresh_token]
		localStorage['nakama.tokens'] = JSON.stringify(tokens)
	} else {
		// tokens, setting session
		const [token, refresh_token] = tokens
		session.set(new Session(token, refresh_token, false))
		if (session.current?.isexpired(Date.now() / 1000)) {
			console.log('EXPIRED')
			try {
				// tokens, but session expired, refreshing session
				console.log('REFRESH')
				await client.sessionRefresh(session.current)
			} catch (error) {
				console.log('ERRROR')
				// session refresh failed, re-authenticating
				session.set(await client.authenticateDevice(deviceId, true))
				const tokens = [session.current?.token, session.current?.refresh_token]
				localStorage['nakama.tokens'] = JSON.stringify(tokens)
			}
		}
	}

	// connect socket
	// if (!session.current) throw new Error('Session not set')
	// socket.set(client.createSocket())
	// socket.current?.connect(session.current, true)

	// const account = await client.getAccount(session.current)

	// await client.updateAccount(session.current, {
	// 	username: 'legrisch',
	// 	display_name: 'legrisch',
	// 	timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
	// 	lang_tag: navigator.language
	// })
}

/**
 * Ends the current session and clears the tokens from localStorage.
 */
const endSession = async () => {
	if (!session.current) {
		console.warn('Nakama: session not set, cannot end session')
		return
	}
	const tokens = localStorage['nakama.tokens'] && JSON.parse(localStorage['nakama.tokens'])
	if (!tokens) {
		console.warn('Nakama: tokens not set, cannot end session')
		return
	}
	const [token, refresh_token] = tokens
	await client.sessionLogout(session.current, token, refresh_token)
	session.set(undefined)
}

export const nakama = {
	client,
	session,
	userId,
	authenticated,
	socket,
	startSession,
	endSession
}
