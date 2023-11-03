<script lang="ts">
	import { useThrelte } from '@threlte/core'
	import { appState } from '../../stores/app'

	const {
		options: {
			video: { resolution }
		}
	} = appState

	const { dpr } = useThrelte()

	$: dpr.set($resolution === 'high' ? window.devicePixelRatio : $resolution === 'medium' ? 1 : 0.5)
</script>
