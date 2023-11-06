<script lang="ts">
	import { appState } from '$stores/app'
	import { SessionManager } from '../../lib/nakama/SessionManager'
	import { UserManager } from '../../lib/nakama/UserManager'
	import UiWrapper from './UiWrapper.svelte'
	import Button from './components/Button.svelte'
	import Card from './components/Card.svelte'
	import SpecialButton from './components/SpecialButton.svelte'
	import TextInput from './components/TextInput.svelte'

	const { name } = appState.options.player

	let playerName = $name

	let started = false

	let error: boolean
</script>

{#if !started}
	<UiWrapper>
		<div
			class="relative w-full h-full top-0 left-0 flex flex-col justify-center items-center gap-[10px]"
		>
			{#if $name === ''}
				<Card class="">
					<TextInput
						forceFocusOnMount
						bind:value={playerName}
						label="Your Name"
						on:input={() => {
							error = false
						}}
					/>

					{#if !playerName.length && error}
						<div class="mt-[5px] text-red-500 text-[0.8em] mb-[20px]">Please insert a name</div>
					{:else if error}
						<div class="mt-[5px] text-red-500 text-[0.8em] mb-[20px]">Name already taken</div>
					{/if}

					{#if playerName.length > 24}
						<div class="mt-[5px] text-red-500 text-[0.8em] mb-[20px]">Name too long</div>
					{/if}

					<SpecialButton
						class="mb-[2px] mt-[20px]"
						style="inverted"
						on:click={async () => {
							if (!playerName.length || playerName.length > 24) {
								error = true
								return
							}

							const { success } = await UserManager.updateAccount(playerName)

							if (!success) {
								error = true
								started = false
							} else {
								error = false
								started = true
								name.set(playerName)
							}
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
