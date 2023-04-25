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
		class="absolute top-0 left-0 w-full h-full bg-black text-orange flex flex-col items-center justify-center font-headline gap-[10px] pointer-events-auto z-[10000]"
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
		{:else}
			<div
				class="w-[300px] h-[26px] bg-blue-darkest border-[3px] p-[4px] border-orange rounded-full relative flex flex-row items-center justify-start overflow-hidden"
			>
				<div class="overflow-hidden rounded-full top-0 left-0 w-full">
					<div
						id="animated-bar"
						style="width: 30%"
						class="min-w-[12px] w-full h-[12px] bg-orange rounded-full"
					/>
				</div>
			</div>
		{/if}
	</div>
</UiWrapper>

<style>
	@keyframes animated-bar {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(300px) translateX(100%);
		}
	}

	#animated-bar {
		animation: animated-bar 1.5s infinite;
	}
</style>
