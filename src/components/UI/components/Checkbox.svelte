<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { c } from '$lib/utils/classes'
	import { appState } from '$stores/app'
	import { useKeyboardNavigation } from '../KeyboardNavigation.svelte'
	import { useAudioProvider } from '$components/Utilities/AudioProvider.svelte'

	export let checked = false
	export let forceFocusOnMount = false

	const { sfx } = appState.options.audio

	const { playAudio } = useAudioProvider()

	const dispatch = createEventDispatcher<{
		change: boolean
	}>()

	let _class = ''
	export { _class as class }

	const { keyboardNavigationAction } = useKeyboardNavigation()
</script>

<button
	use:keyboardNavigationAction={{
		forceFocus: forceFocusOnMount
	}}
	on:click={() => {
		checked = !checked
		dispatch('change', checked)
		if (!$sfx) return
		playAudio('buttonHover', {
			detune: 300
		})
	}}
	on:click
	on:pointerenter={() => {
		if (!$sfx) return
		playAudio('buttonHover', {
			detune: -300,
			volume: 0.3
		})
	}}
	class={c(
		'group rounded-sm relative text-orange uppercase [&_svg]:!fill-current flex flex-row gap-2 items-center justify-center [&_img]:block [&_img]:p-[2px] px-3 outline-none',
		_class
	)}
>
	<div class={c('aspect-square h-[0.9em] py-[2px] rounded-sm border-2 border-orange relative')}>
		<svg
			class={c(
				'w-full h-full absolute top-0 left-0',
				checked
					? 'opacity-100 group-hover:opacity-50 group-focus:opacity-50'
					: 'opacity-0 group-hover:opacity-20 group-focus:opacity-20'
			)}
			xmlns="http://www.w3.org/2000/svg"
			width="72"
			height="72"
			viewBox="0 0 256 256"
		>
			<path
				d="M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z"
			/>
		</svg>
	</div>
	<slot />
</button>
