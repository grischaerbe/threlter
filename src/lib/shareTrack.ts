import type { Leaderboard } from './Leaderboard/Leaderboard'
import type { Track } from './Track/Track'
import { formatTime } from './utils/formatters'

export const shareTrack = async (track: Track, leaderboard?: Leaderboard) => {
	const text = leaderboard?.ownLeaderboardEntry
		? `Can you beat my record of ${formatTime(leaderboard?.ownLeaderboardEntry.time)} on ${
				track.trackName
		  }? 
			
See for yourself: https://threltemania.com/user/${track.trackId}/time-attack`
		: `Can you beat me on ${track.trackName}?
		
See for yourself: https://threltemania.com/user/${track.trackId}/time-attack`

	if ('share' in navigator) {
		navigator.share({
			text,
			url: `https://threltemania.com/user/${track.trackId}/time-attack`,
			title: 'Threltemania'
		})
	} else if ('clipboard' in navigator) {
		await (navigator as any).clipboard.writeText(text)
	}
}
