import { useCallback, useEffect, useReducer, useRef } from 'react'
import { sleep } from './swapService'
import type { SwapQuote, SwapReceipt, SwapService } from './swapService'

export type SwapPhase = 'idle' | 'submitting' | 'pending' | 'success' | 'failed' | 'cancelled'

interface State {
  phase: SwapPhase
  slow: boolean
  receipt: SwapReceipt | null
  error: string | null
}

type Action =
  | { type: 'submit' }
  | { type: 'pending' }
  | { type: 'slow' }
  | { type: 'success'; receipt: SwapReceipt }
  | { type: 'fail'; message: string }
  | { type: 'cancelled' }
  | { type: 'reset' }

const initial: State = { phase: 'idle', slow: false, receipt: null, error: null }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'submit':
      return { ...initial, phase: 'submitting' }
    case 'pending':
      return { ...state, phase: 'pending' }
    case 'slow':
      return { ...state, slow: true }
    case 'success':
      return { ...state, phase: 'success', receipt: action.receipt }
    case 'fail':
      return { ...state, phase: 'failed', error: action.message }
    case 'cancelled':
      return { ...state, phase: 'cancelled' }
    default:
      return initial
  }
}

const POLL_MS = 1000
/** Only used to *say* the network is slow; never treated as proof of anything. */
const SLOW_AFTER_MS = 7000

const isAbort = (e: unknown) => e instanceof DOMException && e.name === 'AbortError'

/**
 * Drives a swap through submit → poll → settled. The success phase is only
 * reached when the service itself reports `confirmed`.
 */
export function useSwapFlow(service: SwapService) {
  const [state, dispatch] = useReducer(reducer, initial)
  const busy = useRef(false)
  const abort = useRef<AbortController | null>(null)
  const orderId = useRef<string | null>(null)

  useEffect(() => () => abort.current?.abort(), [])

  const submit = useCallback(
    async (quote: SwapQuote) => {
      if (busy.current) return // guards against duplicate submissions
      busy.current = true
      const ac = new AbortController()
      abort.current = ac
      orderId.current = null
      dispatch({ type: 'submit' })
      try {
        const { id } = await service.createSwap(quote, ac.signal)
        if (ac.signal.aborted) return
        orderId.current = id
        dispatch({ type: 'pending' })
        const started = performance.now()
        for (;;) {
          await sleep(POLL_MS, ac.signal)
          const status = await service.getStatus(id, ac.signal)
          if (ac.signal.aborted) return // reset or cancelled while waiting
          if (status.state === 'confirmed') {
            dispatch({ type: 'success', receipt: status.receipt })
            return
          }
          if (status.state === 'failed') {
            dispatch({ type: 'fail', message: status.reason })
            return
          }
          if (status.state === 'cancelled') {
            dispatch({ type: 'cancelled' })
            return
          }
          if (performance.now() - started > SLOW_AFTER_MS) dispatch({ type: 'slow' })
        }
      } catch (e) {
        if (!isAbort(e)) {
          dispatch({
            type: 'fail',
            message: 'We could not reach the swap service. Nothing was exchanged.',
          })
        }
      } finally {
        if (abort.current === ac) busy.current = false
      }
    },
    [service],
  )

  const cancel = useCallback(async () => {
    const id = orderId.current
    if (!id) return
    abort.current?.abort() // stop polling, then ask the service what happened
    try {
      const status = await service.cancelSwap(id)
      if (status.state === 'confirmed') dispatch({ type: 'success', receipt: status.receipt })
      else if (status.state === 'failed') dispatch({ type: 'fail', message: status.reason })
      else dispatch({ type: 'cancelled' })
    } catch {
      dispatch({ type: 'fail', message: 'We could not confirm the cancellation. Please check your activity.' })
    }
  }, [service])

  /** Back to the swap screen; also stops any swap still in flight. */
  const reset = useCallback(() => {
    abort.current?.abort()
    busy.current = false
    orderId.current = null
    dispatch({ type: 'reset' })
  }, [])

  return { ...state, submit, cancel, reset }
}
