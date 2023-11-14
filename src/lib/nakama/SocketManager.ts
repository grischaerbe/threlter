import { Nakama } from './Nakama'
import { SessionManager } from './SessionManager'

export class SocketManager {
	public static socket = Nakama.client.createSocket(false)

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
