<script lang="ts">
	import { c } from '$lib/utils/classes'

	let _class = ''
	export { _class as class }
</script>

<div class={c('bg-blue-darkest rounded-xl text-orange px-[17px] py-[15px]', _class)}>
	<slot />
</div>
