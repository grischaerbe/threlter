<script lang="ts">
	import { T } from '@threlte/core'
	import { onReveal } from '@threlte/extras'
	import { tick } from 'svelte'
	import { Box3, Group, Sphere, Vector3 } from 'three'

	const group = new Group()

	let center = new Vector3()
	let radius = 0
	let sphere = new Sphere()

	onReveal(async () => {
		await tick()
		// calculate bounding sphere of group and children
		group.updateWorldMatrix(true, true)
		const bbox = new Box3().setFromObject(group)
		sphere = bbox.getBoundingSphere(new Sphere())
		center = sphere.center
		radius = sphere.radius
	})
</script>

<T is={group}>
	<slot {center} {radius} {sphere} />
</T>
