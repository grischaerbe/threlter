<script lang="ts">
	import Card from '$components/UI/components/Card.svelte'
	import TopbarLayout from '$components/UI/layouts/TopBarLayout.svelte'
	import type { Track } from '$lib/Track/Track'
	import type { Leaderboard } from '../../../lib/Leaderboard/Leaderboard'
	import LeaderboardViewer from '../../../lib/Leaderboard/LeaderboardViewer.svelte'
	import BottomScreenTrackName from '../../UI/components/BottomScreenTrackName.svelte'
	import Key from '../../UI/components/Key.svelte'
	import SpecialButton from '../../UI/components/SpecialButton.svelte'

	export let proceed: () => void
	export let track: Track
	export let leaderboard: Leaderboard
</script>

<BottomScreenTrackName title={track.trackName} />
<TopbarLayout>
	<SpecialButton slot="topbar-left" preventFocusOnFocusLost href="/menu/main">Menu</SpecialButton>

	<SpecialButton slot="topbar-right" forceFocusOnMount on:click={proceed}>Start</SpecialButton>

	<div class="flex flex-col gap-[15px] items-start">
		<Card class="inline-block text-[0.9em] w-[18em]">
			<LeaderboardViewer {leaderboard} title="Weekly Leaderboard" />
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
				<div class="pointer-events-auto"><Key>Enter</Key></div>
				<div class="text-right">Reset</div>

				<hr />
				<div class="pointer-events-auto">
					<Key>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-[1.2em] w-[1.2em] block m-0 p-0 fill-current absolute"
							viewBox="0 0 256 256"
						>
							<path
								d="M216,40H68.53a16.08,16.08,0,0,0-13.72,7.77L9.14,123.88a8,8,0,0,0,0,8.24l45.67,76.11A16.08,16.08,0,0,0,68.53,216H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM61.67,204.12,68.53,200h0ZM216,200H68.53l-43.2-72,43.2-72H216ZM106.34,146.34,124.69,128l-18.35-18.34a8,8,0,0,1,11.32-11.32L136,116.69l18.34-18.35a8,8,0,0,1,11.32,11.32L147.31,128l18.35,18.34a8,8,0,0,1-11.32,11.32L136,139.31l-18.34,18.35a8,8,0,0,1-11.32-11.32Z"
							/>
						</svg>
						<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
					</Key>
				</div>
				<div class="text-right">Retire</div>

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
