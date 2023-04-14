import { onDestroy } from 'svelte'
import { useKeyDown } from './useKeyDown'
import { actions } from '$stores/app'

export const useGameIsPausable = () => {
	useKeyDown('Escape', () => {
		actions.toggleGamePaused()
	})

	onDestroy(() => {
		actions.resumeGame()
	})
}
