<!-- This component saves all trackElement preview images, resize your browser viewport to 400x400 -->
<script lang="ts">
	import { T, useFrame, useRender, useThrelte } from '@threlte/core'
	import Env from '$components/Common/Env.svelte'
	import TrackElement from '../TrackViewer/TrackElement.svelte'
	import TrackViewer from '../TrackViewer/TrackViewer.svelte'
	import UiWrapper from '../UI/UiWrapper.svelte'
	import Button from '../UI/components/Button.svelte'
	import { trackElementPrototypes } from '../TrackElements/elements'
	import TrackElementPositionHelper from './TrackElementPositionHelper.svelte'
	import type { Sphere } from 'three'
	import { DEG2RAD } from 'three/src/math/MathUtils'
	import { Track } from '$lib/TrackData/TrackData'
	import type { TrackElement as TE } from '$lib/TrackData/TrackElement'
	import { nakama } from '../../lib/nakama'

	const trackData = new Track('000')

	let queue: (keyof typeof trackElementPrototypes)[] = []
	let currentTrackElement: TE | undefined = undefined

	const rotationOverrides: Partial<
		Record<keyof typeof trackElementPrototypes, [number, number, number]>
	> = {
		Ramp: [0, 180 * DEG2RAD, 0],
		RampInverse: [0, 180 * DEG2RAD, 0],
		Slope: [0, 180 * DEG2RAD, 0],
		CheckpointRing: [0, 90 * DEG2RAD, 0]
	}

	useFrame(() => {
		if (!queue.length || currentTrackElement) return
		const type = queue.shift()!
		currentTrackElement = trackData.addTrackElement(type, false)
	})

	let doRender = false

	let currentRadius = 1

	useRender(
		({ camera, renderer, scene }) => {
			renderer?.render(scene, camera.current)
		},
		{
			order: 0
		}
	)

	useRender(
		() => {
			if (!doRender || !currentTrackElement) return
			download()
			trackData.removeTrackElement(currentTrackElement.id, false)
			doRender = false
			currentTrackElement = undefined
		},
		{
			order: 1 // after actual rendering
		}
	)

	const { renderer } = useThrelte()

	const startRendering = () => {
		queue = Object.keys(trackElementPrototypes) as (keyof typeof trackElementPrototypes)[]
	}

	const download = function () {
		const link = document.createElement('a')
		link.download = `${currentTrackElement?.type.current}.png`
		link.href = renderer?.domElement.toDataURL('image/png') ?? ''
		link.click()
	}

	const onSphereCalculated = (sphere: Sphere) => {
		currentRadius = sphere.radius
	}
</script>

<UiWrapper>
	<Button on:click={startRendering}>Start Rendering</Button>
</UiWrapper>

<Env background={false} />

<TrackViewer {trackData} let:trackElement>
	<T.Group rotation={rotationOverrides[trackElement.type.current] ?? [0, 0, 0]}>
		<TrackElementPositionHelper
			on:positionend={() => (doRender = true)}
			on:spherecalculated={(e) => {
				onSphereCalculated(e.detail)
			}}
		>
			<TrackElement {trackElement} />
		</TrackElementPositionHelper>
	</T.Group>
</TrackViewer>

<T.OrthographicCamera
	position={[30, 30, 30]}
	on:create={({ ref }) => {
		ref.lookAt(0, 0, 0)
	}}
	makeDefault
	left={-currentRadius}
	right={currentRadius}
	top={currentRadius}
	bottom={-currentRadius}
/>
