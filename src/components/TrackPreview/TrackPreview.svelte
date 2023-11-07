<script lang="ts">
	import { Canvas, HierarchicalObject, T } from '@threlte/core'
	import { Suspense } from '@threlte/extras'
	import { DEG2RAD } from 'three/src/math/MathUtils'
	import { sunPos } from '../../config'
	import type { Track } from '../../lib/Track/Track'
	import CameraControls from '../CameraControls/CameraControls.svelte'
	import Env from '../Common/Env.svelte'
	import Bounds from '../CommonGamePlay/Bounds.svelte'
	import TrackElement from '../TrackViewer/TrackElement.svelte'
	import TrackElementTransform from '../TrackViewer/TrackElementTransform.svelte'
	import TrackViewer from '../TrackViewer/TrackViewer.svelte'
	import PreviewRenderer from './PreviewRenderer.svelte'
	import CropPreview from './CropPreview.svelte'

	export let track: Track

	let wrapperDiv: HTMLDivElement
	let imageData: string | undefined

	const onRendered = () => {
		if (!wrapperDiv) return
		// get the canvas element
		const canvas = wrapperDiv.querySelector('canvas')
		if (!canvas) return

		// get image data
		imageData = canvas.toDataURL('image/png')
	}
</script>

{#if !imageData}
	<div class="w-0 h-0 overflow-hidden">
		<div
			class="w-[1600px] h-[900px] pointer-events-auto overflow-hidden rounded-md border-[3px] border-white/50"
			bind:this={wrapperDiv}
		>
			<HierarchicalObject>
				<Canvas
					dpr={1}
					frameloop="never"
					rendererParameters={{
						preserveDrawingBuffer: true
					}}
				>
					<Suspense final>
						<Env background={false} />

						<PreviewRenderer on:render={onRendered} />

						<Bounds let:radius let:center let:sphere>
							<TrackViewer {track} let:trackElement>
								<TrackElementTransform {trackElement}>
									<TrackElement {trackElement} />
								</TrackElementTransform>
							</TrackViewer>

							<T.DirectionalLight position={sunPos} intensity={1.2} />

							{#if radius > 0}
								<T.OrthographicCamera makeDefault position.z={radius}>
									<CameraControls
										on:create={async ({ ref }) => {
											await ref.moveTo(center.x, center.y, center.z)
											await ref.fitToSphere(sphere, false)
											const currentDist = ref.distance
											ref.polarAngle = 65 * DEG2RAD
											ref.azimuthAngle = 45 * DEG2RAD
											ref.minDistance = currentDist
											ref.maxDistance = currentDist
										}}
									/>
								</T.OrthographicCamera>
							{/if}
						</Bounds>
					</Suspense>
				</Canvas>
			</HierarchicalObject>
		</div>
	</div>
{/if}

{#if imageData}
	<CropPreview {imageData} on:blob />
{/if}
