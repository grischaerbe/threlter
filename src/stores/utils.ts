import { type CurrentWritable, currentWritable } from '@threlte/core'
import mitt, { type Emitter } from 'mitt'
import { onDestroy } from 'svelte'
import type { Readable } from 'svelte/store'

type JsonCurrentWritable<T> = CurrentWritable<T> & {
	toJSON: () => T
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

export const createState = <T>(initialValue: T): JsonCurrentWritable<T> => {
	const store = currentWritable(initialValue)
	return toJsonCurrentWritable(store)
}

/**
 * This is actually only type-safe. The store is used as-is.
 */
export const toCurrentReadable = <T>(
	store: CurrentWritable<T>
): Readable<T> & {
	current: T
} => store

type ActionReturn = void | { debug?: boolean; invalid?: boolean | string } | Promise<ActionReturn>

/**
 * Build actions from a record of functions.
 *
 * Actions should be the only way to mutate stores.
 * Because some logic cannot be reasonably implemented in reactive stores,
 * actions can also emit events. If an action returns false,
 * the event is not emitted.
 */
export const buildActions = <Actions extends Record<string, (...args: any[]) => ActionReturn>>(
	actions: Actions,
	options?: {
		debug?: boolean
	}
): Actions &
	Emitter<Record<keyof Actions, void>> & {
		use: (name: keyof Actions, callback: () => void) => void
	} => {
	type ActionEvents = {
		[event in keyof typeof actions]: void
	}

	const events = mitt<ActionEvents>()

	const keys = Object.keys(actions) as (keyof typeof actions)[]

	const proxyActions = keys.reduce((acc, key) => {
		const action = actions[key]!
		acc[key] = (async (...args: any[]) => {
			const actionReturn = await action(...(args as []))

			// an action can define a debug flag
			const rtDebug = actionReturn?.debug ?? true
			const isInvalid = actionReturn?.invalid === true || typeof actionReturn?.invalid === 'string'

			if (options?.debug && rtDebug) {
				const payload = args.map((a) => JSON.stringify(a))
				const actionName = String(key)
				const actionDesc = payload.length
					? `${actionName}(${payload.join(', ')})`
					: `${actionName}()`
				if (isInvalid) {
					console.log(
						`%c ACTION %c %c${actionDesc} (INVALID)`,
						`color: white; background: red;`,
						'background: transparent;',
						'color: inherit;'
					)
				} else {
					console.log(
						`%c ACTION %c %c${actionDesc}`,
						`color: white; background: blue;`,
						'background: transparent;',
						'color: inherit;'
					)
				}
			}

			// The action is voided if it returns false
			if (isInvalid) return

			// finally emit the event
			events.emit(key as keyof typeof actions)
		}) as any
		return acc
	}, {} as typeof actions & Emitter<Record<keyof Actions, void>> & { use: any })

	Object.assign(proxyActions, events)

	// hook for emitter
	const use = (name: Parameters<Emitter<ActionEvents>['on']>[0], callback: () => void) => {
		events.on(name, callback)

		onDestroy(() => {
			events.off(name, callback)
		})
	}

	Object.assign(proxyActions, { use })

	return proxyActions
}
