<script lang="ts">
	import { useGamepad } from '@threlte/extras'
	import { useKeyDown } from '../../../hooks/useKeyDown'
	import type { Track } from '../../../lib/Track/Track'
	import BottomScreenTrackName from '../../UI/components/BottomScreenTrackName.svelte'
	import CurrentTime from '../../UI/components/CurrentTime.svelte'
	import SpecialButton from '../../UI/components/SpecialButton.svelte'
	import TopBarLayout from '../../UI/layouts/TopBarLayout.svelte'

	export let proceed: () => void
	export let restart: () => void
	export let track: Track
	export let time: number

	const gamepad = useGamepad()
	gamepad.start.on('press', proceed)
	useKeyDown('Escape', proceed)
	useKeyDown('p', proceed)
</script>

<BottomScreenTrackName title={track.trackName.current} />

<CurrentTime {time} />

<TopBarLayout>
	<SpecialButton slot="topbar-left" href="/menu/main">Menu</SpecialButton>
	<SpecialButton slot="topbar-center" forceFocusOnMount on:click={proceed}>Resume</SpecialButton>
	<SpecialButton slot="topbar-right" on:click={restart}>Restart</SpecialButton>
</TopBarLayout>
