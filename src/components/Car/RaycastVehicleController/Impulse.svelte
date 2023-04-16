<script lang="ts">
	import type { Vector } from '@dimforge/rapier3d-compat'
	import { T } from '@threlte/core'
	import { BufferGeometry, DoubleSide, Group, Mesh, Vector3 } from 'three'

	export let origin: Vector
	export let impulse: Vector
	export let length: number | undefined = undefined
	export let color: string | undefined = undefined
	export let multiplier: number | undefined = undefined

	$: combinedColor = color ?? 'red'

	const geometry = new BufferGeometry()

	const tempV3 = new Vector3()

	let startAtObject: Mesh
	let endAtObject: Group

	const updateGeometry = (origin: Vector, impulse: Vector, length: number | undefined) => {
		const from = new Vector3(origin.x, origin.y, origin.z)
		if (length) {
			tempV3.set(impulse.x, impulse.y, impulse.z).normalize().multiplyScalar(length)
		} else {
			tempV3.set(impulse.x, impulse.y, impulse.z)
		}
		if (multiplier) {
			tempV3.multiplyScalar(multiplier)
		}
		const to = from.clone().add(tempV3)

		const points = []
		points.push(from)
		points.push(to)
		geometry.setFromPoints(points)

		if (!startAtObject || !endAtObject) return
		startAtObject.position.copy(from)
		endAtObject.position.copy(to)
		endAtObject.lookAt(from)
	}

	$: updateGeometry(origin, impulse, length)
</script>

<T.Line renderOrder={1} frustumCulled={false}>
	<T is={geometry} />
	<T.LineBasicMaterial
		color={combinedColor}
		depthTest={false}
		depthWrite={false}
		side={DoubleSide}
		transparent
		opacity={1}
	/>
</T.Line>

<!-- Marking the start -->
<T.Mesh bind:ref={startAtObject}>
	<T.SphereGeometry args={[0.03]} />
	<T.MeshBasicMaterial color={combinedColor} depthTest={false} depthWrite={false} />
</T.Mesh>

<!-- Marking the end -->
<T.Group bind:ref={endAtObject}>
	<T.Mesh rotation.x={(-90 * Math.PI) / 180}>
		<T.ConeGeometry args={[0.03, 0.1]} />
		<T.MeshBasicMaterial color={combinedColor} depthTest={false} depthWrite={false} />
	</T.Mesh>
</T.Group>
