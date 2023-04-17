<script lang="ts">
	import Button from '$components/UI/components/Button.svelte'
	import Card from '$components/UI/components/Card.svelte'
	import TopbarLayout from '$components/UI/layouts/TopBarLayout.svelte'
	import type { TrackData } from '$lib/TrackData/TrackData'
	import BottomScreenTrackName from '../../UI/components/BottomScreenTrackName.svelte'
	import SpecialButton from '../../UI/components/SpecialButton.svelte'

	export let proceed: () => void
	export let trackData: TrackData
</script>

<BottomScreenTrackName title={trackData.trackName.current} />

<TopbarLayout>
	<SpecialButton slot="topbar-left" preventFocusOnFocusLost href="/menu/main">Menu</SpecialButton>

	<SpecialButton slot="topbar-right" forceFocusOnMount on:click={proceed}>Start</SpecialButton>

	<div class="absolute top-0 left-0 w-full h-full">
		<Card class="flex flex-col gap-[15px] max-w-[30ch]">
			<div class="font-headline">Track validation</div>

			<div class="text-[0.65em]">
				<p class="mb-[10px]">
					To play a track, you need to validate it first. Only on validated tracks you can set a new
					record and compete with other players.
				</p>

				<p>
					When validating a track, you also will set the first record for this track, the so called
					"author time". This time will be used as a reference for other players.
				</p>

				<p />
			</div>
		</Card>
	</div>
</TopbarLayout>
