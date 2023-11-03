import { browser } from '$app/environment'
import type { CurrentWritable } from '@threlte/core'
import type { Updater } from 'svelte/store'

export const persist = <T>(store: CurrentWritable<T>, key: string) => {
	const s = {
		subscribe: store.subscribe,
		current: store.current
	} as any
	const save = () => {
		if (!browser) return
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
	const localStorageValue = browser ? localStorage.getItem(key) : undefined
	if (localStorageValue) {
		const { value } = JSON.parse(localStorageValue)
		set(value)
	}
	return s as CurrentWritable<T>
}
