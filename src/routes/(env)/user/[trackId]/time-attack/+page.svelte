<script lang="ts">
	import TimeAttack from '$components/TimeAttack/TimeAttack.svelte'

	export let data
</script>

<TimeAttack trackData={data.trackData} />
