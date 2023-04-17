<script lang="ts">
	import { Euler } from 'three'
	import { DEG2RAD } from 'three/src/math/MathUtils'
	import Button from '$components/UI/components/Button.svelte'
	import { useTrackEditor } from '../context'

	const { trackData, currentlySelectedElement } = useTrackEditor()
	const { validated } = trackData

	const rotateElement = () => {
		if (!$currentlySelectedElement) return
		const euler = new Euler().set(...$currentlySelectedElement.rotation.current)
		// snap to the next 90 degree rotation on the y axis
		euler.y += 90 * DEG2RAD
		// modulo 360
		euler.y = euler.y % (Math.PI * 2)
		const newRotation = euler.toArray()
		trackData.setTrackElementRotation($currentlySelectedElement.id, newRotation as any)
	}
</script>

<Button style="regular" class="font-mono" disabled={$validated} on:click={rotateElement}>
	Rotate
</Button>
