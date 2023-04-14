<script lang="ts">
	import TimeAttack from '$components/TimeAttack/TimeAttack.svelte'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<TimeAttack trackData={data.trackData} />
