<!--
Auto-generated by: https://github.com/threlte/threlte/tree/main/packages/gltf
Command: npx @threlte/gltf@1.0.0-next.9 /Users/grischaerbe/Documents/Projects/2023/threltemania/src/components/TrackElements/Tilts/TiltTransitions/TiltTransitionLeft/TiltTransitionLeft.glb -u -i -t -s
-->
<script lang="ts">
	import type * as THREE from 'three'
	import { Group } from 'three'
	import { T } from '@threlte/core'
	import { useGltf, useSuspense } from '@threlte/extras'
	import { AutoColliders } from '@threlte/rapier'
	import { useRefreshCollider } from '../../../utils/useRefreshCollider'

	export const ref = new Group()

	const suspend = useSuspense()

	type GLTFResult = {
		nodes: {
			TiltTransitionLeft: THREE.Mesh
		}
		materials: {
			['Ramps.001']: THREE.MeshStandardMaterial
		}
	}

	const gltf = suspend(useGltf<GLTFResult>('/TiltTransitionLeft.glb'))

	const { refreshFns } = useRefreshCollider()
</script>

<T is={ref} dispose={false}>
	{#if $gltf}
		<AutoColliders shape="trimesh" bind:refresh={refreshFns[0]}>
			<T.Mesh
				castShadow
				receiveShadow
				geometry={$gltf.nodes.TiltTransitionLeft.geometry}
				material={$gltf.materials['Ramps.001']}
			>
				<slot name="selection" />
			</T.Mesh>
		</AutoColliders>
	{/if}

	<slot {ref} />
</T>
