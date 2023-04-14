<script lang="ts">
	import { c } from '$lib/utils/classes'

	let _class = ''
	export { _class as class }
</script>

<div class={c('bg-white rounded-sm px-[2px] text-black uppercase', _class)}>
	<slot />
</div>
