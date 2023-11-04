<script lang="ts">
	import { T } from '@threlte/core'
	import { onReveal } from '@threlte/extras'
	import { tick } from 'svelte'
	import { Box3, Group, Sphere, Vector3 } from 'three'

	const group = new Group()

	let center = new Vector3()
	let radius = 0
	let sphere = new Sphere()

	export let boundsBox3: Box3 | undefined

	const r = async () => {
		await tick()
		// calculate bounding sphere of group and children
		group.updateWorldMatrix(true, true)
		boundsBox3 = new Box3().setFromObject(group)
		sphere = boundsBox3.getBoundingSphere(new Sphere())
		center = sphere.center
		radius = sphere.radius
	}

	onReveal(() => {
		r()
	})
</script>

<T is={group}>
	<slot {center} {radius} {sphere} />
</T>
