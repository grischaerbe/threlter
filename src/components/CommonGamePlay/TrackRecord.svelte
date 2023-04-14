<script lang="ts">
	import { useFrame } from '@threlte/core'
	import { TrackRecord } from '$lib/TrackRecord/TrackRecord'
	import { actions, gameState } from '$stores/app'

	const { trackData, trackRecord, common } = gameState
	const { state } = common

	$: currentRecord = $trackRecord

	let workingRecord: TrackRecord | undefined = undefined

	actions.use('startPlaying', () => {
		if (!$trackData) return
		workingRecord = new TrackRecord($trackData.trackId, $trackData.validationId)
		workingRecord.initializeGhost()
	})

	const { position, quaternion } = gameState.car
	const { time } = gameState.common

	useFrame(() => {
		if (!workingRecord || $state !== 'playing') return
		workingRecord.ghost?.addFrame(position.current, quaternion.current, time.current)
	})

	actions.use('finishReached', () => {
		if (!workingRecord) return
		workingRecord.time.set(time.current)
		if (!currentRecord || TrackRecord.isNewTrackRecord(currentRecord, workingRecord)) {
			actions.setTrackRecord(workingRecord)
		}
	})
</script>
