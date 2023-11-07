<script lang="ts">
	import UiWrapper from '$components/UI/UiWrapper.svelte'
	import TopBarLayout from '$components/UI/layouts/TopBarLayout.svelte'
	import TopMenu from '../../../../components/UI/layouts/TopMenu.svelte'
</script>

<UiWrapper>
	<TopBarLayout>
		<TopMenu slot="topbar-center" />

		<div class="max-w-[1200px] h-full mx-auto">
			<slot />
		</div>
	</TopBarLayout>
</UiWrapper>
