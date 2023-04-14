<script lang="ts">
	import TrackValidation from '$components/TrackValidation/TrackValidation.svelte'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<TrackValidation trackData={data.trackData} />
