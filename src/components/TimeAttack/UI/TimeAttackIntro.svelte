<script lang="ts">
	import Card from '$components/UI/components/Card.svelte'
	import TrackTimes from '$components/UI/components/TrackTimes.svelte'
	import TopbarLayout from '$components/UI/layouts/TopBarLayout.svelte'
	import type { TrackData } from '$lib/TrackData/TrackData'
	import type { TrackRecord } from '$lib/TrackRecord/TrackRecord'
	import { HTML } from '@threlte/extras'
	import UiWrapper from '../../UI/UiWrapper.svelte'
	import SpecialButton from '../../UI/components/SpecialButton.svelte'
	import BlurryCard from '../../UI/components/BlurryCard.svelte'

	export let proceed: () => void
	export let trackRecord: TrackRecord | undefined
	export let trackData: TrackData
</script>

<UiWrapper>
	<div
		class="absolute -z-10 h-[40vh] w-full bottom-0 left-0 bg-gradient-to-t from-blue-darkest to-transparent opacity-60"
	/>
	<div
		class="font-headline text-orange absolute bottom-[30px] left-1/2 -translate-x-1/2 text-[3em] text-center leading-[88%]"
	>
		{trackData.trackName.current}
	</div>
</UiWrapper>

<TopbarLayout>
	<SpecialButton slot="topbar-left" preventFocusOnFocusLost href="/menu/main">Menu</SpecialButton>
	<SpecialButton slot="topbar-right" forceFocusOnMount on:click={proceed}>Start</SpecialButton>
	<Card class="inline-block text-[0.9em]">
		<TrackTimes {trackData} {trackRecord} />
	</Card>
</TopbarLayout>
