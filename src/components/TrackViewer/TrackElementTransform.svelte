<!--
	This component is used to transform the track element to its current position and rotation.
	It can do this reactively or not. If it is not reactive, it will only set the position and rotation
	once, when the component is created. This is useful for the actual gameplay, where the position and
	rotation of the track elements should not change. If it is reactive, it will update the position
	and rotation of the track element every time the position or rotation changes. This is useful for
	the track editor, where the position and rotation of the track elements can change.
-->
<script lang="ts">
	import { T } from '@threlte/core'
	import type { TrackElement } from '$lib/TrackData/TrackData'

	export let trackElement: TrackElement
	export let reactive = false

	const position = trackElement.position
	const rotation = trackElement.rotation
</script>

{#if reactive}
	<T.Group let:ref position={$position} rotation={$rotation}>
		<slot {ref} />
	</T.Group>
{:else}
	<T.Group
		on:create={({ ref }) => {
			ref.position.set(...position.current)
			ref.rotation.set(...rotation.current)
		}}
		let:ref
	>
		<slot {ref} />
	</T.Group>
{/if}
