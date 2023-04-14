<script lang="ts">
  import TopBar from '../components/TopBar.svelte'
</script>

<div class="flex flex-col relative w-full h-full top-0 left-0 gap-[15px] uppercase">
  <TopBar>
    <slot
      name="topbar-left"
      slot="left"
    />
    <slot
      name="topbar-center"
      slot="center"
    />
    <slot
      name="topbar-right"
      slot="right"
    />
  </TopBar>

  <div class="relative w-full h-full min-h-0">
    <slot />
  </div>
</div>
