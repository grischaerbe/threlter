<script lang="ts">
  import { tweened } from 'svelte/motion'
  import UiWrapper from './UiWrapper.svelte'

  /**
   * Normalized percentage of loading progress (0-1)
   * @type {number}
   */
  export let progress: number | undefined = undefined

  const progressSpring = tweened(progress ?? 0, {
    duration: 100
  })
  $: progressSpring.set(progress ?? 0)
</script>

<UiWrapper>
  <div
    class="absolute top-0 left-0 w-full h-full bg-black text-white flex flex-row items-center justify-center"
  >
    LOADING{progress !== undefined ? ` ${Math.ceil($progressSpring * 100)}%` : ''}
  </div>
</UiWrapper>
