<script lang="ts">
	import { SessionManager } from '../../lib/nakama/SessionManager'

	const logout = () => {
		SessionManager.endSession()
	}
</script>

<slot {logout} />
