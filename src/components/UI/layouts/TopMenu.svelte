<script lang="ts">
	import { page } from '$app/stores'
	import { c } from '../../../lib/utils/classes'
	import PlainButton from '../components/PlainButton.svelte'
	import SpecialButton from '../components/SpecialButton.svelte'

	$: isCampaign = $page.route.id?.includes('campaign') ?? false
	$: isUserTracks = $page.route.id?.includes('user-tracks') ?? false
	$: isOptions = $page.route.id?.includes('options') ?? false
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

	<div class="flex flex-row gap-[5px] justify-between">
		<SpecialButton
			href={isCampaign ? '/menu/main' : '/menu/campaign'}
			class={c(isCampaign && '!bg-blue-dark')}
		>
			Campaign
		</SpecialButton>
		<SpecialButton
			href={isUserTracks ? '/menu/main' : '/menu/user-tracks'}
			class={c(isUserTracks && '!bg-blue-dark')}
		>
			Your Tracks
		</SpecialButton>
		<SpecialButton
			href={isOptions ? '/menu/main' : '/menu/options'}
			class={c(isOptions && '!bg-blue-dark')}
		>
			Options
		</SpecialButton>
	</div>
</div>
