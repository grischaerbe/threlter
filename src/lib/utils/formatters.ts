export const formatTime = (milliseconds: number): string => {
  const minutes = Math.floor(milliseconds / 60000)
  const seconds = Math.floor((milliseconds % 60000) / 1000)
  const ms = Math.floor(milliseconds % 1000)
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms
    .toString()
    .padStart(3, '0')}`
}
