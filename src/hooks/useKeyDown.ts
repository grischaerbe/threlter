import { onDestroy } from 'svelte'

export const useKeyDown = (key: string, callback: (e: KeyboardEvent) => void) => {
  if (typeof window === 'undefined') return

  const hasModifier = key.split('+').length > 1
  const baseKey = hasModifier ? key.split('+')[1] : key
  const modifier: string | undefined = hasModifier ? key.split('+')[0] : undefined

  const onKeyDown = (e: KeyboardEvent) => {
    if (hasModifier) {
      const modifierState = e.getModifierState(modifier!)
      if (!modifierState) return
    }
    if (e.key !== baseKey) return
    callback(e)
  }

  window.addEventListener('keydown', onKeyDown)

  onDestroy(() => {
    window.removeEventListener('keydown', onKeyDown)
  })
}
