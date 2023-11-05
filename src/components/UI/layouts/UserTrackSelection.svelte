<script lang="ts">
	import { goto, invalidate } from '$app/navigation'
	import TrackTimes from '$components/UI/components/TrackTimes.svelte'
	import { c } from '$lib/utils/classes'
	import type { User } from '@heroiclabs/nakama-js'
	import type { UserTrack } from '../../../lib/Track/UserTrack'
	import { TrackManager } from '../../../lib/TrackManager/TrackManager'
	import { LoadDependencies } from '../../../lib/loadDependencies'
	import { SessionManager } from '../../../lib/nakama/SessionManager'
	import BlurryCard from '../components/BlurryCard.svelte'
	import ButtonGroup from '../components/ButtonGroup/ButtonGroup.svelte'
	import Card from '../components/Card.svelte'
	import Leaderboard from '../components/Leaderboard.svelte'
	import PlainButton from '../components/PlainButton.svelte'
	import SpecialButton from '../components/SpecialButton.svelte'
	import { UserManager } from '../../../lib/nakama/UserManager'

	export let tracks: UserTrack[]
	export let users: User[] | undefined = undefined

	export let headline: string | undefined = undefined

	let selectedTrack: UserTrack | undefined = tracks.length ? tracks[0] : undefined

	const isOwnTrack = (userTrack: UserTrack) => userTrack.userId === SessionManager.userId
</script>

{#if headline}
	<div class="font-headline text-orange mb-[15px]">{headline}</div>
{/if}

<BlurryCard class="grid grid-cols-3 gap-[15px] h-full min-h-0">
	<slot />

	{#if tracks.length}
		<Card class="h-min !p-0 overflow-hidden border-2 border-blue-950">
			<div class="flex flex-col col-span-1 h-min overflow-auto text-[0.8em]">
				{#each tracks as track, index}
					{#if track}
						<PlainButton
							on:click={() => (selectedTrack = track)}
							class={c(
								'text-orange text-left px-[12px] py-[8px] hover:bg-blue-darker focus:bg-blue-darker outline-none',
								selectedTrack === track && '!bg-orange !text-blue-darkest',
								index === 0 && 'pt-[11px]',
								index === tracks.length - 1 && 'pb-[11px]'
							)}
						>
							{track.trackName}
						</PlainButton>
					{/if}
				{/each}
			</div>
		</Card>
	{/if}

	{#if selectedTrack}
		{@const user = users?.find((user) => user.id === selectedTrack?.userId)}
		{#if selectedTrack && user}
			{@const showValidate = isOwnTrack(selectedTrack) && !selectedTrack.public}
			{@const showEdit = isOwnTrack(selectedTrack) && !selectedTrack.public}
			{@const showDelete = isOwnTrack(selectedTrack) && !selectedTrack.public}
			{#if selectedTrack}
				<div class="col-span-2">
					<Card class={c('flex flex-col gap-[10px] !rounded-br-none')}>
						<div class="flex flex-row justify-between items-start mb-[15px]">
							<div>
								<span class="font-headline">
									{selectedTrack.trackName}
								</span>
								{#if user}
									<div class="text-[0.8em]">
										{UserManager.getUserName(user)}
									</div>
								{/if}
							</div>

							{#if selectedTrack.public}
								<SpecialButton
									style="green-inverted"
									href={`/user/${selectedTrack.trackId}/time-attack`}
								>
									Play
								</SpecialButton>
							{/if}
						</div>

						{#if !selectedTrack.public}
							<div class="text-[0.7em]">
								Draft – A track must be validated and published before it can be played.
							</div>
						{/if}

						{#if selectedTrack.public}
							<TrackTimes class="w-[27ch] text-[0.8em]" track={selectedTrack} />
						{/if}
					</Card>

					<div class="flex flex-row justify-end items-stretch mb-[2px]">
						<ButtonGroup let:divider={Divider} class="text-[0.7em] !rounded-t-none !border-t-0">
							{#if showValidate}
								<PlainButton
									href="/user/{selectedTrack.trackId}/validate"
									class="font-mono uppercase tracking-wide px-2 py-1 text-blue-darkest bg-green-500/80 hover:bg-green-500 focus:bg-green-500"
								>
									Validate and publish
								</PlainButton>
								<Divider />
							{/if}
							{#if showEdit}
								<PlainButton
									href="/user/{selectedTrack.trackId}/edit"
									class="font-mono uppercase tracking-wide px-2 py-1 text-orange bg-blue-950/60 hover:bg-blue-950/80 focus:bg-blue-950/80"
								>
									Edit
								</PlainButton>
								<Divider />
							{/if}
							<PlainButton
								class="font-mono uppercase tracking-wide px-2 py-1 text-orange bg-blue-950/60 hover:bg-blue-950/80 focus:bg-blue-950/80"
								on:click={async () => {
									if (!SessionManager.userId) return
									if (!selectedTrack) return
									const newTrack = selectedTrack.remix()
									await TrackManager.saveUserTrack(newTrack)
									await invalidate(LoadDependencies['menu/my-tracks'])
									goto(`/user/${newTrack.trackId}/edit`)
								}}
							>
								Remix
							</PlainButton>
							{#if showDelete}
								<Divider />
								<PlainButton
									class="font-mono uppercase tracking-wide px-2 py-1 text-blue-darkest bg-red-500/80 hover:bg-red-500 focus:bg-red-500"
									on:click={async () => {
										if (!selectedTrack) return
										await TrackManager.deleteUserTrack(selectedTrack.trackId)
										invalidate(LoadDependencies['menu/my-tracks'])
									}}
								>
									Delete
								</PlainButton>
							{/if}
						</ButtonGroup>
					</div>

					{#if selectedTrack.public}
						<Card class="mt-[20px]">
							{#key selectedTrack}
								<Leaderboard track={selectedTrack} />
							{/key}
						</Card>
					{/if}
				</div>
			{/if}
		{/if}
	{/if}
</BlurryCard>
