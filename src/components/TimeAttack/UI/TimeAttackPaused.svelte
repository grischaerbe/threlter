<script lang="ts">
	import { useKeyDown } from '../../../hooks/useKeyDown'
	import type { TrackData } from '../../../lib/TrackData/TrackData'
	import type { TrackRecord } from '../../../lib/TrackRecord/TrackRecord'
	import UiWrapper from '../../UI/UiWrapper.svelte'
	import FormattedTime from '../../UI/components/FormattedTime.svelte'
	import SpecialButton from '../../UI/components/SpecialButton.svelte'
	import TopBarLayout from '../../UI/layouts/TopBarLayout.svelte'

	export let proceed: () => void
	export let restart: () => void
	export let trackData: TrackData
	export let time: number

	useKeyDown('Escape', () => {
		proceed()
	})
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

<UiWrapper>
	<div
		class="absolute top-0 left-0 w-full flex flex-col justify-center items-center h-[28vh] tracking-widest font-segments pointer-events-auto text-[0.85em]"
	>
		<div class="backdrop-blur rounded-md px-[10px] py-[3px] bg-orange border-2 border-blue-darkest">
			<FormattedTime {time} class="text-blue-darkest leading-none font-bold" />
		</div>
	</div>
</UiWrapper>

<TopBarLayout>
	<SpecialButton slot="topbar-left" href="/menu/main">Menu</SpecialButton>
	<SpecialButton slot="topbar-center" forceFocusOnMount on:click={proceed}>Resume</SpecialButton>
	<SpecialButton slot="topbar-right" on:click={restart}>Restart</SpecialButton>
</TopBarLayout>
