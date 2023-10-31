import { type CurrentWritable, currentWritable } from '@threlte/core'
import { getContext, setContext } from 'svelte'
import type { Track } from '$lib/Track/Track'
import type { TrackElement } from '$lib/Track/TrackElement'
import type CameraControls from 'camera-controls'

type TrackEditorContext = {
	transformMode: CurrentWritable<'translate' | 'rotate'>
	transformSpace: CurrentWritable<'local' | 'world'>
	transformSnap: CurrentWritable<boolean>
	isDragging: CurrentWritable<boolean>
	track: Track
	currentlySelectedElement: CurrentWritable<TrackElement | undefined>
	cameraControls: CurrentWritable<CameraControls[]>
	activeCameraControls: CurrentWritable<CameraControls | undefined>
}

export const createTrackEditorContext = (track: Track) => {
	const context: TrackEditorContext = {
		transformMode: currentWritable('translate'),
		transformSpace: currentWritable('local'),
		transformSnap: currentWritable(false),
		isDragging: currentWritable(false),
		track,
		currentlySelectedElement: currentWritable(undefined),
		cameraControls: currentWritable([]),
		activeCameraControls: currentWritable(undefined)
	}

	setContext<TrackEditorContext>('track-editor-context', context)

	return context
}

export const useTrackEditor = () => {
	const context = getContext<TrackEditorContext>('track-editor-context')
	if (!context) {
		throw new Error('No track editor context found')
	}
	return context
}
