import { type CurrentWritable, currentWritable } from '@threlte/core'

export type JsonCurrentWritable<T> = CurrentWritable<T> & {
	toJSON: () => T
}

export const jsonCurrentWritable = <T>(initialValue: T): JsonCurrentWritable<T> => {
	const store = currentWritable(initialValue)
	const anyStore = store as any
	anyStore.toJSON = () => {
		return store.current
	}
	return anyStore
}

export const toJsonCurrentWritable = <T>(
	store: CurrentWritable<T>
): CurrentWritable<T> & {
	toJSON: () => T
} => {
	const jsonStore = store as any
	jsonStore.toJSON = () => {
		return store.current
	}
	return jsonStore
}
