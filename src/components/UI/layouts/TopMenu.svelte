<script lang="ts">
	import { page } from '$app/stores'
	import { SessionManager } from '../../../lib/nakama/SessionManager'
	import { c } from '../../../lib/utils/classes'
	import { toReadable } from '../../../lib/utils/toStore'
	import SpecialButton from '../components/SpecialButton.svelte'

	$: isExplore = $page.route.id?.includes('explore') ?? false
	$: isMyTracks = $page.route.id?.includes('my-tracks') ?? false
	$: isOptions = $page.route.id?.includes('options') ?? false

	const userId = toReadable(SessionManager, 'userId')
</script>

<div class="mb-[30px]">
	<div
		class="font-headline flex flex-row justify-center w-full text-[2.9em] mt-0 text-orange rounded-3xl"
	>
		THRE
		<span class="ml-[-0.06em]" />
		L
		<span class="ml-[-0.18em]" />
		TEMANIA
	</div>

	<div class="flex gap-[5px]">
		<SpecialButton
			href={isExplore ? '/menu/main' : '/menu/explore'}
			class={c('flex-1 whitespace-nowrap', isExplore && '!bg-blue-dark')}
		>
			Explore
		</SpecialButton>
		<SpecialButton
			href={isMyTracks ? '/menu/main' : '/menu/my-tracks'}
			class={c('flex-1 whitespace-nowrap', isMyTracks && '!bg-blue-dark')}
		>
			My Tracks
		</SpecialButton>
		<SpecialButton
			href={isOptions ? '/menu/main' : '/menu/options'}
			class={c('flex-1 whitespace-nowrap', isOptions && '!bg-blue-dark')}
		>
			Options
		</SpecialButton>
	</div>
</div>

{#if !isExplore && !isMyTracks && !isOptions}
	<div class="text-xs fixed bottom-[15px] left-[15px] text-white/30">
		{$userId}
	</div>
{/if}
