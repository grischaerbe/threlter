<script lang="ts">
	import { useSuspense } from '@threlte/extras'
	import type { UserTrack } from '../../../../lib/Track/UserTrack'
	import { TrackManager } from '../../../../lib/TrackManager/TrackManager'
	import { error } from '@sveltejs/kit'

	export let trackId: string

	const suspend = useSuspense()

	let track: UserTrack

	const loadTrack = async () => {
		const newTrack = await suspend(
			TrackManager.getUserTrack(trackId, TrackManager.FetchIntent.Play)
		)
		if (newTrack) track = newTrack
		else throw error(404, 'Track not found')
	}

	$: trackId, loadTrack()
</script>

{#if track}
	<slot {track} />
{/if}
