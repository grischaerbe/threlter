<script lang="ts">
	import { Suspense } from '@threlte/extras'
	import { onDestroy, type ComponentEvents } from 'svelte'
	import type { CarState } from '../../../../components/Car/RaycastVehicleController/types'
	import CountIn from '../../../../components/CommonGamePlay/UI/CountIn.svelte'
	import MultiplayerGamePlay from '../../../../components/MultiplayerGamePlay/MultiplayerGamePlay.svelte'
	import Player from '../../../../components/MultiplayerGamePlay/Player.svelte'
	import CountDown from '../../../../components/MultiplayerGamePlay/UI/CountDown.svelte'
	import Controls from '../../../../components/UI/Controls.svelte'
	import LoadingUi from '../../../../components/UI/LoadingUi.svelte'
	import BottomScreenTrackName from '../../../../components/UI/components/BottomScreenTrackName.svelte'
	import Card from '../../../../components/UI/components/Card.svelte'
	import CurrentTime from '../../../../components/UI/components/CurrentTime.svelte'
	import SpecialButton from '../../../../components/UI/components/SpecialButton.svelte'
	import TopBarLayout from '../../../../components/UI/layouts/TopBarLayout.svelte'
	import { TrackManager } from '../../../../lib/TrackManager/TrackManager'
	import { SessionManager } from '../../../../lib/nakama/SessionManager'
	import type { PageData } from './$types'
	import MatchPaused from './MatchPaused.svelte'
	import MatchResultsViewer from './TimeTrialMatchResultsViewer.svelte'
	import TrackProvider from './TrackProvider.svelte'

	export let data: PageData

	const {
		matchEndTime,
		matchStartTime,
		matchState,
		restartMatchTime,
		round,
		tickRate,
		trackId,
		players
	} = data.matchManager

	onDestroy(() => {
		data.matchManager.leave()
	})

	const onCarState = (event: CustomEvent<CarState>) => {
		data.matchManager.send(data.matchManager.ClientOpCode.TransformUpdate, {
			position: event.detail.worldPosition.current,
			rotation: event.detail.worldQuaternion.current
		})
	}

	type E = ComponentEvents<MultiplayerGamePlay>

	const onTrackCompleted = async (event: E['trackcompleted']) => {
		await TrackManager.addTrackRecord(event.detail.trackRecord, data.matchManager.matchId)
		// notify the other players that we added a new track record
		await data.matchManager.send(data.matchManager.ClientOpCode.LeaderboardRecordAdd, {})
	}
</script>

{#if $trackId}
	{#key `${$trackId}-${$round}`}
		<Suspense
			final
			on:load={async () => {
				await data.matchManager.send(data.matchManager.ClientOpCode.Ready, {})
			}}
		>
			<LoadingUi slot="fallback" />

			<TrackProvider trackId={$trackId} let:track>
				<MultiplayerGamePlay
					matchState={$matchState}
					{track}
					matchEndTime={$matchEndTime}
					on:carstate={onCarState}
					on:trackcompleted={onTrackCompleted}
				>
					<svelte:fragment slot="ui-paused" let:proceed let:restart>
						<MatchPaused {proceed} {restart} {track} matchManager={data.matchManager} />
					</svelte:fragment>

					<svelte:fragment slot="ui-leaderboard">
						<Card class="max-w-[400px] absolute relative-0">
							<MatchResultsViewer matchManager={data.matchManager} />
						</Card>
					</svelte:fragment>

					<svelte:fragment slot="ui-count-in" let:time let:start>
						<div class="absolute top-0 right-0 p-[15px] text-right">
							<div class="text-[1.5em]">
								<CountDown countDownTo={$matchEndTime} includeMilliseconds={false} />
							</div>
						</div>

						<CountIn on:countindone={start} {time} />
					</svelte:fragment>

					<svelte:fragment slot="ui-playing" let:time>
						<div class="absolute top-0 right-0 p-[15px] text-right">
							<div class="text-[1.5em]">
								<CountDown countDownTo={$matchEndTime} includeMilliseconds={false} />
							</div>
						</div>
						<CurrentTime {time} />
					</svelte:fragment>

					<svelte:fragment slot="ghosts" let:carState>
						{#each $players as player}
							{#if player.presence.user_id !== SessionManager.getUserId()}
								<Player {player} {carState} tickRate={$tickRate} />
							{/if}
						{/each}
					</svelte:fragment>

					<svelte:fragment slot="ui-warm-up">
						<BottomScreenTrackName title={track.trackName} />
						<TopBarLayout>
							<SpecialButton slot="topbar-left" preventFocusOnFocusLost href="/menu/main">
								Menu
							</SpecialButton>

							<div class="absolute top-0 right-0 p-[15px] text-right pointer-events-none">
								<p class="text-[1em]">Match starts in</p>
								<div class="text-[1.5em]">
									<CountDown countDownTo={$matchStartTime} includeMilliseconds={false} />
								</div>
							</div>

							<div class="flex flex-col gap-[15px] items-start">
								<Card>
									<MatchResultsViewer matchManager={data.matchManager} />
								</Card>
								<Card class="flex flex-col gap-[10px] w-max">
									<Controls />
								</Card>
							</div>
						</TopBarLayout>
					</svelte:fragment>

					<svelte:fragment slot="ui-cool-down">
						<div class="absolute top-0 right-0 p-[15px] text-right">
							<p class="text-[1em]">Next match starts in</p>
							<div class="text-[1.5em]">
								<CountDown countDownTo={$restartMatchTime} includeMilliseconds={false} />
							</div>
						</div>
						<Card class="max-w-[400px]">
							<MatchResultsViewer matchManager={data.matchManager} />
						</Card>
					</svelte:fragment>
					<svelte:fragment slot="ui-finished" let:time>
						<CurrentTime {time} />
						<Card class="max-w-[400px]">
							<MatchResultsViewer matchManager={data.matchManager} />
						</Card>
					</svelte:fragment>
				</MultiplayerGamePlay>
			</TrackProvider>
		</Suspense>
	{/key}
{/if}
