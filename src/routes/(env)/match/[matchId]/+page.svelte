<script lang="ts">
	import { useFrame } from '@threlte/core'
	import { Suspense } from '@threlte/extras'
	import { onDestroy, type ComponentEvents } from 'svelte'
	import type { CarState } from '../../../../components/Car/RaycastVehicleController/types'
	import CountIn from '../../../../components/CommonGamePlay/UI/CountIn.svelte'
	import MultiplayerGamePlay from '../../../../components/MultiplayerGamePlay/MultiplayerGamePlay.svelte'
	import Player from '../../../../components/MultiplayerGamePlay/Player.svelte'
	import CountDown from '../../../../components/MultiplayerGamePlay/UI/CountDown.svelte'
	import LoadingUi from '../../../../components/UI/LoadingUi.svelte'
	import Card from '../../../../components/UI/components/Card.svelte'
	import CurrentTime from '../../../../components/UI/components/CurrentTime.svelte'
	import { TrackManager } from '../../../../lib/TrackManager/TrackManager'
	import { SessionManager } from '../../../../lib/nakama/SessionManager'
	import { MatchState } from '../../../../lib/nakama/matchHandler/time-trial/types'
	import type { PageData } from './$types'
	import MatchPaused from './MatchPaused.svelte'
	import MatchResultsViewer from './MatchResultsViewer.svelte'
	import TrackProvider from './TrackProvider.svelte'

	export let data: PageData

	const players = data.matchManager.players

	let matchState: MatchState = MatchState.WarmUp
	let tickRate = 0
	let trackId: string | undefined = undefined
	let round = 0
	let matchStartTime = 0
	let matchEndTime = 0
	let restartMatchTime = 0

	useFrame(() => {
		data.matchManager.processQueue((message) => {
			switch (message.opcode) {
				case data.matchManager.ServerOpCode.GameUpdate:
					// this will be broadcasted to the client as soon as the client joins
					matchState = message.data.matchState
					trackId = message.data.trackId
					tickRate = message.data.tickRate
					matchEndTime = message.data.matchEndTime
					matchStartTime = message.data.matchStartTime
					restartMatchTime = message.data.restartMatchTime
					break
				case data.matchManager.ServerOpCode.MatchStarted:
					matchState = MatchState.InProgress
					break
				case data.matchManager.ServerOpCode.MatchFinished:
					matchState = MatchState.CoolDown
					break
				case data.matchManager.ServerOpCode.TransformUpdates:
					for (const [userId, { position, rotation }] of Object.entries(message.data.transforms)) {
						const player = data.matchManager.players.current.find(
							(player) => player.presence.user_id === userId
						)
						if (!player) continue
						player.position.set(position)
						player.quaternion.set(rotation)
					}
					break
				case data.matchManager.ServerOpCode.MatchRestart:
					round++
					matchStartTime = message.data.matchStartTime
					restartMatchTime = message.data.restartMatchTime
					matchEndTime = message.data.matchEndTime
					// clear all records
					data.matchManager.matchResults.clearRecords()
					// reset all player positions and rotations
					data.matchManager.players.update((players) => {
						for (const player of players) {
							player.position.set([0, 0, 0])
							player.quaternion.set([0, 0, 0, 1])
						}
						return players
					})
					matchState = MatchState.WarmUp
					trackId = message.data.trackId
					break
				case data.matchManager.ServerOpCode.UpdateLeaderboard:
					// update the leaderboard
					data.matchManager.matchResults.update()
					break
				default:
					break
			}
		})
	})

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

{#if trackId}
	{#key `${trackId}-${round}`}
		<Suspense
			final
			on:load={async () => {
				await data.matchManager.send(data.matchManager.ClientOpCode.Ready, {})
			}}
		>
			<LoadingUi slot="fallback" />

			<TrackProvider {trackId} let:track>
				<MultiplayerGamePlay
					{matchEndTime}
					{track}
					{matchState}
					on:carstate={onCarState}
					on:trackcompleted={onTrackCompleted}
				>
					<svelte:fragment slot="ui-paused" let:proceed let:restart>
						<MatchPaused
							{proceed}
							{restart}
							{track}
							matchResults={data.matchManager.matchResults}
						/>
					</svelte:fragment>

					<svelte:fragment slot="ui-leaderboard">
						<Card class="max-w-[400px] absolute relative-0">
							<MatchResultsViewer matchResults={data.matchManager.matchResults} />
						</Card>
					</svelte:fragment>

					<svelte:fragment slot="ui-count-in" let:time let:start>
						<div class="absolute top-0 right-0 p-[15px] text-right">
							<div class="text-[1.5em]">
								<CountDown countDownTo={matchEndTime} includeMilliseconds={false} />
							</div>
						</div>

						<CountIn on:countindone={start} {time} />
					</svelte:fragment>

					<svelte:fragment slot="ui-playing" let:time>
						<div class="absolute top-0 right-0 p-[15px] text-right">
							<div class="text-[1.5em]">
								<CountDown countDownTo={matchEndTime} includeMilliseconds={false} />
							</div>
						</div>
						<CurrentTime {time} />
					</svelte:fragment>

					<svelte:fragment slot="ghosts" let:carState>
						{#each $players as player}
							{#if player.presence.user_id !== SessionManager.getUserId()}
								<Player {player} {carState} {tickRate} />
							{/if}
						{/each}
					</svelte:fragment>

					<svelte:fragment slot="ui-warm-up">
						<div class="absolute top-0 right-0 p-[15px] text-right">
							<p class="text-[1em]">Match starts in</p>
							<div class="text-[1.5em]">
								<CountDown countDownTo={matchStartTime} includeMilliseconds={false} />
							</div>
						</div>
						<Card class="max-w-[400px]">
							<MatchResultsViewer matchResults={data.matchManager.matchResults} />
						</Card>
					</svelte:fragment>

					<svelte:fragment slot="ui-cool-down">
						<div class="absolute top-0 right-0 p-[15px] text-right">
							<p class="text-[1em]">Next match starts in</p>
							<div class="text-[1.5em]">
								<CountDown countDownTo={restartMatchTime} includeMilliseconds={false} />
							</div>
						</div>
						<Card class="max-w-[400px]">
							<MatchResultsViewer matchResults={data.matchManager.matchResults} />
						</Card>
					</svelte:fragment>
					<svelte:fragment slot="ui-finished" let:time>
						<CurrentTime {time} />
						<Card class="max-w-[400px]">
							<MatchResultsViewer matchResults={data.matchManager.matchResults} />
						</Card>
					</svelte:fragment>
				</MultiplayerGamePlay>
			</TrackProvider>
		</Suspense>
	{/key}
{/if}
