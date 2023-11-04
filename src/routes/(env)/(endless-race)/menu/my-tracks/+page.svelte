<script lang="ts">
	import { goto } from '$app/navigation'
	import UserTrackSelection from '$components/UI/layouts/UserTrackSelection.svelte'
	import SpecialButton from '../../../../../components/UI/components/SpecialButton.svelte'
	import { UserTrack } from '../../../../../lib/Track/UserTrack'
	import { TrackManager } from '../../../../../lib/TrackManager/TrackManager'
	import { SessionManager } from '../../../../../lib/nakama/SessionManager'

	export let data

	$: userHasTracks = data.tracks.length > 0
</script>

<UserTrackSelection tracks={data.tracks} users={data.users}>
	<div
		class="bottom-0 pb-[15px] bg-gradient-to-t from-blue-950 to-transparent pt-[60px] left-0 w-full justify-center absolute flex flex-row gap-[15px] text-[0.8em]"
	>
		<SpecialButton
			style="inverted"
			forceFocusOnMount={!userHasTracks}
			on:click={async () => {
				if (!SessionManager.userId) return
				const track = new UserTrack(SessionManager.userId)
				track.trackName = 'Unnamed Track'
				track.addTrackElement('Box')
				await TrackManager.saveUserTrack(track)
				goto(`/user/${track.trackId}/edit`)
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="60"
				height="60"
				fill="#000000"
				viewBox="0 0 256 256"
			>
				<path
					d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM184,136H136v48a8,8,0,0,1-16,0V136H72a8,8,0,0,1,0-16h48V72a8,8,0,0,1,16,0v48h48a8,8,0,0,1,0,16Z"
				/>
			</svg>
			CREATE
		</SpecialButton>
	</div>
</UserTrackSelection>
