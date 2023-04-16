<script lang="ts">
	import { AutoColliders } from '@threlte/rapier'
	import { useRefreshCollider } from '../useRefreshCollider'

	const { refreshFns } = useRefreshCollider()
</script>

<AutoColliders shape="trimesh" bind:refresh={refreshFns[0]}>
	<slot />
</AutoColliders>
