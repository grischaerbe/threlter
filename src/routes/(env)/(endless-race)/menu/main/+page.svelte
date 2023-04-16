<script lang="ts">
	import UiWrapper from '$components/UI/UiWrapper.svelte'
	import BottomBar from '$components/UI/components/BottomBar.svelte'
	import Button from '$components/UI/components/Button.svelte'
	import TopBarLayout from '$components/UI/layouts/TopBarLayout.svelte'
	import BackButton from '../../../../../components/UI/components/BackButton.svelte'
	import SpecialButton from '../../../../../components/UI/components/SpecialButton.svelte'
	import TopMenu from '../../../../../components/UI/layouts/TopMenu.svelte'
</script>

<UiWrapper>
	<TopBarLayout>
		<TopMenu slot="topbar-center" />

		<div>
			<BottomBar>
				<Button slot="right">Made with Threlte</Button>
			</BottomBar>
		</div>
	</TopBarLayout>
</UiWrapper>
