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
	export let placeholder = ''

	let _class = ''
	export { _class as class }

	export let inputClass = ''
	export let labelClass = ''
</script>

<div class={c('flex flex-col w-full', _class)}>
	<label class={c('mb-[5px]', labelClass)} for={id}>{label}</label>
	<input
		use:keyboardNavigationAction={{
			forceFocus: forceFocusOnMount,
			preventFocusOnFocusLost
		}}
		on:keydown={onInputKeyDown}
		class={c(
			'pointer-events-auto w-full bg-transparent px-[10px] py-[5px] focus:outline-none border-orange border-[3px] rounded-xl',
			inputClass
		)}
		{id}
		{placeholder}
		name={id}
		type="text"
		bind:value
		on:input
	/>
</div>
