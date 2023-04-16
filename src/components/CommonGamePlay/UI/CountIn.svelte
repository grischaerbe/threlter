<script lang="ts">
	import { createEventDispatcher, onDestroy, onMount } from 'svelte'
	import UiWrapper from '$components/UI/UiWrapper.svelte'
	import { scale } from 'svelte/transition'
	import { cubicOut } from 'svelte/easing'

	const dispatch = createEventDispatcher<{
		countindone: void
	}>()

	let currentCount = 3
	const interval = setInterval(() => {
		currentCount--
		if (currentCount === 0) {
			dispatch('countindone')
			clearInterval(interval)
		}
	}, 500)

	let mounted = false
	onMount(() => {
		mounted = true
	})

	onDestroy(() => {
		clearInterval(interval)
	})
</script>

<UiWrapper>
	<div class="flex flex-row justify-center items-center h-[66%] w-full text-[3em]">
		{#if mounted}
			<div
				in:scale={{
					start: 3,
					easing: cubicOut
				}}
				class="relative bg-orange leading-none px-[0.2em] rounded-md border-2 border-blue-darkest"
			>
				<div class="opacity-0">3</div>
			</div>
			{#key currentCount}
				<div
					in:scale={{
						start: 3,
						easing: cubicOut
					}}
					class="absolute font-headline text-blue-darkest tracking-normal text-center translate-y-[0.05em]"
				>
					<div>
						{#if currentCount === 0}
							GO!
						{:else}
							{currentCount}
						{/if}
					</div>
				</div>
			{/key}
		{/if}
	</div>
</UiWrapper>
