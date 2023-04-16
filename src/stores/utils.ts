import type { CurrentWritable } from '@threlte/core'
import type { Updater } from 'svelte/store'

export const persist = <T>(store: CurrentWritable<T>, key: string) => {
	const s = {
		subscribe: store.subscribe,
		current: store.current
	} as any
	const save = () => {
		localStorage.setItem(key, JSON.stringify({ value: store.current }))
	}
	const set = (v: T) => {
		store.set(v)
		s.current = store.current
		save()
	}
	const update = (fn: Updater<T>) => {
		store.update(fn)
		s.current = store.current
		save()
	}
	s.set = set
	s.update = update
	const localStorageValue = localStorage.getItem(key)
	if (localStorageValue) {
		const { value } = JSON.parse(localStorageValue)
		set(value)
	}
	return s as CurrentWritable<T>
}
