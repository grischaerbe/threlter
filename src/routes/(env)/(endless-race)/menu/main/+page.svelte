<script lang="ts">
	import BottomBar from '$components/UI/components/BottomBar.svelte'
	import SpecialButton from '../../../../../components/UI/components/SpecialButton.svelte'
	import { Nakama } from '../../../../../lib/nakama/Nakama'
	import { SessionManager } from '../../../../../lib/nakama/SessionManager'

	const onClick = () => {
		const img = new Image()
		img.src = '/android-chrome-512x512.png'
		img.onload = async () => {
			const res = await Nakama.client.rpc(await SessionManager.getSession(), 'upload_image', {})
			if (res) {
				const url = (res.payload as any).url

				// upload image to s3 presigned url as Blob
				// make blob from image
				const blob = await new Promise<Blob>((resolve, reject) => {
					const xhr = new XMLHttpRequest()
					xhr.open('GET', img.src)
					xhr.responseType = 'blob'
					xhr.onload = () => {
						resolve(xhr.response)
					}
					xhr.onerror = () => {
						reject(new TypeError('Local request failed'))
					}
					xhr.send()
				})

				// upload blob to s3
				const res2 = await fetch(url, {
					method: 'PUT',
					body: blob,
					headers: {
						'Content-Disposition': 'inline; filename="android-chrome-512x512.png',
						'Content-Type': 'image/png'
					}
				})
			}
		}
	}
</script>

<BottomBar>
	<SpecialButton slot="left" on:click={onClick}>TEST</SpecialButton>

	<SpecialButton style="inverted" href="https://legrisch.com" class="text-[0.5em]" slot="right">
		Made by Grischa Erbe
	</SpecialButton>
</BottomBar>
