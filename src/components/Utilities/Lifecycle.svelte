<script lang="ts">
  import { onDestroy as onDestroyFn, onMount as onMountFn } from 'svelte'

  export let onDestroy: (() => void) | undefined = undefined
  export let onMount: (() => void) | undefined = undefined

  onDestroyFn(() => {
    onDestroy?.()
  })

  onMountFn(() => {
    onMount?.()
  })
</script>
