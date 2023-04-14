<script lang="ts">
	import Env from '$components/Common/Env.svelte'
	import type { LayoutData } from './$types'

	export let data: LayoutData

	console.log('env layout')
</script>

<Env />

<slot />
