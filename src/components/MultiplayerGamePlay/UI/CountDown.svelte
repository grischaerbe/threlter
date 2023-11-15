<script lang="ts">
	import { readable } from 'svelte/store'
	import { formatTime } from '../../../lib/utils/formatters'
	import { c } from '../../../lib/utils/classes'

	/** Unix timestamp in milliseconds or seconds */
	export let countDownTo: number
	export let updateEvery: number = 1000
	export let includeMilliseconds = true

	$: isMilliseconds = countDownTo > 1000000000000

	const time = readable(new Date(), (set) => {
		const interval = setInterval(() => {
			set(new Date())
		}, updateEvery)

		return function stop() {
			clearInterval(interval)
		}
	})

	let _class = ''

	$: countDown = formatTime(
		(isMilliseconds ? countDownTo : countDownTo * 1000) - $time.getTime(),
		includeMilliseconds
	)
</script>

<p>
	{#each countDown as item}
		<span
			class={c('inline-flex justify-center', item === ':' || item === '.' ? 'w-auto' : 'w-[1ch]')}
		>
			{item}
		</span>
	{/each}
</p>
