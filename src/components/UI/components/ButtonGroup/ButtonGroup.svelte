<script lang="ts">
	import { c } from '../../../../lib/utils/classes'
	import ButtonGroupDivider from './ButtonGroupDivider.svelte'

	let _class = ''
	export { _class as class }
</script>

<div
	class={c(
		'border-[3px] rounded-xl border-current text-blue-darkest flex flex-row overflow-hidden relative',
		_class
	)}
>
	<slot divider={ButtonGroupDivider} />
</div>
