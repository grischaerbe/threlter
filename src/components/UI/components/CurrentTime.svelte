<script lang="ts">
	import UiWrapper from '../UiWrapper.svelte'
	import FormattedTime from './FormattedTime.svelte'

	export let time: number
</script>

<UiWrapper>
	<div
		class="absolute top-0 left-0 w-full flex flex-col justify-center items-center h-[28vh] tracking-widest font-segments text-[0.85em]"
	>
		<div class="backdrop-blur rounded-md px-[10px] py-[3px] bg-orange border-2 border-blue-darkest">
			<FormattedTime {time} class="text-blue-darkest leading-none font-bold" />
		</div>
	</div>
</UiWrapper>
