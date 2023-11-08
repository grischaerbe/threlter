import {
	PUBLIC_NAKAMA_HOST,
	PUBLIC_NAKAMA_PORT,
	PUBLIC_NAKAMA_SERVER_KEY,
	PUBLIC_NAKAMA_USE_SSL
} from '$env/static/public'
import { Client } from '@heroiclabs/nakama-js'

export class Nakama {
	public static client = new Client(
		PUBLIC_NAKAMA_SERVER_KEY,
		PUBLIC_NAKAMA_HOST,
		PUBLIC_NAKAMA_PORT && PUBLIC_NAKAMA_PORT.length ? PUBLIC_NAKAMA_PORT : '',
		PUBLIC_NAKAMA_USE_SSL === 'true' || PUBLIC_NAKAMA_USE_SSL === '1',
		10e3,
		true
	)
}
