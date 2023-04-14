import type { CurrentWritable } from '@threlte/core'
import { buildActions, createState, toCurrentReadable } from './utils'

/**
 * -----------------------------------------------------
 * STATE
 * -----------------------------------------------------
 *
 * To truly isolate state manipulation from consumption,
 * the states in this file only return read-only stores and
 * manipulating the state is only possible through "actions".
 *
 * Some of the actions also implement event emitters because some
 * logic cannot be implemented in the stores alone.
 */

type AppState = {
	readonly visibility: CurrentWritable<'visible' | 'hidden'>
	readonly debug: CurrentWritable<boolean>
	readonly options: {
		readonly player: {
			readonly name: CurrentWritable<string>
		}
		readonly audio: {
			readonly music: CurrentWritable<boolean>
			readonly sfx: CurrentWritable<boolean>
		}
		readonly video: {
			readonly shadows: CurrentWritable<boolean>
			readonly postprocessing: CurrentWritable<boolean>
		}
	}
}

/**
 * -----------------------------------------------------
 * App State
 * -----------------------------------------------------
 */
const _appState: AppState = {
	visibility: createState('visible'),
	debug: createState(false),
	options: {
		player: {
			name: createState(localStorage.getItem('tm-options-player-name') ?? '')
		},
		audio: {
			music: createState(JSON.parse(localStorage.getItem('tm-options-audio-music') ?? 'true')),
			sfx: createState(JSON.parse(localStorage.getItem('tm-options-audio-sfx') ?? 'true'))
		},
		video: {
			shadows: createState(JSON.parse(localStorage.getItem('tm-options-video-shadows') ?? 'true')),
			postprocessing: createState(
				JSON.parse(localStorage.getItem('tm-options-video-postprocessing') ?? 'true')
			)
		}
	}
}

/**
 * Immutable app state
 */
export const appState = {
	visibility: toCurrentReadable(_appState.visibility),
	debug: toCurrentReadable(_appState.debug),
	options: {
		player: {
			name: toCurrentReadable(_appState.options.player.name)
		},
		audio: {
			music: toCurrentReadable(_appState.options.audio.music),
			sfx: toCurrentReadable(_appState.options.audio.sfx)
		},
		video: {
			shadows: toCurrentReadable(_appState.options.video.shadows),
			postprocessing: toCurrentReadable(_appState.options.video.postprocessing)
		}
	}
}

export const actions = buildActions(
	{
		/**
		 * -----------------------------------------------------
		 * App Actions
		 * -----------------------------------------------------
		 */

		setDebug: (debug: boolean) => {
			_appState.debug.set(debug)
		},

		toggleDebug: () => {
			_appState.debug.set(!_appState.debug.current)
		},

		setVisibility: (visibility: 'visible' | 'hidden') => {
			_appState.visibility.set(visibility)
		},

		setMusic: (music: boolean) => {
			localStorage.setItem('tm-options-audio-music', JSON.stringify(music))
			_appState.options.audio.music.set(music)
		},

		setSfx: (sfx: boolean) => {
			localStorage.setItem('tm-options-audio-sfx', JSON.stringify(sfx))
			_appState.options.audio.sfx.set(sfx)
		},

		setShadows: (shadows: boolean) => {
			localStorage.setItem('tm-options-video-shadows', JSON.stringify(shadows))
			_appState.options.video.shadows.set(shadows)
		},

		setPostprocessing: (postprocessing: boolean) => {
			localStorage.setItem('tm-options-video-postprocessing', JSON.stringify(postprocessing))
			_appState.options.video.postprocessing.set(postprocessing)
		},

		setPlayerName: (name: string) => {
			if (!name.length) return { invalid: true }
			localStorage.setItem('tm-options-player-name', name)
			_appState.options.player.name.set(name)
		}
	},
	{ debug: true }
)
