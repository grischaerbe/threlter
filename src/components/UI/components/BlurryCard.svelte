<script lang="ts">
	import { c } from '../../../lib/utils/classes'

	let _class = ''
	export { _class as class }
</script>

<div
	class={c(
		'bg-blue-950/50 p-[15px] rounded-3xl border-2 border-blue-950 relative overflow-auto pointer-events-auto backdrop-blur',
		_class
	)}
>
	<slot />
</div>
