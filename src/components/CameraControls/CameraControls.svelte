<script context="module" lang="ts">
	let installed = false
</script>

<script lang="ts">
	import {
		T,
		forwardEventHandlers,
		useFrame,
		useParent,
		useThrelte,
		type Events,
		type Props
	} from '@threlte/core'

	const { orbitControls } = useControlsContext()

	import CameraControls from 'camera-controls'
	import {
		Box3,
		Matrix4,
		Quaternion,
		Raycaster,
		Sphere,
		Spherical,
		Vector2,
		Vector3,
		Vector4,
		type PerspectiveCamera
	} from 'three'
	import { DEG2RAD } from 'three/src/math/MathUtils'
	import { useControlsContext } from './useControlsContext'

	const subsetOfTHREE = {
		Vector2,
		Vector3,
		Vector4,
		Quaternion,
		Matrix4,
		Spherical,
		Box3,
		Sphere,
		Raycaster
	}

	if (!installed) {
		CameraControls.install({ THREE: subsetOfTHREE })
		installed = true
	}

	type $$Props = Props<CameraControls> & {
		autoRotate?: boolean
		autoRotateSpeed?: number
	}
	type $$Events = Events<CameraControls>

	const parent = useParent()

	if (!$parent) {
		throw new Error('CameraControls must be a child of a ThreeJS camera')
	}

	const { renderer } = useThrelte()

	export let autoRotate = false
	export let autoRotateSpeed = 1

	export const ref = new CameraControls($parent as PerspectiveCamera, renderer?.domElement)
	orbitControls.set(ref as any)
	const getControls = () => ref

	let userDragging = false
	let disableAutoRotate = false

	useFrame(
		({ invalidate }, delta) => {
			if (autoRotate && !disableAutoRotate) {
				getControls().azimuthAngle += 4 * delta * DEG2RAD * autoRotateSpeed
			}
			const updated = getControls().update(delta)
			if (updated) invalidate()
		},
		{
			invalidate: false
		}
	)

	const forwardingComponent = forwardEventHandlers()
</script>

<T
	is={ref}
	on:controlstart={() => {
		userDragging = true
		disableAutoRotate = true
	}}
	on:controlend={() => {
		userDragging = false
		disableAutoRotate = false
	}}
	{...$$restProps}
	bind:this={$forwardingComponent}
/>
