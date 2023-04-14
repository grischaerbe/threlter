<script lang="ts" context="module">
	import { T } from '@threlte/core'
	import { Edges } from '@threlte/extras'
	import { Material, MeshStandardMaterial } from 'three'

	const material = new MeshStandardMaterial({
		color: 'blue'
	})
	export let edgesThresholdAngle = 20
</script>

<Edges
	thresholdAngle={edgesThresholdAngle}
	color="blue"
	on:create={({ ref }) => {
		if (ref.material instanceof Material) {
			ref.material.depthTest = false
			ref.material.depthWrite = false
		}
	}}
	raycast={() => {
		return false
	}}
/>

<T is={material} />
