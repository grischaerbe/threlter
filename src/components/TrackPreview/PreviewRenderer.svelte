<script lang="ts">
	import { useFrame } from '@threlte/core'
	import { onReveal } from '@threlte/extras'
	import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher<{
		render: void
	}>()

	const { start: render, stop } = useFrame(
		({ renderer, scene, camera }) => {
			renderer.render(scene, camera.current)
			dispatch('render')
			stop()
		},
		{
			order: Infinity,
			autostart: false
		}
	)

	onReveal(() => {
		render()
	})
</script>
