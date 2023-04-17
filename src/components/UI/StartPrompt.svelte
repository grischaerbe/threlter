<script lang="ts">
	import { appState } from '$stores/app'
	import UiWrapper from './UiWrapper.svelte'
	import Button from './components/Button.svelte'
	import Card from './components/Card.svelte'
	import SpecialButton from './components/SpecialButton.svelte'
	import TextInput from './components/TextInput.svelte'

	const { name } = appState.options.player

	let playerName = $name

	let started = false
</script>

{#if !started}
	<UiWrapper>
		<div
			class="relative w-full h-full top-0 left-0 flex flex-col justify-center items-center gap-[10px]"
		>
			{#if $name === ''}
				<Card class="">
					<div class="mb-[20px]">
						<TextInput forceFocusOnMount bind:value={playerName} label="Your Name" />
					</div>

					<SpecialButton
						class="mb-[2px]"
						style="inverted"
						disabled={!playerName.length}
						on:click={() => {
							name.set(playerName)
							started = true
						}}
					>
						Start
					</SpecialButton>
				</Card>
			{:else}
				<SpecialButton
					forceFocusOnMount
					on:click={() => {
						started = true
					}}
				>
					Start
				</SpecialButton>
			{/if}
		</div>
	</UiWrapper>
{:else}
	<slot />
{/if}
