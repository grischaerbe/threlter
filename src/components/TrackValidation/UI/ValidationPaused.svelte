<script lang="ts">
	import { useKeyDown } from '../../../hooks/useKeyDown'
	import type { TrackData } from '../../../lib/TrackData/TrackData'
	import BottomScreenTrackName from '../../UI/components/BottomScreenTrackName.svelte'
	import CurrentTime from '../../UI/components/CurrentTime.svelte'
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

<BottomScreenTrackName title={trackData.trackName.current} />

<CurrentTime {time} />

<TopBarLayout>
	<SpecialButton slot="topbar-left" href="/menu/main">Menu</SpecialButton>
	<SpecialButton slot="topbar-center" forceFocusOnMount on:click={proceed}>Resume</SpecialButton>
	<SpecialButton slot="topbar-right" on:click={restart}>Restart</SpecialButton>
</TopBarLayout>
