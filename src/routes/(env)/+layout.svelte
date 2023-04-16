<script lang="ts">
	import Env from '$components/Common/Env.svelte'
	import { useThrelte } from '@threlte/core'

	const { renderer } = useThrelte()
	if (renderer) {
		renderer.toneMappingExposure = 0.734
	}
</script>

<Env />

<slot />
