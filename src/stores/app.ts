import { currentWritable } from '@threlte/core'
import { persist } from './utils'

export const appState = {
	visibility: currentWritable<'visible' | 'hidden'>('visible'),
	options: {
		debug: persist(currentWritable(false), 'tm-options-debug'),
		player: {
			name: persist(currentWritable(''), 'tm-options-player-name'),
			color: persist(currentWritable('#fe3d00'), 'tm-options-player-color')
		},
		audio: {
			music: persist(currentWritable(true), 'tm-options-audio-music'),
			sfx: persist(currentWritable(true), 'tm-options-audio-sfx')
		},
		video: {
			shadows: persist(currentWritable(true), 'tm-options-video-shadows'),
			postprocessing: persist(currentWritable(true), 'tm-options-video-postprocessing'),
			resolution: persist(
				currentWritable<'high' | 'medium' | 'low'>('high'),
				'tm-options-video-resolution'
			)
		}
	}
}
