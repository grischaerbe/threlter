<script lang="ts">
	import { useRender } from '@threlte/core'

	useRender(async ({ camera, renderer, scene }) => {
		renderer?.render(scene, camera.current)
	})
</script>
