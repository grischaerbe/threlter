import type { Match, MatchData, MatchPresenceEvent, Presence, Socket } from '@heroiclabs/nakama-js'
import { Nakama } from './Nakama'
import { SessionManager } from './SessionManager'
import { SocketManager } from './SocketManager'

// Distributive conditional type
type ServerMessageType<
	ServerMessage extends Record<any, any>,
	OpCode extends keyof ServerMessage
> = OpCode extends keyof ServerMessage
	? {
			opcode: OpCode
			data: ServerMessage[OpCode]
	  }
	: never

export abstract class AbstractMatchManager<
	ClientOpCode,
	ServerOpCode,
	ClientMessage extends Record<any, any>,
	ServerMessage extends Record<any, any>
> {
	public matchId: string
	public match: Match | undefined
	public socket: Socket

	public ClientOpCode: ClientOpCode
	public ServerOpCode: ServerOpCode

	private textDecoder = new TextDecoder()
	private sendOrReceiveMessages = false

	constructor(
		matchId: string,
		socket: Socket,
		ClientOpCode: ClientOpCode,
		ServerOpCode: ServerOpCode
	) {
		this.socket = socket
		this.matchId = matchId
		this.ClientOpCode = ClientOpCode
		this.ServerOpCode = ServerOpCode
	}

	protected abstract processMessage<OpCode extends keyof ServerMessage>(
		message: ServerMessageType<ServerMessage, OpCode>
	): void

	protected abstract processJoins(joins: Presence[]): void

	protected abstract processLeaves(leaves: Presence[]): void

	protected abstract onJoin(): void

	protected abstract onLeave(): void

	private onMatchData(matchData: MatchData) {
		if (!this.sendOrReceiveMessages) return
		const data = JSON.parse(this.textDecoder.decode(matchData.data))
		const opcode = matchData.op_code as keyof ServerMessage
		const message = {
			data,
			opcode
		}
		this.processMessage(message as ServerMessageType<ServerMessage, typeof message.opcode>)
	}

	public async send<T extends keyof ClientMessage>(opcode: T, data: ClientMessage[T]) {
		if (!this.sendOrReceiveMessages) return
		const oc =
			typeof opcode === 'number'
				? opcode
				: typeof opcode === 'symbol'
				? parseInt(opcode.toString(), 10)
				: parseInt(opcode, 10)
		await this.socket.sendMatchState(this.matchId, oc, JSON.stringify(data))
	}

	private onMatchPresence(matchPresence: MatchPresenceEvent) {
		if (!this.sendOrReceiveMessages) return
		if (matchPresence.joins && matchPresence.joins.length) {
			this.processJoins(matchPresence.joins)
		}
		if (matchPresence.leaves && matchPresence.leaves.length) {
			this.processLeaves(matchPresence.leaves)
		}
	}

	async join() {
		this.sendOrReceiveMessages = true
		this.socket.onmatchdata = this.onMatchData.bind(this)
		this.socket.onmatchpresence = this.onMatchPresence.bind(this)
		this.match = await SocketManager.socket.joinMatch(this.matchId)
		if (this.match.presences && this.match.presences.length) {
			this.processJoins(this.match.presences)
		}
		this.onJoin()
	}

	async leave() {
		if (!this.match) return
		// we set this early in order to prevent sending or receiving messages
		this.sendOrReceiveMessages = false
		await SocketManager.socket.leaveMatch(this.matchId)
		this.match = undefined
		this.onLeave()
	}

	public static async createMatch(trackId: string) {
		const response = await Nakama.client.rpc(SessionManager.getSession(), 'create_match', {
			trackId,
			mode: 'time-trial'
		})
		const { matchId } = response.payload as { matchId: string }
		return matchId
	}

	public static getMatchLeaderboardId(matchId: string) {
		return `match:${matchId}`
	}
}
