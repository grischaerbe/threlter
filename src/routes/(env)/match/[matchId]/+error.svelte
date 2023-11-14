<script lang="ts">
	import { page } from '$app/stores'
	import UiWrapper from '../../../../components/UI/UiWrapper.svelte'
	import Card from '../../../../components/UI/components/Card.svelte'
	import SpecialButton from '../../../../components/UI/components/SpecialButton.svelte'
</script>

<UiWrapper>
	<div class="w-full h-full flex justify-center items-center">
		<Card>
			<h1 class="text-orange font-headline mb-[20px]">{$page.status}: {$page.error?.message}</h1>

			<SpecialButton preload={false} href="/menu/explore">Back to menu</SpecialButton>
		</Card>
	</div>
</UiWrapper>
