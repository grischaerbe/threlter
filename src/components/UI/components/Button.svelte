<script lang="ts">
	import { useAudioProvider } from '$components/Utilities/AudioProvider.svelte'
	import { c } from '$lib/utils/classes'
	import { appState } from '$stores/app'
	import { useKeyboardNavigation } from '../KeyboardNavigation.svelte'

	export let href: string | undefined = undefined
	export let disabled = false
	export let audioCues = true
	export let preventFocusOnFocusLost = false
	export let forceFocusOnMount = false
	export let style: 'regular' | 'inverted' | 'grey' | 'green' | 'red' = 'regular'

	const styles: Record<typeof style, string> = {
		regular:
			'bg-blue-darkest text-orange hover:bg-blue-darker focus:bg-blue-darker disabled:!bg-[#e8e8e8] disabled:!text-black',
		inverted:
			'bg-black text-white hover:bg-[#e8e8e8] hover:text-black focus:bg-[#e8e8e8] focus:text-black disabled:!bg-[#505050] disabled:!text-[#e8e8e8]',
		grey: 'bg-[#e8e8e8] hover:bg-[#d6d6d6] focus:bg-[#d6d6d6] text-black disabled:!bg-[#e8e8e8] disabled:!text-[#505050]',
		green:
			'bg-green-500 text-black hover:bg-green-400 focus:bg-green-400 disabled:!bg-green-600 disabled:!text-[#505050]',
		red: 'bg-red-500 text-blue-950 hover:text-blue-900 focus:text-blue-900 disabled:!bg-red-600 disabled:!text-[#505050]'
	}

	const { sfx } = appState.options.audio

	let _class = ''
	export { _class as class }

	const { playAudio } = useAudioProvider()

	const onPointerEnter = async () => {
		if (disabled) return
		if (!$sfx) return
		if (!audioCues) return
		playAudio('buttonHover', {
			detune: -300,
			volume: 0.23
		})
	}

	const onClick = async () => {
		if (disabled) return
		if (!$sfx) return
		if (!audioCues) return
		playAudio('buttonHover', {
			detune: 300,
			volume: 0.8
		})
	}

	const { keyboardNavigationAction } = useKeyboardNavigation()
</script>

<svelte:element
	this={href ? 'a' : 'button'}
	{href}
	use:keyboardNavigationAction={{
		forceFocus: forceFocusOnMount,
		preventFocusOnFocusLost: preventFocusOnFocusLost
	}}
	on:pointerenter={onPointerEnter}
	on:click={onClick}
	on:click
	{disabled}
	class={c(
		'text-[0.8em] text-center rounded-xl border-[3px] border-current normal-case [&_svg]:!fill-current flex flex-row gap-2 items-center justify-center [&_img]:block [&_img]:p-[2px] outline-none px-3 py-1 [&_svg]:h-[1em] [&_svg]:w-[1em] [&_img]:h-[1em] [&_img]:w-[1em] leading-none',
		styles[style],
		_class
	)}
>
	<slot />
</svelte:element>
