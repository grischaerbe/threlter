import { Client } from '@heroiclabs/nakama-js'

export class Nakama {
	public static client = new Client('defaultkey', '127.0.0.1', '7350')
}
