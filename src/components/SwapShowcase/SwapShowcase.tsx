import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import SwapPhone from '../SwapFlow/SwapPhone'
import { demoQuote, mockSwapService } from '../SwapFlow/swapService'
import { useSwapFlow } from '../SwapFlow/useSwapFlow'
import { useAutoDemoTrigger } from './autoDemo'
import card1 from '../../assets/swap-card-1.webp'
import card2 from '../../assets/swap-card-2.webp'
import card3 from '../../assets/swap-card-3.webp'
import card4 from '../../assets/swap-card-4.webp'
import './SwapShowcase.css'

const cards = [
  { src: card1, alt: '01 One-Click Conversion. No long wait. Just select, swap, and you’re done.' },
  { src: card2, alt: '02 Best Market Rates. Get the most competitive rates in the market.' },
  { src: card3, alt: '03 No Hidden Fees. Transparent fees, displayed upfront, no surprises.' },
  { src: card4, alt: '04 Fast Settlements. Receive your instant payments without delays.' },
]

/** Live visible fraction of an element, reported as it crosses the given thresholds. */
function useVisibleRatio<T extends Element>(thresholds: number[]) {
  const ref = useRef<T>(null)
  const [ratio, setRatio] = useState(() => (typeof IntersectionObserver === 'undefined' ? 1 : 0))
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => setRatio(e.isIntersecting ? e.intersectionRatio : 0), {
      threshold: thresholds,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [thresholds])
  return [ref, ratio] as const
}

const SECTION_T = [0, 0.12]
const PANEL_T = [0, 0.5]

const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties

export default function SwapShowcase() {
  // Simulated transaction: see SwapFlow/swapService.ts. Swap in the real API client there.
  const flow = useSwapFlow(mockSwapService)

  const [sectionRef, sectionRatio] = useVisibleRatio<HTMLElement>(SECTION_T)
  const [panelRef, panelRatio] = useVisibleRatio<HTMLDivElement>(PANEL_T)
  const sectionInView = sectionRatio >= 0.12
  const panelInView = panelRatio >= 0.5
  const panelVisible = panelRatio > 0

  // Scroll-in reveal plays once.
  const [seen, setSeen] = useState(false)
  if (sectionInView && !seen) setSeen(true)

  // DEMO ONLY: leaving the panel resets the demo, so coming back replays it from the swap screen.
  const { phase, reset } = flow
  useEffect(() => {
    if (!panelVisible && phase !== 'idle') reset()
  }, [panelVisible, phase, reset])

  // DEMO ONLY: start the simulated swap 2s after the swap screen is on view.
  useAutoDemoTrigger(panelInView && flow.phase === 'idle', () => void flow.submit(demoQuote))

  return (
    <section ref={sectionRef} className={`ss${seen ? ' is-in' : ''}`} aria-labelledby="ss-title">
      <div className="ss__head">
        <h2 id="ss-title" className="ss__title ss__r" style={d(0)}>
          One Click. <br />
          Instant Swap
        </h2>
        <span className="ss__rule ss__r ss__r--rule" style={d(200)} aria-hidden="true" />
      </div>

      <div className="ss__grid">
        {cards.map((c, i) => (
          <img
            key={c.src}
            className={`ss__card ss__card--${i + 1} ss__r`}
            style={d([420, 560, 700, 840][i])}
            src={c.src}
            alt={c.alt}
            loading="lazy"
          />
        ))}
        <div ref={panelRef} className="ss__panel ss__r ss__r--panel" style={d(300)}>
          <SwapPhone flow={flow} quote={demoQuote} />
        </div>
      </div>
    </section>
  )
}
