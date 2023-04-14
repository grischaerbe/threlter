<script lang="ts">
	import { gameState } from '$stores/app'
	import { getters } from '$stores/getters'
	import { formatTime } from '$lib/utils/formatters'

	const { formattedTime } = getters.game.common.time

	const { trackRecord } = gameState
</script>

<div class="flex flex-col justify-center items-center h-[33vh] tracking-widest">
	{#if $trackRecord}
		{formatTime($trackRecord.time.current)}
	{/if}
	<div>
		{$formattedTime}
	</div>
</div>
