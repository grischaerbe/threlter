import type { Match, MatchData, MatchPresenceEvent, Socket } from '@heroiclabs/nakama-js'
import { currentWritable, type CurrentWritable } from '@threlte/core'
import { MatchResults } from '../MatchResults/MatchResults'
import { Nakama } from './Nakama'
import { Player } from './Player'
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

export abstract class MatchManagerPrototype<
	ClientOpCode,
	ServerOpCode,
	ClientMessage extends Record<any, any>,
	ServerMessage extends Record<any, any>,
	State
> {
	public matchId: string
	public leaderboardId: string
	public match: Match | undefined
	public socket: Socket
	public players: CurrentWritable<Player[]> = currentWritable([])
	public matchResults: MatchResults
	public state: State

	public ClientOpCode: ClientOpCode
	public ServerOpCode: ServerOpCode

	private textDecoder = new TextDecoder()
	private sendOrReceiveMessages = false

	constructor(
		matchId: string,
		socket: Socket,
		ClientOpCode: ClientOpCode,
		ServerOpCode: ServerOpCode,
		state: State
	) {
		this.socket = socket
		this.matchId = matchId
		this.ClientOpCode = ClientOpCode
		this.ServerOpCode = ServerOpCode
		this.leaderboardId = MatchManagerPrototype.getMatchLeaderboardId(matchId)
		this.matchResults = new MatchResults(this)
		this.state = state
	}

	abstract processMessage<OpCode extends keyof ServerMessage>(
		message: ServerMessageType<ServerMessage, OpCode>
	): void

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
		this.players.update((players) => {
			// joins
			const joined = matchPresence.joins
				? [...players, ...matchPresence.joins.map((presence) => new Player(presence))]
				: players

			// leaves
			const left = matchPresence.leaves
				? joined.filter((player) => {
						// we only keep players that we do not find in the matchPresence.leaves array
						return !matchPresence.leaves.find(
							(presence) => presence.user_id === player.presence.user_id
						)
				  })
				: joined

			return left
		})
	}

	async join() {
		this.sendOrReceiveMessages = true
		this.socket.onmatchdata = this.onMatchData.bind(this)
		this.socket.onmatchpresence = this.onMatchPresence.bind(this)
		this.match = await SocketManager.socket.joinMatch(this.matchId)
		if (this.match.presences) {
			this.players.set(this.match.presences.map((presence) => new Player(presence)))
		}
		this.matchResults.update()
		return this.match
	}

	async leave() {
		if (!this.match) return
		// we set this early in order to prevent sending or receiving messages
		this.sendOrReceiveMessages = false
		await SocketManager.socket.leaveMatch(this.matchId)
		this.match = undefined
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
