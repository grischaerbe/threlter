<!--
Auto-generated by: https://github.com/threlte/threlte/tree/main/packages/gltf
Command: npx @threlte/gltf@1.0.0-next.9 /Users/grischaerbe/Documents/Projects/2023/threltemania/src/components/TrackElements/HalfUnitBox/HalfUnitBox.glb -u -i -t -s
-->
<script lang="ts">
	import type * as THREE from 'three'
	import { Group } from 'three'
	import { T } from '@threlte/core'
	import { useGltf, useSuspense } from '@threlte/extras'
	import { Collider } from '@threlte/rapier'
	import { useRefreshCollider } from '../../utils/useRefreshCollider'

	export const ref = new Group()

	const suspend = useSuspense()

	type GLTFResult = {
		nodes: {
			Floor001: THREE.Mesh
			Floor001_1: THREE.Mesh
		}
		materials: {
			['Metallic Blue']: THREE.MeshStandardMaterial
			['Gray Concretelike']: THREE.MeshStandardMaterial
		}
	}

	const gltf = suspend(useGltf<GLTFResult>('/HalfUnitBox.glb'))

	const { refreshFns } = useRefreshCollider()
</script>

<T is={ref} dispose={false}>
	<T.Group position.y={-0.25}>
		<Collider bind:refresh={refreshFns[0]} shape="cuboid" args={[5, 0.25, 5]} />
	</T.Group>

	{#if $gltf}
		<T.Mesh
			castShadow
			receiveShadow
			geometry={$gltf.nodes.Floor001.geometry}
			material={$gltf.materials['Metallic Blue']}
		>
			<slot name="selection" />
		</T.Mesh>
		<T.Mesh
			castShadow
			receiveShadow
			geometry={$gltf.nodes.Floor001_1.geometry}
			material={$gltf.materials['Gray Concretelike']}
		>
			<slot name="selection" />
		</T.Mesh>
	{/if}

	<slot {ref} />
</T>
