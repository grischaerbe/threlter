<script lang="ts">
	import { onDestroy, onMount } from 'svelte'
	import { type Sound, useAudioProvider } from './AudioProvider.svelte'

	export let sound: Sound
	export let autostop = false
	export let volume = 1
	export let detune = 0

	const { playAudio } = useAudioProvider()

	let node: AudioBufferSourceNode

	onMount(() => {
		node = playAudio(sound, {
			volume,
			detune
		})
	})

	onDestroy(() => {
		if (autostop && node) {
			node.stop()
		}
	})
</script>
