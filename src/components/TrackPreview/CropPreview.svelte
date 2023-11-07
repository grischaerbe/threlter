<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte'
	import { trimImageData } from './cropCanvas'

	// base64 image data
	export let imageData: string

	const dispatch = createEventDispatcher<{
		blob: Blob
	}>()

	let canvas: HTMLCanvasElement

	onMount(() => {
		const image = new Image()
		image.onload = async () => {
			const padding = 20

			const desiredCanvasWidth = 960
			const desiredCanvasHeight = 540

			canvas.width = image.width
			canvas.height = image.height
			const ctx = canvas.getContext('2d')
			if (!ctx) return
			ctx.drawImage(image, 0, 0)
			const trimmedImageData = trimImageData(ctx.getImageData(0, 0, image.width, image.height))

			const trimmedImageDataAspectRatio = trimmedImageData.width / trimmedImageData.height
			const desiredCanvasAspectRatio = desiredCanvasWidth / desiredCanvasHeight

			let newWidth = desiredCanvasWidth
			let newHeight = desiredCanvasHeight

			if (trimmedImageDataAspectRatio < desiredCanvasAspectRatio) {
				newWidth = desiredCanvasHeight * trimmedImageDataAspectRatio
			} else {
				newHeight = desiredCanvasWidth / trimmedImageDataAspectRatio
			}

			const ibm = await window.createImageBitmap(
				trimmedImageData,
				0,
				0,
				trimmedImageData.width,
				trimmedImageData.height,
				{
					resizeWidth: newWidth,
					resizeHeight: newHeight,
					resizeQuality: 'high'
				}
			)

			canvas.width = desiredCanvasWidth
			canvas.height = desiredCanvasHeight

			// draw in the style of object-fit: contain
			ctx.drawImage(
				ibm,
				(desiredCanvasWidth - newWidth) / 2 + padding,
				(desiredCanvasHeight - newHeight) / 2 + padding,
				newWidth - padding * 2,
				newHeight - padding * 2
			)

			canvas.toBlob((blob) => {
				if (!blob) return
				dispatch('blob', blob)
			})
		}
		image.src = imageData
	})
</script>

<div class="w-0 h-0 overflow-hidden">
	<canvas bind:this={canvas} />
</div>
