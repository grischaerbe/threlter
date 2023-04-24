<script lang="ts">
	import Env from '$components/Common/Env.svelte'
	import { useThrelte } from '@threlte/core'
	import { Suspense } from '@threlte/extras'
	import LoadingUi from '../../components/UI/LoadingUi.svelte'

	const { renderer } = useThrelte()
	if (renderer) {
		renderer.toneMappingExposure = 0.734
	}
</script>

<Suspense final>
	<LoadingUi slot="fallback" />

	<Env />

	<slot />
</Suspense>
