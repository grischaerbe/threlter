<script lang="ts">
	import DomPortal from '$components/Utilities/DomPortal.svelte'
</script>

<DomPortal target="#car-ui-portal-target">
	<slot />
</DomPortal>
