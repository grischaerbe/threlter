<script lang="ts">
	import UiWrapper from '$components/UI/UiWrapper.svelte'
	import BottomBar from '$components/UI/components/BottomBar.svelte'
	import Button from '$components/UI/components/Button.svelte'
	import TopBarLayout from '$components/UI/layouts/TopBarLayout.svelte'
	import BackButton from '../../../../../components/UI/components/BackButton.svelte'
</script>

<UiWrapper>
	<TopBarLayout>
		<div>
			<div
				class="font-headline flex flex-row justify-center w-full text-7xl mt-24 text-orange-500 px-5 py-2 pb-1 rounded-3xl drop-shadow-xl"
			>
				THRELTEMANIA
			</div>

			<BottomBar>
				<Button slot="right">Made with Threlte</Button>
			</BottomBar>
		</div>

		<Button slot="topbar-right" href="/menu/options">Options</Button>

		<div slot="topbar-left" class="flex flex-col gap-[2px]">
			<Button forceFocusOnMount class="flex-1" href="/menu/campaign">Campaign</Button>
			<Button class="flex-1" href="/menu/user-tracks">User Tracks</Button>
		</div>
	</TopBarLayout>
</UiWrapper>
