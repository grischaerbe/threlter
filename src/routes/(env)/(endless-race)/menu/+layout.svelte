<script lang="ts">
	import UiWrapper from '$components/UI/UiWrapper.svelte'
	import TopBarLayout from '$components/UI/layouts/TopBarLayout.svelte'
	import TopMenu from '../../../../components/UI/layouts/TopMenu.svelte'
</script>

<UiWrapper>
	<TopBarLayout>
		<TopMenu slot="topbar-center" />

		<slot />
	</TopBarLayout>
</UiWrapper>
