<script lang="ts">
	import { queryParam } from 'sveltekit-search-params'
	import TrackList from '../../../../../components/UI/TrackList.svelte'
	import BlurryCard from '../../../../../components/UI/components/BlurryCard.svelte'
	import SpecialButton from '../../../../../components/UI/components/SpecialButton.svelte'
	import { currentSearchParamsString } from '../../../../../lib/utils/queryParamsString.js'
	import { c } from '../../../../../lib/utils/classes'
	import { TrackManager } from '../../../../../lib/TrackManager/TrackManager'

	export let data

	const sort = queryParam('sort')

	const page = queryParam<number>('page', {
		encode(value) {
			return value.toString()
		},
		decode(value) {
			if (!value) return 1
			return parseInt(value)
		}
	})

	const inactiveTabButtonClasses =
		'!backdrop-blur !bg-blue-950/50 hover:!bg-orange hover:!text-blue-darkest focus:!bg-orange focus:!text-blue-darkest'
	const activeTabButtonClasses = 'hover:!text-blue-darkest focus:!text-blue-darkest'
</script>

<div class="w-full h-full relative flex flex-col">
	<div class="h-min text-orange flex">
		<SpecialButton
			style="inverted"
			on:click={() => {
				sort.set(TrackManager.Sort.TopMonthly)
			}}
			class={c(
				'border-b-0 rounded-b-none rounded-r-none border-r-0',
				!$sort || $sort === TrackManager.Sort.TopMonthly
					? activeTabButtonClasses
					: inactiveTabButtonClasses
			)}
		>
			MONTHLY
		</SpecialButton>
		<SpecialButton
			style="inverted"
			on:click={() => {
				sort.set(TrackManager.Sort.TopWeekly)
			}}
			class={c(
				'border-b-0 rounded-b-none rounded-t-none border-r-0',
				$sort === TrackManager.Sort.TopWeekly ? activeTabButtonClasses : inactiveTabButtonClasses
			)}
		>
			WEEKLY
		</SpecialButton>
		<SpecialButton
			style="inverted"
			on:click={() => {
				sort.set(TrackManager.Sort.TopDaily)
			}}
			class={c(
				'border-b-0 rounded-b-none rounded-t-none',
				$sort === TrackManager.Sort.TopDaily ? activeTabButtonClasses : inactiveTabButtonClasses
			)}
		>
			DAILY
		</SpecialButton>
		<SpecialButton
			style="inverted"
			on:click={() => {
				sort.set(TrackManager.Sort.New)
			}}
			class={c(
				'border-b-0 rounded-b-none rounded-l-none border-l-0',
				$sort === TrackManager.Sort.New ? activeTabButtonClasses : inactiveTabButtonClasses
			)}
		>
			new
		</SpecialButton>
	</div>

	<BlurryCard class="min-h-0 rounded-tl-none flex-1">
		<div class="grid grid-cols-3 gap-[15px]">
			<TrackList
				class="col-span-1"
				tracks={data.tracks}
				selectedTrackId={data.selectedTrackId}
				selectTrackHref={(track) => {
					return `/menu/explore/${track.trackId}${$currentSearchParamsString}`
				}}
				hasNextPage={data.hasMore}
				hasPreviousPage={data.page > 1}
				on:nextPage={() => {
					page.update((page) => {
						if (!page) return page
						return page + 1
					})
				}}
				on:previousPage={() => {
					page.update((page) => {
						if (!page) return page
						return page - 1
					})
				}}
			/>

			<slot />
		</div>
	</BlurryCard>
</div>
