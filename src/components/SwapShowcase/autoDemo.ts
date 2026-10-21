import { useEffect, useRef } from 'react'

/**
 * DEMO ONLY: prototype choreography, kept apart from the swap logic.
 *
 * The section shows the normal swap screen, and after AUTO_START_MS (2s) of being on
 * screen it submits the *mock* swap (see SwapFlow/swapService.ts) by itself.
 * Nothing here decides whether a swap succeeded; the success screen still
 * waits for the service's `confirmed` response. Delete this file (and the one
 * call in SwapShowcase) to return to a user-triggered flow.
 */
export const AUTO_START_MS = 2_000

/**
 * Runs `onFire` once after `delay` ms while `active` stays true. The timer is
 * cleared when `active` turns false (section left, flow already started) or on unmount.
 */
export function useAutoDemoTrigger(active: boolean, onFire: () => void, delay = AUTO_START_MS) {
  const latest = useRef(onFire)
  useEffect(() => {
    latest.current = onFire
  })
  useEffect(() => {
    if (!active) return
    const t = setTimeout(() => latest.current(), delay)
    return () => clearTimeout(t)
  }, [active, delay])
}
