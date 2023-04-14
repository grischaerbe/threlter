import { derived } from 'svelte/store'
import { gameState } from './app'
import { formatTime } from '$lib/utils/formatters'

export const getters = {
	game: {
		common: {
			time: {
				formattedTime: derived(gameState.common.time, (time) => formatTime(time))
			}
		}
	}
}
