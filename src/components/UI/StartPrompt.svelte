<script lang="ts">
	import { actions, appState } from '$stores/app'
	import UiWrapper from './UiWrapper.svelte'
	import Button from './components/Button.svelte'
	import Card from './components/Card.svelte'
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

					<Button
						class="mb-[2px]"
						style="inverted"
						disabled={!playerName.length}
						on:click={() => {
							actions.setPlayerName(playerName)
							started = true
						}}
					>
						Start
					</Button>
				</Card>
			{:else}
				<Button
					forceFocusOnMount
					on:click={() => {
						actions.setPlayerName(playerName)
						started = true
					}}
				>
					Start
				</Button>
			{/if}
		</div>
	</UiWrapper>
{:else}
	<slot />
{/if}
