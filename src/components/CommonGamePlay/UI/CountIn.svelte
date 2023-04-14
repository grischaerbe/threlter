<script lang="ts">
	import { createEventDispatcher, onDestroy } from 'svelte'
	import UiWrapper from '$components/UI/UiWrapper.svelte'

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

	onDestroy(() => {
		clearInterval(interval)
	})
</script>

<UiWrapper>
	<div class="flex flex-col justify-center items-center h-[33vh] tracking-widest">
		<div>{currentCount}</div>
	</div>
</UiWrapper>
