import type { CurrentWritable } from '@threlte/core'
import { buildActions, createState, toCurrentReadable } from './utils'
import { TrackData } from '$lib/TrackData/TrackData'
import { TrackRecord } from '$lib/TrackRecord/TrackRecord'

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
	readonly state: CurrentWritable<'start-prompt' | 'intro' | 'menu' | 'game'>
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

type MenuState = {
	readonly state: CurrentWritable<'main' | 'user-tracks' | 'campaign' | 'options' | 'credits'>
}

type GameType = 'time-attack' | 'track-editor'

type GameState = {
	readonly gameType: CurrentWritable<GameType>
	readonly trackData: CurrentWritable<TrackData | undefined>
	readonly trackRecord: CurrentWritable<TrackRecord | undefined>
	readonly paused: CurrentWritable<boolean>
	readonly common: {
		readonly state: CurrentWritable<'intro' | 'count-in' | 'playing' | 'finished'>
		readonly showGhost: CurrentWritable<boolean>
		readonly time: CurrentWritable<number>
		readonly checkpointsReached: CurrentWritable<Set<string>>
		readonly lastCheckpoint: CurrentWritable<string | undefined>
		readonly finishReached: CurrentWritable<boolean>
	}
	readonly car: {
		readonly position: CurrentWritable<[number, number, number]>
		readonly quaternion: CurrentWritable<[number, number, number, number]>
	}
	readonly trackEditor: {
		readonly showInfo: CurrentWritable<boolean>
		readonly state: CurrentWritable<'editing' | 'validation'>
		readonly editing: {
			readonly view: CurrentWritable<'car' | 'orbit'>
		}
	}
}

/**
 * -----------------------------------------------------
 * App State
 * -----------------------------------------------------
 */
const _appState: AppState = {
	state: createState('start-prompt'),
	visibility: createState('visible'),
	debug: createState(false),
	options: {
		player: {
			name: createState('Player')
		},
		audio: {
			music: createState(true),
			sfx: createState(true)
		},
		video: {
			shadows: createState(true),
			postprocessing: createState(true)
		}
	}
}

/**
 * Immutable app state
 */
export const appState = {
	state: toCurrentReadable(_appState.state),
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

/**
 * -----------------------------------------------------
 * Menu State
 * -----------------------------------------------------
 */
const _menuState: MenuState = {
	state: createState('main')
}

/**
 * Immutable menu state
 */
export const menuState = {
	state: toCurrentReadable(_menuState.state)
}

/**
 * -----------------------------------------------------
 * Game State
 * -----------------------------------------------------
 */
const _gameState: GameState = {
	gameType: createState('time-attack'),
	trackData: createState(undefined),
	trackRecord: createState(undefined),
	paused: createState(false),
	common: {
		state: createState('intro'),
		showGhost: createState(true),
		time: createState(0),
		checkpointsReached: createState(new Set()),
		lastCheckpoint: createState(undefined),
		finishReached: createState(false)
	},
	car: {
		position: createState([0, 0, 0]),
		quaternion: createState([0, 0, 0, 0])
	},
	trackEditor: {
		showInfo: createState(true),
		state: createState('editing'),
		editing: {
			view: createState('orbit')
		}
	}
}

/**
 * Immutable game state
 */
export const gameState = {
	gameType: toCurrentReadable(_gameState.gameType),
	trackData: toCurrentReadable(_gameState.trackData),
	trackRecord: toCurrentReadable(_gameState.trackRecord),
	paused: toCurrentReadable(_gameState.paused),
	common: {
		state: toCurrentReadable(_gameState.common.state),
		showGhost: toCurrentReadable(_gameState.common.showGhost),
		time: toCurrentReadable(_gameState.common.time),
		checkpointsReached: toCurrentReadable(_gameState.common.checkpointsReached),
		lastCheckpoint: toCurrentReadable(_gameState.common.lastCheckpoint),
		finishReached: toCurrentReadable(_gameState.common.finishReached)
	},
	car: {
		position: toCurrentReadable(_gameState.car.position),
		quaternion: toCurrentReadable(_gameState.car.quaternion)
	},
	trackEditor: {
		showInfo: toCurrentReadable(_gameState.trackEditor.showInfo),
		state: toCurrentReadable(_gameState.trackEditor.state),
		editing: {
			view: toCurrentReadable(_gameState.trackEditor.editing.view)
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
		},

		/**
		 * -----------------------------------------------------
		 * Menu Actions
		 * -----------------------------------------------------
		 */
		goToAppIntro: () => {
			_appState.state.set('menu')
			_appState.state.set('intro')
		},

		goToMainMenu: () => {
			_appState.state.set('menu')
			_menuState.state.set('main')
		},

		goToCampaignMenu: () => {
			_appState.state.set('menu')
			_menuState.state.set('campaign')
		},

		goToUserTracksMenu: () => {
			_appState.state.set('menu')
			_menuState.state.set('user-tracks')
		},

		goToOptionsMenu: () => {
			_appState.state.set('menu')
			_menuState.state.set('options')
		},

		goToCreditsMenu: () => {
			_appState.state.set('menu')
			_menuState.state.set('credits')
		},

		/**
		 * -----------------------------------------------------
		 * TrackData Actions
		 * -----------------------------------------------------
		 */

		loadTrackDataFromServer: async (trackId: string, callback: (trackData: TrackData) => void) => {
			_appState.state.set('game')
			_gameState.trackData.set(undefined)
			const trackData = await TrackData.fromServer(trackId)
			_gameState.trackData.set(trackData)
			actions.loadTrackRecord()
			callback(trackData)
		},

		loadTrackDataFromLocalStorage: (trackId: string, callback: (trackData?: TrackData) => void) => {
			_appState.state.set('game')
			_gameState.trackData.set(undefined)
			const trackData = TrackData.fromLocalStorage(trackId)
			_gameState.trackData.set(trackData)
			actions.loadTrackRecord()
			callback(trackData)
		},

		loadEmptyTrackData: (callback: (trackData: TrackData) => void) => {
			_appState.state.set('game')
			const trackData = TrackData.createEmpty()
			_gameState.trackData.set(trackData)
			actions.loadTrackRecord()
			callback(trackData)
		},

		setTrackData: (trackData: TrackData, callback: (trackData: TrackData) => void) => {
			_appState.state.set('game')
			_gameState.trackData.set(trackData)
			actions.loadTrackRecord()
			callback(trackData)
		},

		/**
		 * -----------------------------------------------------
		 * TrackRecord Actions
		 * -----------------------------------------------------
		 */

		loadTrackRecord: () => {
			if (!_gameState.trackData.current) {
				return { invalid: 'No TrackData loaded' }
			}
			const trackRecord = TrackRecord.fromLocalStorage(_gameState.trackData.current)
			_gameState.trackRecord.set(trackRecord)
		},

		setTrackRecord: (trackRecord: TrackRecord) => {
			if (!_gameState.trackData.current) {
				return { invalid: 'No TrackData loaded' }
			}
			if (
				TrackRecord.makeTrackRecordId(_gameState.trackData.current) !== trackRecord.trackRecordId
			) {
				return { invalid: 'TrackRecord does not match TrackData' }
			}
			if (
				_gameState.trackRecord?.current?.time.current !== undefined &&
				_gameState.trackRecord?.current?.time.current < trackRecord.time.current
			) {
				return { invalid: 'TrackRecord time is slower than current record' }
			}
			_gameState.trackRecord.set(trackRecord)
			trackRecord.saveToLocalStorage()
		},

		/**
		 * -----------------------------------------------------
		 * Common Gameplay Actions
		 * -----------------------------------------------------
		 */

		resetGameTime: () => {
			_gameState.common.time.set(0)
		},

		/**
		 * The time is incremented to prevent accidentally setting it higher in the
		 * event of a game pause or other situations.
		 * This action does not emit an event!
		 */
		incrementGameTime: (time: number) => {
			if (_gameState.common.finishReached.current) {
				return { debug: false, invalid: true }
			}
			_gameState.common.time.update((t) => t + time)
			return { debug: false }
		},

		checkpointReached: (trackElementId: string) => {
			if (_gameState.common.checkpointsReached.current.has(trackElementId)) {
				return { invalid: true }
			}
			_gameState.common.checkpointsReached.update((set) => {
				set.add(trackElementId)
				return set
			})
			_gameState.common.lastCheckpoint.set(trackElementId)
		},

		clearCheckpoints: () => {
			_gameState.common.finishReached.set(false)
			_gameState.common.checkpointsReached.update((set) => {
				set.clear()
				return set
			})
			_gameState.common.lastCheckpoint.set(undefined)
		},

		finishReached: () => {
			/**
			 * If the player hasn't reached all checkpoints, the finish is invalid.
			 */
			if (
				_gameState.trackData.current?.checkpointCount.current !==
				_gameState.common.checkpointsReached.current.size
			) {
				return { invalid: true }
			}

			/**
			 * If the finish has already been reached, the finish is invalid.
			 */
			if (_gameState.common.finishReached.current) {
				return { invalid: true }
			}

			_gameState.common.finishReached.set(true)

			/**
			 * Set the game state to finished.
			 */
			_gameState.common.state.set('finished')
		},

		clearFinish: () => {
			_gameState.common.finishReached.set(false)
		},

		resetCar: () => {
			if (_gameState.common.finishReached.current) {
				return { invalid: true }
			}
		},

		setCarPosition: (position: [number, number, number]) => {
			_gameState.car.position.set(position)
			return { debug: false }
		},

		setCarQuaternion: (quaternion: [number, number, number, number]) => {
			_gameState.car.quaternion.set(quaternion)
			return { debug: false }
		},

		goToIntro: () => {
			actions.resetGameplay()
			_gameState.common.state.set('intro')
		},

		goToCountIn: () => {
			actions.resetGameplay()
			_gameState.common.state.set('count-in')
		},

		startPlaying: () => {
			actions.resetGameplay()
			_gameState.common.state.set('playing')
		},

		/**
		 * Resets the common game state to its initial state.
		 * Includes:
		 * - Time elapsed
		 * - Checkpoints reached and last checkpoint
		 * - Finish reached
		 * - Car position
		 */
		resetGameplay: () => {
			actions.resetGameTime()
			actions.clearCheckpoints()
			actions.clearFinish()
			actions.resetCar()
		},

		setShowGhost: (show: boolean) => {
			_gameState.common.showGhost.set(show)
		},

		/**
		 * -----------------------------------------------------
		 * Time Attack Actions
		 * -----------------------------------------------------
		 */
		startTimeAttack: () => {
			_appState.state.set('game')
			_gameState.paused.set(false)
			_gameState.gameType.set('time-attack')
			actions.goToIntro()
		},

		/**
		 * -----------------------------------------------------
		 * Track Editor Actions
		 * -----------------------------------------------------
		 */

		startTrackEditor: () => {
			_appState.state.set('game')
			_gameState.paused.set(false)
			_gameState.gameType.set('track-editor')
			_gameState.trackEditor.state.set('editing')
			_gameState.trackEditor.editing.view.set('orbit')
		},

		showTrackEditorInfo: () => {
			_gameState.trackEditor.showInfo.set(true)
		},

		hideTrackEditorInfo: () => {
			_gameState.trackEditor.showInfo.set(false)
		},

		setTrackEditorView: (view: 'orbit' | 'car') => {
			_gameState.trackEditor.editing.view.set(view)
		},

		startTrackValidation: () => {
			_gameState.trackEditor.state.set('validation')
			actions.goToIntro()
		},

		pauseGame: () => {
			_gameState.paused.set(true)
		},

		resumeGame: () => {
			_gameState.paused.set(false)
		},

		toggleGamePaused: () => {
			if (_gameState.paused.current) actions.resumeGame()
			else actions.pauseGame()
		}
	},
	{ debug: true }
)

export const printState = () => {
	console.log(
		JSON.stringify(
			{
				appState: appState,
				menuState: menuState,
				gameState: gameState
			},
			null,
			2
		)
	)
}

// OBSOLETE, DOESNT WORK WITH NON-PRIMITIVE VALUES

// export const saveStateToLocalStorage = () => {
//   console.log('saving state to local storage')
//   localStorage.setItem('appState', JSON.stringify(appState))
//   localStorage.setItem('menuState', JSON.stringify(menuState))
//   localStorage.setItem('gameState', JSON.stringify(gameState))
// }

// export const loadStateFromLocalStorage = () => {
//   console.log('loading state from local storage')
//   const loadedAppState = JSON.parse(localStorage.getItem('appState') ?? '')
//   const loadedMenuState = JSON.parse(localStorage.getItem('menuState') ?? '')
//   const loadedGameState = JSON.parse(localStorage.getItem('gameState') ?? '')

//   // recursively set state values. If the value is an object, call this function again,
//   // otherwise, set the value on the state at the path the object is at.
//   const setStateValue = (state: any, data: any, currentPath = '') => {
//     const currentPathParts = currentPath.split('.').filter((p) => p.length)
//     const currentData = currentPathParts.reduce((acc, p) => acc[p], data)
//     for (const key in currentData) {
//       // if (key === 'trackEditor') debugger
//       if (data[key] instanceof Object) {
//         if (currentPath.length) {
//           currentPath += '.' + key
//         } else {
//           currentPath += key
//         }
//         setStateValue(state, data, currentPath)
//       } else {
//         const currentState = currentPathParts.reduce((acc, p) => acc[p], state)
//         currentState[key].set(currentData[key])
//       }
//     }
//   }

//   setStateValue(_appState, loadedAppState)
//   setStateValue(_menuState, loadedMenuState)
//   setStateValue(_gameState, loadedGameState)
// }
