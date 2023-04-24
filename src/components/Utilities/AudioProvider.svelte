<!-- prettier-ignore -->
<script lang="ts" context="module">
	const sounds = {
		buttonClick: '/sfx/button-click.mp3',
		buttonHover: '/sfx/button-hover.mp3',
		success1: '/sfx/success1.mp3',
		success2: '/sfx/success2.mp3',
		engine: '/engine6.wav',
		'crowd-cheering': '/sfx/crowd-cheering.mp3',
		'count-in-beep-low': '/sfx/count-in-beep-low.wav',
		'count-in-beep-high': '/sfx/count-in-beep-high.wav',
	}

	export type Sound = keyof typeof sounds

  type AudioProviderContext = {
    playAudio: (src: Sound, options?: { volume?: number, detune?: number }) => AudioBufferSourceNode | undefined
  }

	export const useAudioProvider = () => {
		const context = getContext<AudioProviderContext>('audio-provider-context')
		if (!context) {
			throw new Error('AudioProviderContext not found')
		}
		return context
	}
</script>

<script lang="ts">
	import { afterNavigate, beforeNavigate } from '$app/navigation'

	import { useLoader } from '@threlte/core'
	import { useAudioListener, useSuspense } from '@threlte/extras'
	import { getContext, setContext } from 'svelte'
	import { AudioLoader } from 'three'

	const suspend = useSuspense()
	const loader = useLoader(AudioLoader)
	suspend(Promise.all(Object.values(sounds).map((src) => loader.load(src))))

	const { context: audioContext } = useAudioListener()

	const attackBuffer = async (
		node: AudioBufferSourceNode,
		sound: Sound,
		options?: { volume?: number; detune?: number }
	) => {
		const src = sounds[sound]
		const audioBuffer = await loader.load(src)
		node.buffer = audioBuffer
		node.detune.value = options?.detune ?? 0
		const volume = options?.volume ?? 1
		const nodes: AudioNode[] = [node]
		let destination: AudioNode = audioContext.destination
		if (volume !== 1) {
			const gainNode = audioContext.createGain()
			nodes.push(gainNode)
			gainNode.gain.value = volume
			gainNode.connect(audioContext.destination)
			destination = gainNode
		}
		node.connect(destination)
		node.onended = () => {
			nodes.forEach((node) => node.disconnect())
		}
		node.start()
	}

	let hasNavigated = false
	let timeout: ReturnType<typeof setTimeout>

	beforeNavigate(() => {
		clearTimeout(timeout)
		hasNavigated = true
	})

	afterNavigate(() => {
		clearTimeout(timeout)
		timeout = setTimeout(() => {
			hasNavigated = false
		}, 100)
	})

	const playAudio = (sound: Sound, options?: { volume?: number; detune?: number }) => {
		// we're not playing buttonHover after navigation
		if ((hasNavigated && sound === 'buttonHover') || sound === 'buttonClick') {
			return
		}

		const source = audioContext.createBufferSource()
		attackBuffer(source, sound, options)
		return source
	}

	const context: AudioProviderContext = {
		playAudio
	}

	setContext<AudioProviderContext>('audio-provider-context', context)
</script>

<slot />
