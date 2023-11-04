<script lang="ts" context="module">
	export const useTrackElement = () => {
		return getContext<TrackElement | undefined>('track-element')
	}
</script>

<script lang="ts">
	import { getContext, setContext, type SvelteComponent } from 'svelte'

	import type { TrackElement } from '$lib/Track/TrackElement'
	import { toReadable } from '../../lib/utils/toStore'
	import { trackElementPrototypes } from '../TrackElements/elements'

	export let trackElement: TrackElement

	setContext<TrackElement>('track-element', trackElement)

	const type = toReadable(trackElement, 'type')

	$: component = trackElementPrototypes[$type].component as typeof SvelteComponent<
		any,
		any,
		{
			selection: {}
		}
	>
</script>

<svelte:component this={component}>
	<slot slot="selection" name="track-element-selection" />
</svelte:component>
