<script lang="ts">
	import TrackEditor from '$components/TrackEditor/TrackEditor.svelte'

	export let data
</script>

<TrackEditor trackData={data.trackData} />
