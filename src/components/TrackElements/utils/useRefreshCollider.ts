import { watch } from '@threlte/core'
import { tick } from 'svelte'
import { useTrackElement } from '../../TrackViewer/TrackElement.svelte'

export const useRefreshCollider = () => {
	const refreshFns: any[] = []

	const trackElement = useTrackElement()

	if (trackElement) {
		const { position, rotation } = trackElement

		watch([position, rotation], async () => {
			await tick()
			refreshFns.forEach((fn) => fn())
		})
	}

	return {
		refreshFns
	}
}
