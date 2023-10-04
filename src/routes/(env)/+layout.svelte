<script lang="ts">
	import Env from '$components/Common/Env.svelte'
	import { Suspense } from '@threlte/extras'
	import LoadingUi from '../../components/UI/LoadingUi.svelte'
</script>

<Suspense final>
	<LoadingUi slot="fallback" />

	<Env />

	<slot />
</Suspense>
