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
	export let style: 'regular' | 'green' | 'green-inverted' | 'inverted' | 'red' | 'red-inverted' =
		'regular'

	export const styles: Record<typeof style, string> = {
		regular: 'text-orange bg-blue-darkest hover:bg-blue-darker focus:bg-blue-darker',
		inverted: 'text-blue-darkest bg-orange hover:text-blue-darker focus:text-blue-darker',
		green: 'text-green-500 bg-blue-950 hover:bg-blue-darker focus:bg-blue-darker',
		'green-inverted': 'text-blue-950 bg-green-500 hover:text-blue-darker focus:text-blue-darker',
		red: 'text-red-500 bg-blue-950 hover:bg-blue-darker focus:bg-blue-darker',
		'red-inverted': 'text-blue-950 bg-red-500 hover:text-blue-darker focus:text-blue-darker'
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
	on:focus={onPointerEnter}
	on:click={onClick}
	on:click
	{disabled}
	class={c(
		'text-center uppercase font-headline rounded-xl px-[0.4em] pb-[0.13em] pt-[0.2em] leading-none border-[3px] border-current pointer-events-auto outline-none [&_svg]:fill-current [&_svg]:w-[1em] [&_svg]:h-[1em] flex flex-row gap-[10px] justify-center items-center',
		styles[style],
		_class
	)}
>
	<slot />
</svelte:element>
