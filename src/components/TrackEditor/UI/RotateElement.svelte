<script lang="ts">
	import { Euler } from 'three'
	import { DEG2RAD } from 'three/src/math/MathUtils'
	import Button from '$components/UI/components/Button.svelte'
	import { useTrackEditor } from '../context'
	import { toReadable } from '../../../lib/utils/toStore'

	const { track, currentlySelectedElement } = useTrackEditor()
	const validated = toReadable(track, 'validated')

	const rotateElement = () => {
		if (!$currentlySelectedElement) return
		const euler = new Euler().set(...$currentlySelectedElement.rotation)
		// snap to the next 90 degree rotation on the y axis
		euler.y += 90 * DEG2RAD
		// modulo 360
		euler.y = euler.y % (Math.PI * 2)
		const newRotation = euler.toArray()
		track.setTrackElementRotation($currentlySelectedElement.id, newRotation as any)
	}
</script>

<Button style="regular" class="font-mono" disabled={$validated} on:click={rotateElement}>
	Rotate
</Button>
