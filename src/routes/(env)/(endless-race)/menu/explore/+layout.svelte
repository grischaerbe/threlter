<script lang="ts">
	import { queryParam } from 'sveltekit-search-params'
	import TrackList from '../../../../../components/UI/TrackList.svelte'
	import BlurryCard from '../../../../../components/UI/components/BlurryCard.svelte'
	import { currentSearchParamsString } from '../../../../../lib/utils/queryParamsString.js'

	export let data

	const page = queryParam<number>('page', {
		encode(value) {
			return value.toString()
		},
		decode(value) {
			if (!value) return 1
			return parseInt(value)
		},
		defaultValue: 1
	})
</script>

<BlurryCard class="h-full min-h-0 grid grid-cols-3 gap-[15px]">
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
</BlurryCard>
