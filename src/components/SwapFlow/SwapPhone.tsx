import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { SolToken, EthToken } from './tokens'
import type { SwapQuote } from './swapService'
import type { useSwapFlow } from './useSwapFlow'
import swapScreen from '../../assets/swap-screen.webp'
import swapSuccess from '../../assets/swap-success.webp'
import './SwapPhone.css'

type Flow = ReturnType<typeof useSwapFlow>

const query = '(prefers-reduced-motion: reduce)'
function useReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(query)
      m.addEventListener('change', cb)
      return () => m.removeEventListener('change', cb)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/** Counts a decimal string up from zero; shows the final value immediately when animation is off. */
function useCountUp(final: string, animate: boolean, delay = 280, duration = 1000) {
  const decimals = final.split('.')[1]?.length ?? 0
  const target = Number(final)
  const [value, setValue] = useState(() => (animate ? (0).toFixed(decimals) : final))
  useEffect(() => {
    if (!animate) return
    let raf = 0
    const t0 = performance.now() + delay
    const tick = (now: number) => {
      const k = Math.min(1, Math.max(0, (now - t0) / duration))
      const eased = 1 - Math.pow(1 - k, 3)
      setValue(k >= 1 ? final : (target * eased).toFixed(decimals))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [animate, final, target, decimals, delay, duration])
  return animate ? value : final
}

/** Presentational pause so the progress bar can visibly finish; success is already confirmed by then. */
const FINISH_MS = 1000

const CheckGlyph = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path className="check-path" d="m5 12.500 4.500 4.500L19 7.500" />
  </svg>
)

function Processing({
  done,
  slow,
  submitting,
  onCancel,
}: {
  done: boolean
  slow: boolean
  submitting: boolean
  onCancel: () => void
}) {
  const sub = done
    ? 'Preparing your receipt'
    : slow
      ? 'Still waiting for network confirmation…'
      : 'Waiting for network confirmation'
  return (
    <section className={`layer px${done ? ' is-done' : ''}`} data-view="processing" aria-label="Swap in progress">
      <div className="px__stage">
        <div className="px__slot px__slot--from">
          <SolToken />
        </div>
        <div className="px__track" aria-hidden="true">
          <i />
        </div>
        <div className="px__slot px__slot--to">
          <EthToken />
        </div>
        <div className="px__tok" aria-hidden="true">
          <SolToken className="px__tok-sol" />
          <EthToken className="px__tok-eth" />
        </div>
        <div className="px__check" aria-hidden="true">
          <CheckGlyph />
        </div>
      </div>

      <h3 className="px__title" data-focus tabIndex={-1}>
        {done ? 'Swap confirmed' : 'Swapping SOL for ETH…'}
      </h3>
      <p className="px__sub">{sub}</p>

      <div
        className="px__bar"
        role="progressbar"
        aria-label="Swap progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={done ? 100 : undefined}
        aria-valuetext={done ? 'Complete' : 'In progress'}
        aria-busy={!done}
      >
        <i />
      </div>

      <button
        type="button"
        className={`px__cancel${submitting || done ? ' is-hidden' : ''}`}
        onClick={onCancel}
        disabled={submitting || done}
        tabIndex={submitting || done ? -1 : 0}
      >
        Cancel swap
      </button>
    </section>
  )
}

function ErrorScreen({
  kind,
  message,
  onRetry,
  onBack,
}: {
  kind: 'failed' | 'cancelled'
  message: string
  onRetry: () => void
  onBack: () => void
}) {
  const failed = kind === 'failed'
  return (
    <section className="layer er" data-view="error" aria-label={failed ? 'Swap failed' : 'Swap cancelled'}>
      <span className={`er__icon${failed ? '' : ' er__icon--neutral'}`} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.600" strokeLinecap="round">
          {failed ? <path d="M12 6v7.500M12 18v.1" /> : <path d="m7 7 10 10M17 7 7 17" />}
        </svg>
      </span>
      <h3 className="er__title" data-focus tabIndex={-1}>
        {failed ? 'Swap failed' : 'Swap cancelled'}
      </h3>
      <p className="er__msg">{message}</p>
      {failed && (
        <button type="button" className="er__primary" onClick={onRetry}>
          Try again
        </button>
      )}
      <button type="button" className={failed ? 'er__link' : 'er__primary'} onClick={onBack}>
        Back to swap
      </button>
    </section>
  )
}

export default function SwapPhone({ flow, quote }: { flow: Flow; quote: SwapQuote }) {
  const reduced = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const { phase, receipt } = flow
  const [revealedFor, setRevealedFor] = useState<string | null>(null)

  // Choreography only: once the service has confirmed, let the progress finish before the receipt shows.
  useEffect(() => {
    if (phase !== 'success' || !receipt) return
    const id = receipt.id
    const t = setTimeout(() => setRevealedFor(id), reduced ? 0 : FINISH_MS)
    return () => clearTimeout(t)
  }, [phase, receipt, reduced])

  const successVisible = phase === 'success' && !!receipt && revealedFor === receipt.id
  const processing = phase === 'submitting' || phase === 'pending' || phase === 'success'
  const errored = phase === 'failed' || phase === 'cancelled'
  const view = successVisible ? 'success' : processing ? 'processing' : errored ? 'error' : 'swap'

  const announceByPhase: Record<string, string> = {
    submitting: 'Submitting your swap.',
    pending: 'Swapping SOL for ETH. Waiting for network confirmation.',
    success: `Swap confirmed. You received ${receipt?.received ?? ''} ETH.`,
    failed: `Swap failed. ${flow.error ?? ''}`,
    cancelled: 'Swap cancelled.',
  }
  const announce = announceByPhase[phase] ?? ''
  const slowMsg = flow.slow && phase === 'pending' ? 'Still waiting for network confirmation. You can cancel the swap.' : ''

  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    rootRef.current
      ?.querySelector<HTMLElement>(`[data-view="${view}"] [data-focus]`)
      ?.focus({ preventScroll: true })
  }, [view])

  const confirm = () => void flow.submit(quote)
  const amount = useCountUp(receipt?.received ?? quote.netReceive, !reduced && successVisible)

  return (
    <div ref={rootRef} className="swp">
      <div className="swp__in">
        <div className="swp__layer" inert={view !== 'swap'} data-view="swap">
          <img
            className="swp__img"
            src={swapScreen}
            alt={`Swap crypto: send ${quote.sendAmount} SOL, receive ${quote.receiveEstimate} ETH. Exchange rate ${quote.rate}, network fee ${quote.networkFee}, Monovex fee ${quote.monovexFee}, you will receive ${quote.netReceive} ETH.`}
          />
        </div>

        {processing && (
          <div className="swp__scr" inert={view !== 'processing'}>
            <Processing
              done={phase === 'success'}
              slow={flow.slow}
              submitting={phase === 'submitting'}
              onCancel={() => void flow.cancel()}
            />
          </div>
        )}

        {errored && (
          <div className="swp__scr">
            <ErrorScreen
              kind={phase === 'failed' ? 'failed' : 'cancelled'}
              message={
                phase === 'failed'
                  ? (flow.error ?? 'Something went wrong. Nothing was exchanged.')
                  : 'Your swap was cancelled before it was confirmed.'
              }
              onRetry={confirm}
              onBack={flow.reset}
            />
          </div>
        )}

        {successVisible && receipt && (
          <div className="swp__ok" data-view="success">
            <img className="swp__img" src={swapSuccess} alt="" />
            <div className="swp__amt" aria-hidden="true">
              {amount}ETH
            </div>
            <h3 className="sr-only" data-focus tabIndex={-1}>
              Swap Successful
            </h3>
            <p className="sr-only">
              You received {receipt.received} ETH. Network fee {receipt.networkFee}. Monovex fee {receipt.monovexFee}.
              Status: completed.
            </p>
            <button type="button" className="swp__close" aria-label="Close" onClick={flow.reset} />
          </div>
        )}
      </div>
      <div className="sr-only" role="status" aria-live="polite">
        {slowMsg || announce}
      </div>
    </div>
  )
}
