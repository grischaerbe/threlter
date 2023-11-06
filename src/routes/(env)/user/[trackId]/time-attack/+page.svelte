<script lang="ts">
	import TimeAttack from '$components/TimeAttack/TimeAttack.svelte'

	export let data

	data.trackRecordsManager.setGhostRecords(true, true)
</script>

<TimeAttack
	leaderboard={data.leaderboard}
	track={data.track}
	trackRecordsManager={data.trackRecordsManager}
/>
