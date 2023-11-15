import { Session } from '@heroiclabs/nakama-js'
import { currentWritable, type CurrentWritable } from '@threlte/core'
import { Nakama } from './Nakama'
import { derived } from 'svelte/store'

const sessionExpired = (session: Session) => session.isexpired(Date.now() / 1000)

const isValidSession = (session?: Session) => {
	if (!session) return false
	return !sessionExpired(session)
}

export class SessionManager {
	public static session: CurrentWritable<Session | undefined> = currentWritable(undefined)
	public static userId = derived(this.session, (session) => session?.user_id ?? undefined)

	public static isValidSession() {
		return isValidSession(this.session.current)
	}

	public static getSession(): Session {
		if (!this.session.current) throw new Error('No session')
		return this.session.current
	}

	public static getUserId(): string {
		const session = this.getSession()
		if (!session.user_id) throw new Error('No user id')
		return session.user_id
	}

	public static awaitSession = () => {
		return new Promise<void>((resolve) => {
			if (this.isValidSession()) {
				resolve()
			} else {
				const unsubscribe = this.session.subscribe((session) => {
					if (isValidSession(session)) {
						unsubscribe()
						resolve()
					}
				})
			}
		})
	}

	/**
	 * This method is used to restore a session from the local storage.
	 *
	 * @returns True if a session was restored, false if there was no session.
	 */
	public static async restore(): Promise<boolean> {
		const tokens = this.readTokens()
		// if there are no tokens, return false to indicate that there's no session
		if (!tokens) return false
		const [token, refresh_token] = tokens
		const session = Session.restore(token, refresh_token)
		if (sessionExpired(session)) {
			try {
				await Nakama.client.sessionRefresh(session)
				this.session.set(session)
				this.processNewSession()
				return true
			} catch (error) {
				return false
			}
		}
		this.session.set(session)
		return true
	}

	public static async refreshSession() {
		const session = await Nakama.client.sessionRefresh(this.getSession())
		this.session.set(session)
		this.processNewSession()
	}

	public static async signInWithGoogle(credential: string) {
		const session = await Nakama.client.authenticateGoogle(credential, true)
		this.session.set(session)
		this.processNewSession()
	}

	public static endSession() {
		this.session.set(undefined)
		delete localStorage['nakama.tokens']
	}

	private static processNewSession() {
		const session = this.getSession()
		const tokens = [session.token, session.refresh_token]
		localStorage['nakama.tokens'] = JSON.stringify(tokens)
	}

	private static readTokens() {
		return localStorage['nakama.tokens']
			? (JSON.parse(localStorage['nakama.tokens']) as [token: string, refreshToken: string])
			: undefined
	}
}
