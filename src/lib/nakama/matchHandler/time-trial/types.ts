/** Copy from nkruntime */
export enum PresenceReason {
	PresenceReasonUnknown = 0,
	PresenceReasonJoin = 1,
	PresenceReasonUpdate = 2,
	PresenceReasonLeave = 3,
	PresenceReasonDisconnect = 4
}

/** Copy from nkruntime */
export interface Presence {
	userId: string
	sessionId: string
	username: string
	node: string
	status?: string
	hidden?: boolean
	persistence?: boolean
	reason?: PresenceReason
}

export enum MatchState {
	WarmUp = 0,
	InProgress = 1,
	CoolDown = 2
}

export type State = {
	/** match state */
	matchState: MatchState
	/** match start time in Unix milliseconds, a sentinal value of -1 signals that the match hasn't begun yet. */
	matchStartTime?: number
	/** the duration of the match in milliseconds */
	matchDurationInMilliseconds?: number
	/** the track id of the track that is being played */
	trackId: string
	/** the leaderboard id of the leaderboard that is being used */
	leaderboardId: string
	/** the players participating in the match */
	players: {
		[userId: string]: {
			ready: boolean
			presence: Presence
			position: [number, number, number]
			rotation: [number, number, number, number]
		}
	}
}

export enum ClientOpCode {
	NoOp,
	Ready,
	TransformUpdate,
	LeaderboardRecordAdd
}

export enum ServerOpCode {
	NoOp,
	GameUpdate,
	TransformUpdates,
	MatchStarted,
	MatchFinished,
	MatchRestart,
	UpdateLeaderboard
}

export type ServerMessage = {
	[ServerOpCode.NoOp]: {}
	[ServerOpCode.GameUpdate]: {
		matchState: MatchState
		matchStartTime: number
		matchEndTime: number
		matchDurationInMs: number
		restartMatchTime: number
		serverTime: number
		trackId: string
		tickRate: number
	}
	[ServerOpCode.TransformUpdates]: {
		transforms: {
			[userId: string]: {
				position: [number, number, number]
				rotation: [number, number, number, number]
			}
		}
	}
	[ServerOpCode.MatchStarted]: {}
	[ServerOpCode.MatchFinished]: {}
	[ServerOpCode.MatchRestart]: {
		trackId: string
		matchStartTime: number
		matchEndTime: number
		matchDurationInMs: number
		restartMatchTime: number
		serverTime: number
	}
	[ServerOpCode.UpdateLeaderboard]: {}
}

export type ClientMessage = {
	[ClientOpCode.NoOp]: {}
	[ClientOpCode.Ready]: {}
	[ClientOpCode.TransformUpdate]: {
		position: [number, number, number]
		rotation: [number, number, number, number]
	}
	[ClientOpCode.LeaderboardRecordAdd]: {}
}
