<script lang="ts">
	import { c } from '../../../../lib/utils/classes'

	let _class = ''
	export { _class as class }
</script>

<div class={c('w-[3px] bg-blue-darkest', _class)} />
