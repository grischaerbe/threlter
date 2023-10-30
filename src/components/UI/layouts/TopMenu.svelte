<script lang="ts">
	import { page } from '$app/stores'
	import { nakama } from '../../../lib/nakama'
	import { c } from '../../../lib/utils/classes'
	import PlainButton from '../components/PlainButton.svelte'
	import SpecialButton from '../components/SpecialButton.svelte'

	$: isCampaign = $page.route.id?.includes('campaign') ?? false
	$: isExplore = $page.route.id?.includes('explore') ?? false
	$: isMyTracks = $page.route.id?.includes('my-tracks') ?? false
	$: isOptions = $page.route.id?.includes('options') ?? false

	const { session } = nakama
</script>

<div class="mb-[30px]">
	<div
		class="font-headline flex flex-row justify-center w-full text-[2.65em] mt-0 text-orange rounded-3xl"
	>
		THRE
		<span class="ml-[-0.06em]" />
		L
		<span class="ml-[-0.18em]" />
		TEMANIA
	</div>

	<div class="grid grid-cols-2 gap-[5px] justify-stretch">
		<SpecialButton
			href={isCampaign ? '/menu/main' : '/menu/campaign'}
			class={c('flex-1', isCampaign && '!bg-blue-dark')}
		>
			Campaign
		</SpecialButton>
		<SpecialButton
			href={isExplore ? '/menu/main' : '/menu/explore'}
			class={c('flex-1', isExplore && '!bg-blue-dark')}
		>
			Explore
		</SpecialButton>
		<SpecialButton
			href={isMyTracks ? '/menu/main' : '/menu/my-tracks'}
			class={c('flex-1', isMyTracks && '!bg-blue-dark')}
		>
			My Tracks
		</SpecialButton>
		<SpecialButton
			href={isOptions ? '/menu/main' : '/menu/options'}
			class={c('flex-1', isOptions && '!bg-blue-dark')}
		>
			Options
		</SpecialButton>
	</div>
</div>

{#if !isCampaign && !isMyTracks && !isOptions}
	<div class="text-xs fixed bottom-[15px] left-[15px] text-white/30">
		{$session?.user_id}
	</div>
{/if}
