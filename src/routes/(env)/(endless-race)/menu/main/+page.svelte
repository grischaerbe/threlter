<script lang="ts">
	import UiWrapper from '$components/UI/UiWrapper.svelte'
	import BottomBar from '$components/UI/components/BottomBar.svelte'
	import Button from '$components/UI/components/Button.svelte'
	import TopBarLayout from '$components/UI/layouts/TopBarLayout.svelte'
	import { actions } from '$stores/app'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<UiWrapper>
	<TopBarLayout>
		<div slot="topbar-center">THRELTEMANIA</div>
		<Button slot="topbar-right" href="/menu/options">Options</Button>
		<svelte:fragment>
			<div class="grid grid-cols-3 gap-[15px]">
				<div class="col-span-1">
					<div class="flex flex-col items-stretch gap-[2px]">
						<Button class="flex-1" href="/menu/campaign">Campaign</Button>
						<Button forceFocusOnMount class="flex-1" href="/menu/user-tracks">User Tracks</Button>
					</div>
				</div>
			</div>

			<BottomBar>
				<Button slot="right">Made with Threlte</Button>
			</BottomBar>
		</svelte:fragment>
	</TopBarLayout>
</UiWrapper>
