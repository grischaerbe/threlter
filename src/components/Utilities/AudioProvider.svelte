<!-- prettier-ignore -->
<script lang="ts" context="module">
	const sounds = {
		buttonClick: '/sfx/button-click.mp3',
		buttonHover: '/sfx/button-hover.mp3',
		engine: '/engine6.wav',
	}

	export type Sound = keyof typeof sounds

  type AudioProviderContext = {
    playAudio: (src: Sound, options?: { volume?: number, detune?: number }) => AudioBufferSourceNode
  }

	export const useAudioProvider = () => {
		const context = getContext<AudioProviderContext>('audio-provider-context')
		if (!context) {
			throw new Error('AudioProviderContext not found')
		}
		return context
	}

	export const preloadSounds = () => {
		const loader = useLoader(AudioLoader)
		return Promise.all(Object.values(sounds).map((src) => loader.load(src)))
	}
</script>

<script lang="ts">
	import { useLoader } from '@threlte/core'
	import { useAudioListener } from '@threlte/extras'
	import { getContext, setContext } from 'svelte'
	import { AudioLoader } from 'three'

	const loader = useLoader(AudioLoader)

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

	const playAudio = (sound: Sound, options?: { volume?: number; detune?: number }) => {
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
