<script lang="ts">
  import { T } from '@threlte/core'
  import { createEventDispatcher, onMount } from 'svelte'
  import { Box3, Group, Sphere, Vector3 } from 'three'

  let group: Group

  let position = new Vector3()

  let sphere = new Sphere()

  const dispatch = createEventDispatcher<{
    spherecalculated: Sphere
    positionend: void
  }>()

  onMount(() => {
    setTimeout(() => {
      group.updateWorldMatrix(true, true)
      const bbox = new Box3().setFromObject(group)

      bbox.getCenter(position)
      position = position.multiplyScalar(-1)

      bbox.getBoundingSphere(sphere)

      dispatch('spherecalculated', sphere)

      setTimeout(() => {
        dispatch('positionend')
      }, 300)
    }, 300)
  })
</script>

<T.Group
  bind:ref={group}
  position={position.toArray()}
>
  <slot />
</T.Group>
