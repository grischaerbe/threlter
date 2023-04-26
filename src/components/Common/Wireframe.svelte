<script lang="ts">
	import { useThrelte } from '@threlte/core'
	import { onDestroy } from 'svelte'
	import { MeshBasicMaterial } from 'three'

	const { scene } = useThrelte()

	const wireframeMat = new MeshBasicMaterial({
		wireframe: true,
		color: 'black'
	})

	scene.overrideMaterial = wireframeMat

	onDestroy(() => {
		scene.overrideMaterial = null
	})
</script>
