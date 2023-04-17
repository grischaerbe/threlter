<script lang="ts">
	import UiWrapper from '../UiWrapper.svelte'

	export let title: string
</script>

<UiWrapper>
	<div
		class="absolute -z-10 h-[40vh] w-full bottom-0 left-0 bg-gradient-to-t from-blue-darkest to-transparent opacity-60"
	/>
	<div
		class="font-headline text-orange absolute bottom-[30px] left-1/2 w-[11ch] -translate-x-1/2 text-[3em] text-center leading-[88%] pointer-events-auto"
	>
		{title}
	</div>
</UiWrapper>
