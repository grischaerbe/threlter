<script lang="ts" context="module">
	export const useTrackElement = () => {
		return getContext<TrackElement | undefined>('track-element')
	}
</script>

<script lang="ts">
	import { getContext, setContext } from 'svelte'

	import type { TrackElement } from '$lib/Track/TrackElement'
	import { trackElementPrototypes } from '../TrackElements/elements'
	import { toReadable } from '../../lib/utils/toStore'

	export let trackElement: TrackElement

	setContext<TrackElement>('track-element', trackElement)

	const type = toReadable(trackElement, 'type')

	$: component = trackElementPrototypes[$type].component
</script>

<svelte:component this={component}>
	<slot slot="selection" name="track-element-selection" />
</svelte:component>
