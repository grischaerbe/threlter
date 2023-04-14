<script lang="ts">
	import Button from './Button.svelte'
	import type { ComponentProps } from 'svelte'

	type $$Props = ComponentProps<Button>
</script>

<Button on:click {...$$restProps}>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="28"
		height="28"
		fill="#000000"
		viewBox="0 0 256 256"
	>
		<path
			d="M228,128a12,12,0,0,1-12,12H69l51.52,51.51a12,12,0,0,1-17,17l-72-72a12,12,0,0,1,0-17l72-72a12,12,0,0,1,17,17L69,116H216A12,12,0,0,1,228,128Z"
		/>
	</svg>
	<span><slot>BACK</slot></span>
</Button>
