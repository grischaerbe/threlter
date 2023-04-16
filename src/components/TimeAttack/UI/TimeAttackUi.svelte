<script lang="ts">
	import { formatTime } from '$lib/utils/formatters'
	import FormattedTime from '$components/UI/components/FormattedTime.svelte'
	import BlurryCard from '../../UI/components/BlurryCard.svelte'

	export let time: number
</script>

<div
	class="absolute top-0 left-0 w-full flex flex-col justify-center items-center h-[28vh] tracking-widest font-segments pointer-events-auto text-[0.85em]"
>
	<div class="backdrop-blur rounded-md px-[10px] py-[3px] bg-orange border-2 border-blue-darkest">
		<FormattedTime {time} class="text-blue-darkest leading-none font-bold" />
	</div>
</div>
