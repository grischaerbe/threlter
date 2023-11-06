<script lang="ts">
	import { goto, invalidate } from '$app/navigation'
	import ButtonGroup from '../../../../../../components/UI/components/ButtonGroup/ButtonGroup.svelte'
	import Card from '../../../../../../components/UI/components/Card.svelte'
	import PlainButton from '../../../../../../components/UI/components/PlainButton.svelte'
	import SpecialButton from '../../../../../../components/UI/components/SpecialButton.svelte'
	import TrackTimes from '../../../../../../components/UI/components/TrackTimes.svelte'
	import LeaderboardViewer from '../../../../../../lib/Leaderboard/LeaderboardViewer.svelte'
	import { TrackManager } from '../../../../../../lib/TrackManager/TrackManager'
	import { LoadDependencies } from '../../../../../../lib/loadDependencies'
	import { SessionManager } from '../../../../../../lib/nakama/SessionManager'
	import { UserManager } from '../../../../../../lib/nakama/UserManager'
	import { c } from '../../../../../../lib/utils/classes'
	import type { PageData } from './$types'

	export let data: PageData

	$: track = data.track
	$: leaderboard = data.leaderboard
	$: user = data.user
</script>

{#if track}
	{@const showValidate = UserManager.isSelf(track.userId) && !track.public}
	{@const showEdit = UserManager.isSelf(track.userId) && !track.public}
	{@const showDelete = UserManager.isSelf(track.userId) && !track.public}
	{#if track}
		<div class="col-span-2">
			<Card class={c('flex flex-col gap-[10px] !rounded-br-none')}>
				<div class="flex flex-row justify-between items-start mb-[15px]">
					<div>
						<span class="font-headline">
							{track.trackName}
						</span>

						<div class="text-[0.8em]">
							{UserManager.formatUserName(user)}
						</div>
					</div>

					{#if track.public}
						<SpecialButton style="green-inverted" href={`/user/${track.trackId}/time-attack`}>
							Play
						</SpecialButton>
					{/if}
				</div>

				{#if track.public}
					<TrackTimes class="w-[27ch] text-[0.8em]" {track} />
				{/if}
			</Card>

			<div class="flex flex-row justify-end items-stretch mb-[2px]">
				<ButtonGroup let:divider={Divider} class="text-[0.7em] !rounded-t-none !border-t-0">
					<PlainButton
						class="font-mono uppercase tracking-wide px-2 py-1 text-orange bg-blue-950/60 hover:bg-blue-950/80 focus:bg-blue-950/80"
						on:click={async () => {
							if (!SessionManager.userId) return
							if (!track) return
							const newTrack = track.remix()
							await TrackManager.saveUserTrack(newTrack)
							goto(`/user/${newTrack.trackId}/edit`)
						}}
					>
						Remix
					</PlainButton>
				</ButtonGroup>
			</div>

			{#if leaderboard}
				<Card class="mt-[20px]">
					<LeaderboardViewer {leaderboard} />
				</Card>
			{/if}
		</div>
	{/if}
{/if}
