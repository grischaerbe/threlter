<script lang="ts">
	import Card from '$components/UI/components/Card.svelte'
	import TopbarLayout from '$components/UI/layouts/TopBarLayout.svelte'
	import type { Track } from '$lib/Track/Track'
	import BottomScreenTrackName from '../../UI/components/BottomScreenTrackName.svelte'
	import Key from '../../UI/components/Key.svelte'
	import SpecialButton from '../../UI/components/SpecialButton.svelte'

	export let proceed: () => void
	export let track: Track
</script>

<BottomScreenTrackName title={track.trackName} />
<TopbarLayout>
	<SpecialButton slot="topbar-left" preventFocusOnFocusLost href="/menu/main">Menu</SpecialButton>

	<SpecialButton slot="topbar-right" forceFocusOnMount on:click={proceed}>Start</SpecialButton>

	<div class="flex flex-col gap-[15px] items-start">
		<Card class="inline-block text-[0.9em] w-[18em]">
			<!-- <TrackTimes {track} {trackRecord} /> -->
		</Card>
		<Card class="flex flex-col gap-[10px] w-max">
			<div class="font-headline">Controls</div>

			<div
				class="text-[0.65em] grid grid-cols-[auto_auto] gap-x-[25px] [&_hr]:col-span-2 [&_hr]:border-[1px] [&_hr]:border-orange [&_div]:py-[2px] items-center"
			>
				<div><Key>←</Key> <Key>→</Key> <Key>A</Key> <Key>D</Key></div>
				<div class="text-right">Steer</div>

				<hr />
				<div><Key>↑</Key> <Key>W</Key></div>
				<div class="text-right">Accelerate</div>

				<hr />
				<div><Key>↓</Key> <Key>S</Key></div>
				<div class="text-right">Brake</div>

				<hr />
				<div><Key>Enter</Key></div>
				<div class="text-right">Restart</div>

				<hr />
				<div>
					<Key>Esc</Key>
					or <Key>P</Key>
				</div>
				<div class="text-right">Menu</div>
			</div>
		</Card>
	</div>
</TopbarLayout>
