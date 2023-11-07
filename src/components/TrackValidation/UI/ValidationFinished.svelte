<script lang="ts">
	import { goto } from '$app/navigation'
	import Card from '$components/UI/components/Card.svelte'
	import TrackTimes from '$components/UI/components/TrackTimes.svelte'
	import TopbarLayout from '$components/UI/layouts/TopBarLayout.svelte'
	import { tick } from 'svelte'
	import type { UserTrack } from '../../../lib/Track/UserTrack'
	import { TrackManager } from '../../../lib/TrackManager/TrackManager'
	import type { TrackRecordsManager } from '../../../lib/TrackRecord/TrackRecordsManager'
	import TrackPreview from '../../TrackPreview/TrackPreview.svelte'
	import BottomScreenTrackName from '../../UI/components/BottomScreenTrackName.svelte'
	import SpecialButton from '../../UI/components/SpecialButton.svelte'

	export let track: UserTrack
	export let trackRecordsManager: TrackRecordsManager

	track.userTrackRecord = trackRecordsManager.personalRecord

	let publishing = false

	export let restart: () => void

	const publish = async () => {
		if (publishing) return
		await TrackManager.publishUserTrack(track)
		renderThumbnail = true
	}

	let renderThumbnail = false

	const onBlob = async (event: CustomEvent<Blob>) => {
		const { headers, presignedPutUrl } = await TrackManager.getTrackThumbnailUploadUrl(
			track.trackId
		)
		await fetch(presignedPutUrl, {
			method: 'PUT',
			body: event.detail,
			headers
		})
		goto(`/menu/my-tracks/${track.trackId}`)
	}
</script>

{#if renderThumbnail}
	<TrackPreview {track} on:blob={onBlob} />
{/if}

<BottomScreenTrackName title={track.trackName} />

<TopbarLayout>
	<SpecialButton slot="topbar-left" preventFocusOnFocusLost href="/menu/main">Menu</SpecialButton>
	<slot slot="topbar-right">
		<div class="flex gap-[5px]">
			<SpecialButton forceFocusOnMount on:click={restart}>Restart</SpecialButton>
			{#if trackRecordsManager.current}
				<SpecialButton on:click={publish}>{publishing ? 'Publishing …' : 'Publish'}</SpecialButton>
			{/if}
		</div>
	</slot>
	<Card class="inline-block text-[0.9em]">
		<TrackTimes {track} />
	</Card>
</TopbarLayout>
