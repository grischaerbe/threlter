<script lang="ts">
	import { actions } from '$stores/app'
	import type { CarState } from './RaycastVehicleController/types'

	export let carState: CarState

	$: actions.setCarPosition(carState.worldPosition)
	$: actions.setCarQuaternion(carState.worldQuaternion)
</script>
