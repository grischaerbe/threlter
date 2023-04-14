<script lang="ts" context="module">
	const geometry = new TorusGeometry(4.5, 0.5, 24, 48)
	const material = new MeshStandardMaterial()

	const lowPolyGeometry = new TorusGeometry(4.5, 0.5, 4, 12)

	export const preloadCheckpointRing = async () => {
		return useTexture(`/prototype-textures/Purple/texture_06.png`)
	}
</script>

<script lang="ts">
	import { T } from '@threlte/core'
	import { useTexture } from '@threlte/extras'
	import { AutoColliders, Collider, CollisionGroups } from '@threlte/rapier'
	import { MeshStandardMaterial, TorusGeometry } from 'three'
	import { useTrackElement } from '../TrackViewer/TrackElement.svelte'
	import { useTrackViewer } from '../TrackViewer/TrackViewer.svelte'
	import { useRefreshCollider } from './utils/useRefreshCollider'

	// color: 'Dark' | 'Green' | 'Light' | 'Orange' | 'Purple' | 'Red' = 'Dark'

	const map = useTexture(`/prototype-textures/Purple/texture_06.png`)

	$: if ($map && !material.map) {
		material.map = $map
		material.needsUpdate = true
	}

	const { refreshFns } = useRefreshCollider()
	const trackElement = useTrackElement()
	const { checkpointReached } = useTrackViewer()
</script>

<T.Group {...$$restProps}>
	<AutoColliders shape="trimesh" bind:refresh={refreshFns[0]}>
		<T.Mesh visible={false}>
			<T is={lowPolyGeometry} />
		</T.Mesh>
	</AutoColliders>

	<T.Mesh receiveShadow castShadow>
		<T is={geometry} />
		<T is={material} />

		<slot name="selection" />
	</T.Mesh>

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
</T.Group>
