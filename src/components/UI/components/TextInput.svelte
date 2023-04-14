<script lang="ts">
	import { c } from '$lib/utils/classes'
	import { useKeyboardNavigation } from '../KeyboardNavigation.svelte'

	const { keyboardNavigationAction } = useKeyboardNavigation()

	export let preventFocusOnFocusLost = false
	export let forceFocusOnMount = false

	const onInputKeyDown = (e: KeyboardEvent) => {
		// stop propagation if key is left or right arrow key
		if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
			e.stopPropagation()
		}
	}

	export let value = ''
	export let id = ''
	export let label: string
	let _class = ''
	export { _class as class }
</script>

<div class={c('flex flex-col w-full', _class)}>
	<label for={id}>{label}</label>
	<input
		use:keyboardNavigationAction={{
			forceFocus: forceFocusOnMount,
			preventFocusOnFocusLost
		}}
		on:keydown={onInputKeyDown}
		class="pointer-events-auto w-full uppercase h-[1em]"
		{id}
		name={id}
		type="text"
		bind:value
		on:input
	/>
</div>

<style>
	input {
		@apply rounded-sm bg-[#e8e8e8] px-[2px] py-0 focus:bg-[#d6d6d6] focus:outline-none;
	}
</style>
