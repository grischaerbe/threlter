import { getContext, setContext } from 'svelte'

export function useEvent(eventName: string): (...args: any[]) => void
export function useEvent(eventName: string, callback: (...args: any[]) => void): void
export function useEvent(
	eventName: string,
	callback?: (...args: any[]) => void
): void | ((...args: any[]) => void) {
	if (callback) {
		// we are inside the receiving component
		const handlers = getContext(`comp-event-${eventName}`) as Set<(...args: any[]) => void>
		if (!handlers) {
			console.warn('No handlers found for event', eventName)
			return
		}
		handlers.add(callback)
	} else {
		// we are inside the emitting component
		const handlers = new Set<(...args: any[]) => void>()
		setContext(`comp-event-${eventName}`, handlers)
		const dispatch = (...args: any[]) => {
			handlers.forEach((handler) => {
				handler(...args)
			})
		}
		return dispatch
	}
}
