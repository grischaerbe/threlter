<script lang="ts">
	import { goto, invalidate } from '$app/navigation'
	import { onMount } from 'svelte'
	import { SessionManager } from '../../lib/nakama/SessionManager'
	import type { GoogleSignInResponse } from '../Google/types'
	import { LoadDependencies } from '../../lib/loadDependencies'

	export let redirectUrl: string | undefined = undefined

	onMount(async () => {
		await SessionManager.restore()
	})

	const googleAuthCallback = async (args: GoogleSignInResponse) => {
		await SessionManager.signInWithGoogle(args.credential)
		await invalidate(LoadDependencies['app:authenticated'])
		if (redirectUrl) goto(redirectUrl)
	}
</script>

<slot {googleAuthCallback} />
