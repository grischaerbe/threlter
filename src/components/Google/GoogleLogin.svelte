<script lang="ts">
	import type { GoogleSignInResponse } from './types'

	export let clientId: string
	export let autoSelect: boolean | undefined = undefined
	export let cancelOnTapOutside: boolean | undefined = undefined

	export let callback: (res: GoogleSignInResponse) => void

	const getWindow = () => window as any
	const getGoogle = () => getWindow().google

	const randomId = Math.random().toString(36).substring(2)

	let parent: HTMLElement

	const scriptLoaded = () => {
		const google = getGoogle()
		const configuration = {
			client_id: clientId,
			auto_select: autoSelect,
			cancel_on_tap_outside: cancelOnTapOutside,
			ux_mode: 'popup',
			itp_support: true,
			callback
		}

		google.accounts.id.initialize(configuration)
		google.accounts.id.renderButton(parent, {})
		google.accounts.id.prompt()
	}
</script>

<div id={randomId} />

<div bind:this={parent} />

<svelte:head>
	<script src="https://accounts.google.com/gsi/client" async defer on:load={scriptLoaded}>
	</script>
</svelte:head>
