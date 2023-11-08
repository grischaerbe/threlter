import { watch } from '@threlte/core'
import { tick } from 'svelte'
import { useTrackElement } from '../../TrackViewer/TrackElement.svelte'
import { toReadable } from '../../../lib/utils/toStore'

export const useRefreshCollider = () => {
	const refreshFns: any[] = []

	const trackElement = useTrackElement()

	if (trackElement) {
		const position = toReadable(trackElement, 'position')
		const rotation = toReadable(trackElement, 'rotation')

		watch([position, rotation], async () => {
			await tick()
			console.log('refresh collider')
			refreshFns.forEach((fn) => fn())
		})
	}

	return {
		refreshFns
	}
}
