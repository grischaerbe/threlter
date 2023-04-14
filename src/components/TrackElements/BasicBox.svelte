<script lang="ts" context="module">
	const geometry = new BoxGeometry(10, 10, 10)
	const material = new MeshStandardMaterial({
		roughness: 0.4
	})

	export const preloadBasicBox = async () => {
		return useTexture({
			map: `/prototype-textures/Dark/texture_06.png`,
			roughnessMap: `/prototype-textures/Dark/texture_06_roughness.png`
		})
	}
</script>

<script lang="ts">
	import { T } from '@threlte/core'
	import { useTexture } from '@threlte/extras'
	import { Collider } from '@threlte/rapier'
	import { BoxGeometry, MeshStandardMaterial } from 'three'
	import { useRefreshCollider } from './utils/useRefreshCollider'

	// color: 'Dark' | 'Green' | 'Light' | 'Orange' | 'Purple' | 'Red' = 'Dark'
	const textures = useTexture({
		map: `/prototype-textures/Dark/texture_06.png`,
		roughnessMap: `/prototype-textures/Dark/texture_06_roughness.png`
	})

	$: if ($textures && !material.map) {
		material.map = $textures.map
		material.roughnessMap = $textures.roughnessMap
		material.needsUpdate = true
	}

	const { refreshFns } = useRefreshCollider()
</script>

<T.Group position.y={-5}>
	<Collider shape="cuboid" args={[5, 5, 5]} type="static" bind:refresh={refreshFns[0]}>
		<T.Mesh receiveShadow castShadow dispose={false}>
			<T is={geometry} />
			<T is={material} />

			<slot name="selection" />
		</T.Mesh>
	</Collider>
</T.Group>
