<script lang="ts">
	import { formatTime } from '$lib/utils/formatters'

	export let time: number
</script>

<div class="flex flex-col justify-center items-center h-[33vh] tracking-widest">
	<div>
		{formatTime(time)}
	</div>
</div>
