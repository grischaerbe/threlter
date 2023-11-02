import type { Readable, Subscriber, Updater, Writable } from 'svelte/store'

type PropertyEntry = { value: any; subscribers: Subscriber<any>[] }
type PropertyMap = Map<any, PropertyEntry>
type TargetMap = Map<any, PropertyMap>

const handlers: TargetMap = new Map()

const setupTarget = <U extends object, X extends keyof U>(
	target: U,
	propertyKey: X,
	propertyEntry: PropertyEntry
) => {
	Object.defineProperty(target, propertyKey, {
		get() {
			return Reflect.get(propertyEntry, 'value')
		},
		set(...args) {
			if (!propertyEntry) return
			const success = Reflect.set(propertyEntry, 'value', ...args)
			if (success) propertyEntry?.subscribers.forEach((callback) => callback(...args))
			return success
		}
	})
}

const setUpTargetAndPropertyEntry = <U extends object, X extends keyof U>(
	target: U,
	propertyKey: X
): PropertyEntry => {
	const propertyMap = handlers.get(target)
	if (!propertyMap) {
		const newPropertyMap = new Map()
		handlers.set(target, newPropertyMap)
		const propertyEntry = { value: target[propertyKey], subscribers: [] }
		newPropertyMap.set(propertyKey, propertyEntry)
		setupTarget(target, propertyKey, propertyEntry)
		return propertyEntry
	} else {
		const propertyEntry = propertyMap.get(propertyKey)
		if (!propertyEntry) {
			const propertyEntry = { value: target[propertyKey], subscribers: [] }
			propertyMap.set(propertyKey, propertyEntry)
			setupTarget(target, propertyKey, propertyEntry)
			return propertyEntry
		} else {
			return propertyEntry
		}
	}
}

/**
 * This utility makes any object property a Svelte Readable store and correctly
 * implements the Svelte store contract.
 *
 * ## Example
 *
 * ```ts
 * const user = { name: 'John' }
 * const name = toReadable(user, 'name')
 * name.subscribe((value) => {
 *   console.log(value)
 * })
 * user.name = 'Jane'
 * // logs 'Jane'
 * ```
 *
 * @param target The object that contains the property to make a store from
 * @param propertyKey The property key of the object to make a store from
 * @returns A Svelte Readable store of the same type as the property
 */
export const toReadable = <U extends object, X extends keyof U>(
	target: U,
	propertyKey: X
): Readable<U[X]> => {
	const propertyEntry = setUpTargetAndPropertyEntry(target, propertyKey)

	return {
		subscribe(callback, invalidate) {
			propertyEntry.subscribers.push(callback)

			// immediately call the callback with the current value
			callback(target[propertyKey])

			let cleanup: (() => void) | void
			if (propertyEntry.subscribers.length === 1) {
				cleanup = invalidate?.(target[propertyKey])
			}

			return () => {
				const index = propertyEntry.subscribers.indexOf(callback)
				if (index !== -1) {
					propertyEntry.subscribers.splice(index, 1)
				}
				if (propertyEntry.subscribers.length === 0) {
					cleanup?.()
				}
			}
		}
	}
}

/**
 * This utility makes any object property a Svelte Writable store and correctly
 * implements the Svelte store contract.
 *
 * ## Example
 *
 * ```ts
 * const user = { name: 'John' }
 * const name = toWritable(user, 'name')
 * name.subscribe((value) => {
 *   console.log(value)
 * })
 * name.set('Jane')
 * // logs 'Jane'
 * console.log(user.name)
 * // logs 'Jane'
 * ```
 *
 * @param target The object that contains the property to make a store from
 * @param propertyKey The property key of the object to make a store from
 * @returns A Svelte Writable store of the same type as the property
 */
export const toWritable = <U extends object, X extends keyof U>(
	target: U,
	propertyKey: X
): Writable<U[X]> => {
	const readable = toReadable(target, propertyKey)

	return Object.assign(readable, {
		set(value: U[X]) {
			target[propertyKey] = value
		},
		update(updater: Updater<U[X]>) {
			target[propertyKey] = updater(target[propertyKey])
		}
	})
}
