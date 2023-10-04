<script lang="ts">
	import { T, useLoader } from '@threlte/core'
	import { useSuspense, useTexture } from '@threlte/extras'
	import { Color, TextureLoader } from 'three'
	import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare'
	import { sunPos } from '../../config'

	const suspend = useSuspense()

	const distances = [0, /*0.4,*/ 0.8]
	const sizes = [512, /*512,*/ 300]
	const colors = [new Color('#8A8A8A'), /*new Color('#ADADAD'),*/ new Color('#F9F9F9')]
	const elementTextures = suspend(
		useTexture(['/lensflare/lensflare0.png', '/lensflare/lensflare3.png'])
	)
</script>

<T.Mesh position.x={sunPos[0] * 300} position.y={sunPos[1] * 300} position.z={sunPos[2] * 300}>
	<T.SphereGeometry args={[100, 16, 16]} />
	<T.MeshBasicMaterial />
</T.Mesh>

<T.Group position.x={sunPos[0] * 300} position.y={sunPos[1] * 300} position.z={sunPos[2] * 300}>
	{#await elementTextures then textures}
		<T is={Lensflare} let:ref={lensflare}>
			{#each textures as texture, index}
				<T
					is={LensflareElement}
					args={[texture, sizes[index], distances[index], colors[index]]}
					on:create={({ ref }) => {
						lensflare.addElement(ref)
					}}
				/>
			{/each}
		</T>
	{/await}
</T.Group>
