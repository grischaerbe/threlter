<script lang="ts">
	import UiWrapper from '$components/UI/UiWrapper.svelte'
	import BottomBar from '$components/UI/components/BottomBar.svelte'
	import Button from '$components/UI/components/Button.svelte'
	import TopBarLayout from '$components/UI/layouts/TopBarLayout.svelte'
	import BackButton from '../../../../../components/UI/components/BackButton.svelte'
	import PlainButton from '../../../../../components/UI/components/PlainButton.svelte'
	import SpecialButton from '../../../../../components/UI/components/SpecialButton.svelte'
	import TopMenu from '../../../../../components/UI/layouts/TopMenu.svelte'
</script>

<UiWrapper>
	<TopBarLayout>
		<TopMenu slot="topbar-center" />

		<div>
			<BottomBar>
				<SpecialButton
					style="inverted"
					href="https://next.threlte.xyz"
					class="text-[0.5em]"
					slot="right"
				>
					Made with Threlte 6
				</SpecialButton>
			</BottomBar>
		</div>
	</TopBarLayout>
</UiWrapper>
