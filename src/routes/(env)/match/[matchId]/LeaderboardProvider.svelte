<script lang="ts">
	import { onDestroy, onMount } from 'svelte'
	import { Leaderboard } from '../../../../lib/Leaderboard/Leaderboard'

	export let matchId: string
	export let poll: false | number = false

	let leaderboard: Leaderboard | undefined
	onMount(async () => {
		leaderboard = await Leaderboard.fromMatchId(matchId)
	})

	let interval: ReturnType<typeof setInterval> | undefined
	function doPoll() {
		leaderboard?.refresh()
	}

	$: if (typeof poll === 'number' && poll > 0) {
		clearInterval(interval) // Clear previous interval if any
		interval = setInterval(doPoll, poll)
	} else {
		clearInterval(interval)
	}

	onDestroy(() => {
		clearInterval(interval)
	})
</script>

<slot {leaderboard} />
