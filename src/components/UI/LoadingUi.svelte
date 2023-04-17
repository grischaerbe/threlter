<script lang="ts">
	import { tweened } from 'svelte/motion'
	import UiWrapper from './UiWrapper.svelte'

	/**
	 * Normalized percentage of loading progress (0-1)
	 * @type {number}
	 */
	export let progress: number | undefined = undefined

	const progressSpring = tweened(progress ?? 0, {
		duration: 100
	})
	$: progressSpring.set(progress ?? 0)
</script>

<UiWrapper>
	<div
		class="absolute top-0 left-0 w-full h-full bg-black text-orange flex flex-col items-center justify-center font-headline gap-[10px] pointer-events-auto"
	>
		LOADING

		{#if progress !== undefined}
			<div
				class="w-[300px] h-[26px] bg-blue-darkest border-[3px] p-[4px] border-orange rounded-full relative flex flex-row items-center justify-start"
			>
				<div
					style="width: {$progressSpring * 100}%"
					class="min-w-[12px] w-full h-[12px] bg-orange rounded-full"
				/>
			</div>
		{/if}
	</div>
</UiWrapper>
