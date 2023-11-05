import { page } from '$app/stores'
import { derived } from 'svelte/store'

export const currentSearchParamsString = derived(page, (page) => {
	if (page.url.searchParams.size === 0) return ''
	return `?${page.url.searchParams.toString()}`
})

export const toSearchParamsString = (searchParams: URLSearchParams) => {
	if (searchParams.size === 0) return ''
	return `?${searchParams.toString()}`
}
