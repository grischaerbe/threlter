<script lang="ts">
	import { useThrelte } from '@threlte/core'
	import { onDestroy } from 'svelte'
	import { Color } from 'three'

	const { scene } = useThrelte()

	let oldSceneBackground = scene.background
	scene.background = new Color('#577AAC')

	onDestroy(() => {
		scene.background = oldSceneBackground
	})
</script>
