import { onDestroy } from 'svelte'

export const useKeyPress = (key: string, callback: (e: KeyboardEvent) => void) => {
  if (typeof window === 'undefined') return

  const hasModifier = key.split('+').length > 1
  const baseKey = hasModifier ? key.split('+')[1] : key
  const modifier: string | undefined = hasModifier ? key.split('+')[0] : undefined

  const onKeyPress = (e: KeyboardEvent) => {
    if (hasModifier) {
      const modifierState = e.getModifierState(modifier!)
      if (!modifierState) return
    }
    if (e.key !== baseKey) return
    callback(e)
  }

  window.addEventListener('keypress', onKeyPress)

  onDestroy(() => {
    window.removeEventListener('keypress', onKeyPress)
  })
}
