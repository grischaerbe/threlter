import { env } from '$env/dynamic/public'
import { Client } from '@heroiclabs/nakama-js'

export class Nakama {
	public static client = new Client(
		env.PUBLIC_NAKAMA_SERVER_KEY,
		env.PUBLIC_NAKAMA_HOST,
		env.PUBLIC_NAKAMA_PORT && env.PUBLIC_NAKAMA_PORT.length ? env.PUBLIC_NAKAMA_PORT : '',
		env.PUBLIC_NAKAMA_USE_SSL === 'true' || env.PUBLIC_NAKAMA_USE_SSL === '1',
		10e3,
		true
	)
}
