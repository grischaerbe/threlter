<script lang="ts">
	import { formatTime } from '$lib/utils/formatters'
	import FormattedTime from '$components/UI/components/FormattedTime.svelte'
	import BlurryCard from '../../UI/components/BlurryCard.svelte'
	import CurrentTime from '../../UI/components/CurrentTime.svelte'

	export let time: number
</script>

<CurrentTime {time} />
