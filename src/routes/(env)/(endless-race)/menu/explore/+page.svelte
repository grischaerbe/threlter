<script lang="ts">
	import UserTrackSelection from '$components/UI/layouts/UserTrackSelection.svelte'

	export let data
</script>

<UserTrackSelection tracks={data.tracks} users={data.users} />
