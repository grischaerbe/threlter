import type { User } from '@heroiclabs/nakama-js'
import { SessionManager } from './SessionManager'

/**
 * This class will eventually be used to manage the current user, get users, etc.
 * Currently this is still housed in TrackManager, but it will be moved here.
 */
export class UserManager {
	public static getUserName(user: User) {
		if (user.id === SessionManager.userId) {
			return `${user.username} (you)`
		}
		return user.username
	}

	public static isSelf(user: User) {
		return user.id === SessionManager.userId
	}
}
