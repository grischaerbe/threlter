<script lang="ts">
	import type { Player } from '../../lib/nakama/Player'
	import type { CarState } from '../Car/RaycastVehicleController/types'
	import GhostCar from '../GhostCar/GhostCar.svelte'

	export let player: Player
	export let carState: CarState
	export let tickRate: number

	const { position, quaternion } = player
</script>

<GhostCar
	{carState}
	position={$position}
	quaternion={$quaternion}
	name={player.presence.username}
	{tickRate}
/>
