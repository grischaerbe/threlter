<script lang="ts">
	import SpecialButton from '../../UI/components/SpecialButton.svelte'
	import { useTrackEditor } from '../context'

	const { track } = useTrackEditor()
</script>

<SpecialButton class="w-max" style="green-inverted" href={`/user/${track.trackId}/validate`}>
	Validate
</SpecialButton>
