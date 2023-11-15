export const formatTime = (milliseconds: number, includeMilliseconds = true): string => {
	const minutes = Math.floor(milliseconds / 60000)
	const seconds = Math.floor((milliseconds % 60000) / 1000)
	if (includeMilliseconds) {
		const ms = Math.round(milliseconds % 1000)
		return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms
			.toString()
			.padStart(3, '0')}`
	}
	return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}
