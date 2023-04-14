<script lang="ts">
	import { actions } from '$stores/app'
</script>

<div class="flex flex-col justify-center items-center h-[33vh] tracking-widest">
	<button
		on:click={() => {
			actions.goToMainMenu()
		}}
	>
		Main Menu
	</button>
</div>
