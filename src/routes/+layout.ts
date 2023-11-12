import { browser } from '$app/environment'
import { redirect } from '@sveltejs/kit'
import { LoadDependencies } from '../lib/loadDependencies'
import { SessionManager } from '../lib/nakama/SessionManager'
import type { LayoutLoad } from './$types'

export const ssr = false

export const load = (async ({ route, url, depends }) => {
	depends(LoadDependencies['app:authenticated'])

	// if we're not in the browser, we're just going to return nothing
	if (!browser) {
		return {
			authenticated: false
		}
	}

	// if there's a session, return that we're authenticated
	if (SessionManager.isValidSession()) {
		return {
			authenticated: true
		}
	}

	// if there's no session, we try to restore it
	const restored = await SessionManager.restore()

	// if this is successful, we return that we're authenticated
	if (restored) {
		return {
			authenticated: true
		}
	}

	const onProtectedRoute = route.id !== '/' && route.id !== '/(env)/(endless-race)'

	if (onProtectedRoute) {
		// if we're on a protected route, we redirect to the main route to log in
		// and pass the current route as a redirect query param
		throw redirect(302, '/?redirect=' + encodeURIComponent(url.pathname))
	} else {
		// if there is a redirect query param (see above), we pass it along
		return {
			redirectTo: url.searchParams.get('redirect') ?? undefined,
			authenticated: false
		}
	}
}) satisfies LayoutLoad
