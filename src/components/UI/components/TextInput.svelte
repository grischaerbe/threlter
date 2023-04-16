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
	<label class="mb-[5px]" for={id}>{label}</label>
	<input
		use:keyboardNavigationAction={{
			forceFocus: forceFocusOnMount,
			preventFocusOnFocusLost
		}}
		on:keydown={onInputKeyDown}
		class="pointer-events-auto w-full uppercase bg-transparent px-[10px] py-[5px] focus:outline-none border-orange border-2 rounded-md"
		{id}
		name={id}
		type="text"
		bind:value
		on:input
	/>
</div>
