<!--
Auto-generated by: https://github.com/threlte/threlte/tree/main/packages/gltf
Command: npx @threlte/gltf@1.0.0-next.9 /Users/grischaerbe/Documents/Projects/2023/threltemania/src/components/TrackElements/Checkpoints/CheckpointRing/CheckpointRing.glb -u -i -t -s
-->

<script lang="ts" context="module">
	const lowPolyGeometry = new TorusGeometry(4.5, 0.5, 4, 12)
</script>

<script lang="ts">
	import type * as THREE from 'three'
	import { Group } from 'three'
	import { T } from '@threlte/core'
	import { useGltf, useSuspense } from '@threlte/extras'
	import { TorusGeometry } from 'three'
	import MeshCollider from '../../utils/components/MeshCollider.svelte'
	import { Collider, CollisionGroups } from '@threlte/rapier'
	import { useRefreshCollider } from '../../utils/useRefreshCollider'
	import { useTrackElement } from '../../../TrackViewer/TrackElement.svelte'
	import { useTrackViewer } from '../../../TrackViewer/TrackViewer.svelte'

	export const ref = new Group()

	const suspend = useSuspense()

	type GLTFResult = {
		nodes: {
			CheckpointRing: THREE.Mesh
		}
		materials: {}
	}

	const gltf = suspend(useGltf<GLTFResult>('/CheckpointRing.glb'))

	const { refreshFns } = useRefreshCollider()
	const trackElement = useTrackElement()
	const { checkpointReached } = useTrackViewer()
</script>

<T is={ref} dispose={false}>
	<MeshCollider>
		<T.Mesh visible={false}>
			<T is={lowPolyGeometry} />
		</T.Mesh>
	</MeshCollider>

	<T.Group rotation.x={(90 * Math.PI) / 180}>
		<CollisionGroups groups={[3]}>
			<Collider
				type="static"
				shape="cylinder"
				args={[0.5, 4.5]}
				on:sensorenter={() => {
					if (!trackElement) return
					checkpointReached(trackElement.id)
				}}
				sensor
				bind:refresh={refreshFns[1]}
			/>
		</CollisionGroups>
	</T.Group>

	{#if $gltf}
		<T.Mesh
			castShadow
			receiveShadow
			geometry={$gltf.nodes.CheckpointRing.geometry}
			material={$gltf.nodes.CheckpointRing.material}
			rotation={[Math.PI / 2, 0, 0]}
		>
			<slot name="selection" />
		</T.Mesh>
	{/if}

	<slot {ref} />
</T>
