<script lang="ts">
	import TimeAttack from '$components/TimeAttack/TimeAttack.svelte'

	export let data

	data.trackRecordsManager.setGhostRecords(true, true)
</script>

<TimeAttack track={data.track} trackRecordsManager={data.trackRecordsManager} />
