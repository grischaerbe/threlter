import { currentWritable } from '@threlte/core'
import { persist } from './utils'

export const appState = {
	visibility: currentWritable<'visible' | 'hidden'>('visible'),
	debug: currentWritable(false),
	options: {
		player: {
			name: persist(currentWritable(''), 'tm-options-player-name')
		},
		audio: {
			music: persist(currentWritable(true), 'tm-options-audio-music'),
			sfx: persist(currentWritable(true), 'tm-options-audio-sfx')
		},
		video: {
			shadows: persist(currentWritable(true), 'tm-options-video-shadows'),
			postprocessing: persist(currentWritable(true), 'tm-options-video-postprocessing')
		}
	}
}
