<script lang="ts">
	import TrackEditor from '$components/TrackEditor/TrackEditor.svelte'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<TrackEditor trackData={data.trackData} />
