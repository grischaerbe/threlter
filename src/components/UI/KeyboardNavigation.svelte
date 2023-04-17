<script lang="ts" context="module">
	import { getContext, setContext, tick } from 'svelte'
	import { spring } from 'svelte/motion'
	import { writable, type Readable } from 'svelte/store'
	import UiWrapper from './UiWrapper.svelte'

	type KeyboardNavigationContext = {
		addNavigationalElement: (element: HTMLElement) => void
		removeNavigationalElement: (element: HTMLElement) => void
		keyboardNavigationAction: (
			node: HTMLElement,
			options?: { forceFocus?: boolean; preventFocusOnFocusLost?: boolean }
		) => { destroy: () => void }
		focusElement: (element: HTMLElement) => void
		focusedElement: Readable<HTMLElement | undefined>
		disable: () => void
		enable: () => void
	}

	export const useKeyboardNavigation = () => {
		const context = getContext<KeyboardNavigationContext>('keyboard-navigation-context')
		if (!context) {
			throw new Error('useKeyboardNavigation must be used within a KeyboardNavigationContext')
		}
		return context
	}
</script>

<script lang="ts">
	export let threshold: number = 10

	type NavigationalElement = {
		element: HTMLElement
		options: {
			forceFocus: boolean
			preventFocusOnFocusLost: boolean
		}
	}

	let navigationType: 'pointer' | 'keyboard' = 'keyboard'

	let navigationalElements: Set<NavigationalElement> = new Set()
	let focusedElement: HTMLElement | undefined = undefined

	let disabled = false
	const disable = () => {
		disabled = true
	}
	const enable = () => {
		disabled = false
	}

	// for the context
	const focusedElementStore = writable<HTMLElement | undefined>(undefined)
	$: focusedElementStore.set(focusedElement)

	let focusedElementCenter: { x: number; y: number } = {
		x: window.innerWidth / 2,
		y: window.innerHeight / 2
	}
	let focusedElementCenterSpring = spring(focusedElementCenter)
	let lastCursorPosition: { x: number; y: number } = {
		x: window.innerWidth / 2,
		y: window.innerHeight / 2
	}

	const focusElement = async (element: HTMLElement) => {
		if (focusedElement === element) return
		focusedElement?.blur()
		focusedElement = element
		await tick()
		focusedElementCenter = getCenterOfElement(element)
		focusedElementCenterSpring.set(focusedElementCenter)
		element.focus()
	}

	const addNavigationalElement = (
		element: HTMLElement,
		options?: { forceFocus?: boolean; preventFocusOnFocusLost?: boolean }
	) => {
		navigationalElements.add({
			element,
			options: {
				forceFocus: options?.forceFocus ?? false,
				preventFocusOnFocusLost: options?.preventFocusOnFocusLost ?? false
			}
		})
		if (options?.forceFocus && navigationType === 'keyboard') {
			focusElement(element)
		}
		navigationalElements = navigationalElements
	}

	const getClosestElement = (
		from: { x: number; y: number },
		elements: { element: HTMLElement; x: number; y: number }[]
	) => {
		if (elements.length === 0) {
			return undefined
		}
		const closestElement = elements.reduce((closest, current) => {
			const distanceToClosest = Math.sqrt(
				Math.pow(closest.x - from.x, 2) + Math.pow(closest.y - from.y, 2)
			)
			const distanceToCurrent = Math.sqrt(
				Math.pow(current.x - from.x, 2) + Math.pow(current.y - from.y, 2)
			)

			return distanceToClosest < distanceToCurrent ? closest : current
		}, elements[0]!)

		return closestElement.element
	}

	const removeNavigationalElement = async (element: HTMLElement) => {
		const navigationalElement = Array.from(navigationalElements).find((e) => e.element === element)
		if (navigationalElement) {
			navigationalElements.delete(navigationalElement)
			navigationalElements = navigationalElements
		}

		// if a change in navigationElements through pointer events, we don' care
		if (navigationType === 'pointer') {
			if (focusedElement === element) {
				focusedElement = undefined
				focusedElementCenter = lastCursorPosition
				focusedElementCenterSpring.set(lastCursorPosition, { hard: true })
			}
			return
		}

		focusElement: if (focusedElement === element) {
			// wait for the next tick to make sure the element is removed from the DOM and new elements can be focused
			await tick()

			const forceFocusElements = Array.from(navigationalElements).filter(
				(e) => e.options.forceFocus
			)

			if (forceFocusElements.length > 0) {
				focusElement(forceFocusElements[0]!.element)
				break focusElement
			}

			// if the focused element dissapears, focus the closest element
			const closestElement = getClosestElement(
				focusedElementCenter,
				Array.from(navigationalElements)
					.filter((e) => !e.options.preventFocusOnFocusLost)
					.map((e) => e.element)
					.map((e) => ({ element: e, ...getCenterOfElement(e) }))
			)
			if (closestElement) {
				focusElement(closestElement)
				break focusElement
			}

			focusedElement = undefined
			focusedElementCenter = lastCursorPosition
			focusedElementCenterSpring.set(lastCursorPosition, { hard: true })
		}
	}

	const keyboardNavigationAction = (
		node: HTMLElement,
		options?: { forceFocus?: boolean; preventFocusOnFocusLost?: boolean }
	) => {
		addNavigationalElement(node, options)
		return {
			destroy() {
				removeNavigationalElement(node)
			}
		}
	}

	const context: KeyboardNavigationContext = {
		addNavigationalElement,
		removeNavigationalElement,
		keyboardNavigationAction,
		focusElement,
		focusedElement: {
			subscribe: focusedElementStore.subscribe
		},
		disable,
		enable
	}

	setContext<KeyboardNavigationContext>('keyboard-navigation-context', context)

	const getCenterOfElement = (element: HTMLElement) => {
		const rect = element.getBoundingClientRect()
		return {
			x: rect.left + rect.width / 2,
			y: rect.top + rect.height / 2
		}
	}

	const onKeyDown = (event: KeyboardEvent) => {
		if (disabled) return

		// if an arrow key is pressed, focus the closest navigational element.
		// if no element is focused, assume, that the currently selected element is in the center of the viewport and select the closest element.

		// first check if the button pressed is an arrow key, return otherwise
		if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return

		const direction: 'up' | 'down' | 'left' | 'right' = event.key
			.replace('Arrow', '')
			.toLowerCase() as any

		const currentlySeletedElementCenter: { x: number; y: number } = focusedElement
			? getCenterOfElement(focusedElement)
			: focusedElementCenter
			? focusedElementCenter
			: { x: window.innerWidth / 2, y: window.innerHeight / 2 }

		const centersOfNavigationalElements = Array.from(navigationalElements)
			.map((element) => element.element)
			.filter((element) => element !== focusedElement)
			.map((element) => {
				return {
					element,
					...getCenterOfElement(element)
				}
			})

		let filteredElements: { element: HTMLElement; x: number; y: number }[] = []
		if (direction === 'left') {
			// get all elements that are to the left of the currently selected element including a threshold
			filteredElements = centersOfNavigationalElements.filter(
				(center) => center.x + threshold < currentlySeletedElementCenter.x
			)
		} else if (direction === 'right') {
			// get all elements that are to the right of the currently selected element
			filteredElements = centersOfNavigationalElements.filter(
				(center) => center.x - threshold > currentlySeletedElementCenter.x
			)
		} else if (direction === 'up') {
			// get all elements that are above the currently selected element
			filteredElements = centersOfNavigationalElements.filter(
				(center) => center.y + threshold < currentlySeletedElementCenter.y
			)
		} else if (direction === 'down') {
			// get all elements that are below the currently selected element
			filteredElements = centersOfNavigationalElements.filter(
				(center) => center.y - threshold > currentlySeletedElementCenter.y
			)
		}

		if (filteredElements.length === 0) {
			if (!focusedElement) {
				// no element is selected, but we want to select one anyway, so we just use the closest element
				filteredElements = centersOfNavigationalElements
			} else {
				return
			}
		}

		// at this point we can prevent the default behavior of the arrow keys
		event.preventDefault()

		// get the closest element
		const closestElement = getClosestElement(currentlySeletedElementCenter, filteredElements)

		if (!closestElement) return

		// focus the closest element
		focusElement(closestElement)
		navigationType = 'keyboard'
	}

	const resetByPointerEvent = (e: PointerEvent) => {
		lastCursorPosition = {
			x: e.clientX,
			y: e.clientY
		}
		focusedElementCenter = {
			x: e.clientX,
			y: e.clientY
		}
		focusedElementCenterSpring.set(focusedElementCenter, { hard: true })
		if (focusedElement) {
			focusedElement.blur()
			focusedElement = undefined
		}
	}

	const onPointerDown = (e: PointerEvent) => {
		navigationType = 'pointer'
		resetByPointerEvent(e)
	}

	const onPointerMove = async (e: PointerEvent) => {
		navigationType = 'pointer'
		resetByPointerEvent(e)
	}
</script>

<svelte:window
	on:pointerdown={onPointerDown}
	on:pointermove={onPointerMove}
	on:keydown={onKeyDown}
/>

<slot />

{#if focusedElementCenter && navigationalElements.size > 0}
	<UiWrapper>
		<div
			class="absolute top-0 left-0 w-8 h-8 z-50 bg-[url(/cursor.png)] bg-contain"
			style="transform: translateX({$focusedElementCenterSpring.x}px) translateY({$focusedElementCenterSpring.y}px)"
		/>
	</UiWrapper>
{/if}

<style>
	:global(body, button, input, select, textarea) {
		cursor: none !important;
	}
</style>
