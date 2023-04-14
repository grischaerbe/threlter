<script lang="ts">
	import TrackValidation from '$components/TrackValidation/TrackValidation.svelte'

	export let data
</script>

<TrackValidation trackData={data.trackData} />
