import { PUBLIC_NAKAMA_USE_SSL } from '$env/static/public'
import { Nakama } from './Nakama'
import { SessionManager } from './SessionManager'

const ssl = PUBLIC_NAKAMA_USE_SSL === 'true' || PUBLIC_NAKAMA_USE_SSL === '1'

export class SocketManager {
	public static socket = Nakama.client.createSocket(ssl)

	/**
	 * Creates
	 */
	public static async connect() {
		await this.socket.connect(SessionManager.getSession(), true)
	}

	/**
	 *
	 */
	public static async disconnect() {
		this.socket.disconnect(true)
	}
}
