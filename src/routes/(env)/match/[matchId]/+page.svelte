<script lang="ts">
	import { useFrame } from '@threlte/core'
	import { Suspense } from '@threlte/extras'
	import { onDestroy, type ComponentEvents } from 'svelte'
	import type { CarState } from '../../../../components/Car/RaycastVehicleController/types'
	import MultiplayerGamePlay from '../../../../components/MultiplayerGamePlay/MultiplayerGamePlay.svelte'
	import Player from '../../../../components/MultiplayerGamePlay/Player.svelte'
	import LoadingUi from '../../../../components/UI/LoadingUi.svelte'
	import Card from '../../../../components/UI/components/Card.svelte'
	import CurrentTime from '../../../../components/UI/components/CurrentTime.svelte'
	import LeaderboardViewer from '../../../../lib/Leaderboard/LeaderboardViewer.svelte'
	import { TrackManager } from '../../../../lib/TrackManager/TrackManager'
	import { SessionManager } from '../../../../lib/nakama/SessionManager'
	import { MatchState } from '../../../../lib/nakama/matchHandler/time-trial/types'
	import type { PageData } from './$types'
	import LeaderboardProvider from './LeaderboardProvider.svelte'
	import MatchPaused from './MatchPaused.svelte'
	import TrackProvider from './TrackProvider.svelte'

	export let data: PageData

	const players = data.matchManager.players

	let matchState: MatchState = MatchState.WarmUp
	let tickRate = 0
	let trackId: string | undefined = undefined
	let leaderboardId: string | undefined = undefined

	useFrame(() => {
		data.matchManager.processQueue((message) => {
			switch (message.opcode) {
				case data.matchManager.ServerOpCode.GameUpdate:
					// this will be broadcasted to the client as soon as the client joins
					matchState = message.data.matchState
					leaderboardId = message.data.leaderboardId
					trackId = message.data.trackId
					tickRate = message.data.tickRate
					break
				case data.matchManager.ServerOpCode.MatchStarted:
					matchState = MatchState.InProgress
					break
				case data.matchManager.ServerOpCode.MatchFinished:
					matchState = MatchState.WarmUp
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
	}
</script>

{#if trackId}
	{#key trackId}
		<Suspense
			final
			on:load={async () => {
				await data.matchManager.send(data.matchManager.ClientOpCode.Ready, {})
			}}
		>
			<LoadingUi slot="fallback" />

			<TrackProvider {trackId} let:track>
				<LeaderboardProvider matchId={data.matchManager.matchId} let:leaderboard poll={1e3}>
					<MultiplayerGamePlay
						{track}
						{matchState}
						on:carstate={onCarState}
						on:trackcompleted={onTrackCompleted}
					>
						<svelte:fragment slot="ui-paused" let:proceed let:restart>
							<MatchPaused {proceed} {restart} {track} {leaderboard} />
						</svelte:fragment>

						<svelte:fragment slot="ui-leaderboard">
							{#if leaderboard}
								<Card class="max-w-[400px] absolute relative-0">
									<LeaderboardViewer {leaderboard} title="Leaderboard" />
								</Card>
							{/if}
						</svelte:fragment>

						<svelte:fragment slot="ghosts" let:carState>
							{#each $players as player}
								{#if player.presence.user_id !== SessionManager.getUserId()}
									<Player {player} {carState} {tickRate} />
								{/if}
							{/each}
						</svelte:fragment>

						<svelte:fragment slot="ui-warm-up">
							{#if leaderboard}
								<Card class="max-w-[400px]">
									<LeaderboardViewer {leaderboard} title="Leaderboard" />
								</Card>
							{/if}
						</svelte:fragment>

						<svelte:fragment slot="ui-cool-down">
							{#if leaderboard}
								<Card class="max-w-[400px]">
									<LeaderboardViewer {leaderboard} title="Leaderboard" />
								</Card>
							{/if}
						</svelte:fragment>
						<svelte:fragment slot="ui-finished" let:time>
							<CurrentTime {time} />
							{#if leaderboard}
								<Card class="max-w-[400px]">
									<LeaderboardViewer {leaderboard} title="Leaderboard" />
								</Card>
							{/if}
						</svelte:fragment>
					</MultiplayerGamePlay>
				</LeaderboardProvider>
			</TrackProvider>
		</Suspense>
	{/key}
{/if}
