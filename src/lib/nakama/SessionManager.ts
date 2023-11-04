import { browser } from '$app/environment'
import { Session } from '@heroiclabs/nakama-js'
import { v4 } from 'uuid'
import { appState } from '../../stores/app'
import { Nakama } from './Nakama'

export class SessionManager {
	private static get deviceId() {
		if (!browser) return ''
		if (localStorage['nakama.device.id']) return localStorage['nakama.device.id'] as string
		const newDeviceId = v4()
		localStorage['nakama.device.id'] = newDeviceId
		return newDeviceId
	}
	private static session: Session | undefined = undefined
	public static get userId() {
		return this.session?.user_id
	}

	public static async initializeSession() {
		await this.getSession()
	}

	/**
	 * This method is used to retrieve the current session. If there's no session
	 * it will authenticate the device and create a new session.
	 * @returns The current session.
	 */
	public static async getSession(): Promise<Session> {
		if (this.session) {
			if (this.session.isexpired(Date.now() / 1000)) {
				try {
					await Nakama.client.sessionRefresh(this.session)
					this.processNewSession(this.session)
					return this.session
				} catch (error) {
					this.session = await Nakama.client.authenticateDevice(
						this.deviceId,
						false,
						appState.options.player.name.current
					)
					this.processNewSession(this.session)
					return this.session
				}
			} else {
				return this.session
			}
		} else {
			const tokens = this.readTokens()
			if (!tokens) {
				this.session = await Nakama.client.authenticateDevice(
					this.deviceId,
					true,
					appState.options.player.name.current
				)
				this.processNewSession(this.session)
				return this.session
			} else {
				const [token, refresh_token] = tokens
				this.session = Session.restore(token, refresh_token)
				if (this.session.isexpired(Date.now() / 1000)) {
					try {
						await Nakama.client.sessionRefresh(this.session)
						this.processNewSession(this.session)
						return this.session
					} catch (error) {
						this.session = await Nakama.client.authenticateDevice(
							this.deviceId,
							false,
							appState.options.player.name.current
						)
						this.processNewSession(this.session)
						return this.session
					}
				} else {
					return this.session
				}
			}
		}
	}

	private static processNewSession(session: Session) {
		const tokens = [session.token, session.refresh_token]
		localStorage['nakama.tokens'] = JSON.stringify(tokens)
	}

	private static readTokens() {
		return localStorage['nakama.tokens']
			? (JSON.parse(localStorage['nakama.tokens']) as [token: string, refreshToken: string])
			: undefined
	}
}
