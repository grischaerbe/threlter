import { currentWritable } from '@threlte/core'
import { onDestroy } from 'svelte'
import { derived } from 'svelte/store'

export const useArrowKeys = () => {
  type Key = 'ArrowUp' | 'ArrowLeft' | 'ArrowDown' | 'ArrowRight'

  const arrowKeys = currentWritable<Record<Key, boolean>>({
    ArrowUp: false,
    ArrowLeft: false,
    ArrowDown: false,
    ArrowRight: false
  })

  const keys = Object.keys(arrowKeys.current) as string[]

  const mapWASDToArrowKeys = (e:KeyboardEvent) => {
    switch(e.code){
      case 'KeyW': return 'ArrowUp'
      case 'KeyA': return 'ArrowLeft'
      case 'KeyS': return 'ArrowDown'
      case 'KeyD': return 'ArrowRight'
    }
    return e.key;
  }

  const onKeyDown = (e: KeyboardEvent) => {
    const key = mapWASDToArrowKeys(e);
    if (!keys.includes(key)) return
    e.preventDefault()
    arrowKeys.update((keys) => {
      keys[key as keyof typeof keys] = true
      return keys
    })
  }

  const onKeyUp = (e: KeyboardEvent) => {
    const key = mapWASDToArrowKeys(e);
    if (!keys.includes(key)) return
    e.preventDefault()
    arrowKeys.update((keys) => {
      keys[key as keyof typeof keys] = false
      return keys
    })
  }

  const axis = derived(arrowKeys, (wasdKeys) => {
    return {
      x: 0 + (wasdKeys.ArrowLeft ? 1 : 0) - (wasdKeys.ArrowRight ? 1 : 0),
      y: 0 + (wasdKeys.ArrowUp ? 1 : 0) - (wasdKeys.ArrowDown ? 1 : 0)
    }
  })

  const onVisibilityChange = () => {
    if (document.visibilityState === 'hidden' || document.hidden) {
      arrowKeys.set({
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,
        ArrowUp: false
      })
    }
  }

  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  window.addEventListener('visibilitychange', onVisibilityChange)
  onDestroy(() => {
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('keyup', onKeyUp)
    window.removeEventListener('visibilitychange', onVisibilityChange)
  })

  return {
    axis,
    arrowKeys
  }
}
