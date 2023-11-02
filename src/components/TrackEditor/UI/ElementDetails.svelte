<script lang="ts">
	import { DEG2RAD, RAD2DEG } from 'three/src/math/MathUtils'
	import { useTrackEditor } from '../context'
	import type { TrackElement } from '../../../lib/Track/TrackElement'
	import { toReadable } from '../../../lib/utils/toStore'

	const { track } = useTrackEditor()

	export let currentlySelectedTrackElement: TrackElement

	const elements = {
		position: {
			x: undefined as HTMLInputElement | undefined,
			y: undefined as HTMLInputElement | undefined,
			z: undefined as HTMLInputElement | undefined
		},
		rotation: {
			x: undefined as HTMLInputElement | undefined,
			y: undefined as HTMLInputElement | undefined,
			z: undefined as HTMLInputElement | undefined
		}
	}

	const focus = {
		position: {
			x: false,
			y: false,
			z: false
		},
		rotation: {
			x: false,
			y: false,
			z: false
		}
	}

	const position = toReadable(currentlySelectedTrackElement, 'position')
	const rotation = toReadable(currentlySelectedTrackElement, 'rotation')

	$: if (!focus.position.x && elements.position.x) {
		elements.position.x.value = $position[0].toString()
	}
	$: if (!focus.position.y && elements.position.y) {
		elements.position.y.value = $position[1].toString()
	}
	$: if (!focus.position.z && elements.position.z) {
		elements.position.z.value = $position[2].toString()
	}
	$: if (!focus.rotation.x && elements.rotation.x) {
		elements.rotation.x.value = ($rotation[0] * RAD2DEG).toString()
	}
	$: if (!focus.rotation.y && elements.rotation.y) {
		elements.rotation.y.value = ($rotation[1] * RAD2DEG).toString()
	}
	$: if (!focus.rotation.z && elements.rotation.z) {
		elements.rotation.z.value = ($rotation[2] * RAD2DEG).toString()
	}

	const updatePosition = async (component: 0 | 1 | 2, data: number) => {
		const currentPosition = currentlySelectedTrackElement.position
		currentPosition[component] = data
		track.setTrackElementPosition(currentlySelectedTrackElement.id, currentPosition)
	}

	const updateRotation = async (component: 0 | 1 | 2, data: number) => {
		const currentRotation = currentlySelectedTrackElement.rotation
		currentRotation[component] = data * DEG2RAD
		track.setTrackElementRotation(currentlySelectedTrackElement.id, currentRotation)
	}
</script>

<div class="pointer-events-auto text-[0.65em]">
	<div class="mb-[15px]">
		<div>Position</div>
		<label for="position.x">X</label>
		<input
			bind:this={elements.position.x}
			on:focus={() => {
				focus.position.x = true
			}}
			on:blur={() => {
				focus.position.x = false
			}}
			on:keydown|stopPropagation
			id="position.x"
			type="number"
			on:input={(e) => {
				updatePosition(0, Number(e.currentTarget.value))
			}}
		/>
		<label for="position.y">Y</label>
		<input
			bind:this={elements.position.y}
			on:focus={() => {
				focus.position.y = true
			}}
			on:blur={() => {
				focus.position.y = false
			}}
			on:keydown|stopPropagation
			id="position.y"
			type="number"
			on:input={(e) => {
				updatePosition(1, Number(e.currentTarget.value))
			}}
		/>
		<label for="position.z">Z</label>
		<input
			bind:this={elements.position.z}
			on:focus={() => {
				focus.position.z = true
			}}
			on:blur={() => {
				focus.position.z = false
			}}
			on:keydown|stopPropagation
			id="position.z"
			type="number"
			on:input={(e) => {
				updatePosition(2, Number(e.currentTarget.value))
			}}
		/>
	</div>

	<div>
		<div>Rotation</div>
		<label for="rotation.x">X</label>
		<input
			bind:this={elements.rotation.x}
			on:focus={() => {
				focus.rotation.x = true
			}}
			on:blur={() => {
				focus.rotation.x = false
			}}
			on:keydown|stopPropagation
			id="rotation.x"
			type="number"
			on:input={(e) => {
				updateRotation(0, Number(e.currentTarget.value))
			}}
		/>
		<label for="rotation.y">Y</label>
		<input
			bind:this={elements.rotation.y}
			on:focus={() => {
				focus.rotation.y = true
			}}
			on:blur={() => {
				focus.rotation.y = false
			}}
			on:keydown|stopPropagation
			id="rotation.y"
			type="number"
			on:input={(e) => {
				updateRotation(1, Number(e.currentTarget.value))
			}}
		/>
		<label for="rotation.z">Z</label>
		<input
			bind:this={elements.rotation.z}
			on:focus={() => {
				focus.rotation.z = true
			}}
			on:blur={() => {
				focus.rotation.z = false
			}}
			on:keydown|stopPropagation
			id="rotation.z"
			type="number"
			on:input={(e) => {
				updateRotation(2, Number(e.currentTarget.value))
			}}
		/>
	</div>
</div>

<style>
	input {
		@apply w-[10ch] rounded-sm bg-[#e8e8e8] px-[2px] py-[2px] focus:bg-[#d6d6d6] focus:outline-none;
	}
</style>
