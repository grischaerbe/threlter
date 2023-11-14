<script lang="ts">
	import json from '../../CampaignTracks/gpt/1.json'
	import type { Track } from '../../lib/Track/Track'
	import { trackElementPrototypes } from '../TrackElements/elements'
	import SpecialButton from './components/SpecialButton.svelte'

	export let track: Track

	const isStringArray = (value: any): value is string[] => {
		return Array.isArray(value) && value.every((item) => typeof item === 'string')
	}

	const addTrackElements = () => {
		json.trackElements.forEach((trackElement) => {
			const keys = Object.keys(trackElementPrototypes)
			if (isStringArray(keys) && keys.includes(trackElement.t as any)) {
				const element = track.addTrackElement(trackElement.t as any)
				track.setTrackElementPosition(element.id, trackElement.p as any)
				track.setTrackElementRotation(element.id, [...(trackElement.r as any), 'XYZ'] as any)
			}
		})
	}
</script>

<SpecialButton on:click={addTrackElements}>Add Track</SpecialButton>
