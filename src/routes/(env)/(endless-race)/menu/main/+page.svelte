<script lang="ts">
	import BottomBar from '$components/UI/components/BottomBar.svelte'
	import SpecialButton from '../../../../../components/UI/components/SpecialButton.svelte'
	import { Nakama } from '../../../../../lib/nakama/Nakama'
	import { SessionManager } from '../../../../../lib/nakama/SessionManager'
</script>

<BottomBar>
	<SpecialButton style="inverted" href="https://legrisch.com" class="text-[0.5em]" slot="right">
		Made by Grischa Erbe
	</SpecialButton>
</BottomBar>
