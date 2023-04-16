<script lang="ts">
	import { c } from '../../../lib/utils/classes'
	import { formatTime } from '../../../lib/utils/formatters'

	export let time: number

	let _class = ''
	export { _class as class }

	$: formattedTime = formatTime(time).split('')

	const pointationIndices = [2, 5]
</script>

<!-- force into mono space -->
<div class={c('font-segments', _class)}>
	{#each new Array(9).fill(0) as _, index}
		<span
			class={c(
				'inline-flex flex-row justify-center',
				pointationIndices.includes(index) ? '' : ' w-[0.9em]'
			)}
		>
			{formattedTime[index]}
		</span>
	{/each}
</div>

<style>
	div {
		font-variant-numeric: tabular-nums lining-nums;
	}
</style>
