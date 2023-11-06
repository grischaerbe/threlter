import type { User } from '@heroiclabs/nakama-js'
import { SessionManager } from './SessionManager'
import { Nakama } from './Nakama'

/**
 * This class will eventually be used to manage the current user, get users, etc.
 * Currently this is still housed in TrackManager, but it will be moved here.
 */
export class UserManager {
	public static formatUserName(userId: string, userName: string): string | undefined
	public static formatUserName(user: User): string | undefined
	public static formatUserName(userIdOrUser: string | User, userName?: string): string | undefined {
		let uId = typeof userIdOrUser === 'string' ? userIdOrUser : userIdOrUser.id
		let uName = typeof userIdOrUser === 'string' ? userName : userIdOrUser.username
		if (uId === SessionManager.userId) {
			return `${uName} (you)`
		}
		return uName
	}

	public static isSelf(userId: string): boolean
	public static isSelf(user: User): boolean
	public static isSelf(userIdOrUser: string | User) {
		return typeof userIdOrUser === 'string'
			? userIdOrUser === SessionManager.userId
			: userIdOrUser.id === SessionManager.userId
	}

	public static async updateAccount(username: string): Promise<{ success: boolean }> {
		try {
			const response = (await Nakama.client.rpc(
				await SessionManager.getSession(),
				'update_account',
				{
					username,
					timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
				}
			)) as { payload: { success: boolean } }
			if (!response.payload?.success) {
				throw new Error('Failed to update account')
			}
			return {
				success: true
			}
		} catch (error) {
			console.warn(error)
			return {
				success: false
			}
		}
	}
}
