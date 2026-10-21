import { useEffect, useRef, useState } from 'react'
import woman from '../../assets/feature-woman.webp'
import { SWOOSH_PATH } from './swoosh'
import './FeatureShowcase.css'

interface Feature {
  number: string
  title: string
  /** Description split into the lines used on desktop. They join on small screens. */
  lines: string[]
}

const features: Feature[] = [
  {
    number: '01',
    title: 'Save',
    lines: ['Put your crypto to work and build your', 'digital wealth over time.'],
  },
  {
    number: '02',
    title: 'Swap',
    lines: ['Exchange your crypto for other digital assets in just', 'a few taps.'],
  },
  {
    number: '03',
    title: 'Send',
    lines: ['Send crypto instantly and securely to anyone,', 'anywhere in the world.'],
  },
  {
    number: '04',
    title: 'Spend',
    lines: ['Pay for everyday essentials with crypto,', 'quickly and seamlessly.'],
  },
]

/** Horizontal offset (design px) of the card row for each active feature. */
const SHIFTS = [0, 0, 190, 735]
const SCROLL_HOLD = 0.07 // share of the scroll kept at each end so the first and last card rest
const STEP_HOLD = 0.2 // share of each step where the active card is fully open

const smooth = (t: number) => {
  const x = Math.min(1, Math.max(0, t))
  return x * x * (3 - 2 * x)
}

/** Pinned (scroll-driven) layout only on large screens and when motion is welcome. */
function usePinned() {
  const query = '(min-width: 1024px) and (min-height: 560px) and (prefers-reduced-motion: no-preference)'
  const [pinned, setPinned] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setPinned(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return pinned
}

export default function FeatureShowcase() {
  const wrapRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const pinned = usePinned()
  const [active, setActive] = useState(0)

  /* Desktop: scroll progress drives every card (no timers). */
  useEffect(() => {
    const wrap = wrapRef.current
    const stage = stageRef.current
    if (!wrap || !stage || !pinned) return
    const cards = Array.from(stage.querySelectorAll<HTMLElement>('.fs__card'))
    const dots = Array.from(stage.querySelectorAll<HTMLElement>('.fs__dot'))
    const last = cards.length - 1

    let target = 0
    let current = 0
    let raf = 0

    const read = () => {
      const r = wrap.getBoundingClientRect()
      const travel = wrap.offsetHeight - window.innerHeight
      const p = travel > 0 ? -r.top / travel : 0
      const t = (Math.min(1, Math.max(0, p)) - SCROLL_HOLD) / (1 - 2 * SCROLL_HOLD)
      target = Math.min(1, Math.max(0, t))
    }

    const apply = (p: number) => {
      const s = p * last
      const k = Math.min(last - 1, Math.floor(s))
      const e = smooth((s - k - STEP_HOLD) / (1 - 2 * STEP_HOLD))
      const act = cards.map((_, i) => (i === k ? 1 - e : i === k + 1 ? e : 0))
      cards.forEach((c, i) => c.style.setProperty('--a', act[i].toFixed(4)))
      dots.forEach((d, i) => d.style.setProperty('--a', act[i].toFixed(4)))
      const shift = SHIFTS[k] + (SHIFTS[k + 1] - SHIFTS[k]) * e
      stage.style.setProperty('--shift', shift.toFixed(2))
      const idx = e > 0.5 ? k + 1 : k
      setActive((prev) => (prev === idx ? prev : idx))
    }

    const tick = () => {
      current += (target - current) * 0.16 // light inertia, still tied to scroll
      if (Math.abs(target - current) < 0.0003) current = target
      apply(current)
      raf = current === target ? 0 : requestAnimationFrame(tick)
    }
    const onScroll = () => {
      read()
      if (!raf) raf = requestAnimationFrame(tick)
    }

    read()
    current = target
    apply(current)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
      stage.style.removeProperty('--shift')
      cards.forEach((c) => c.style.removeProperty('--a'))
      dots.forEach((d) => d.style.removeProperty('--a'))
    }
  }, [pinned])

  /* Tablet / phone / reduced motion: stacked cards, the one nearest the middle is highlighted. */
  useEffect(() => {
    const stage = stageRef.current
    if (!stage || pinned) return
    const cards = Array.from(stage.querySelectorAll<HTMLElement>('.fs__card'))
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) setActive(cards.indexOf(en.target as HTMLElement))
        })
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    cards.forEach((c) => io.observe(c))
    return () => io.disconnect()
  }, [pinned])

  return (
    <section
      ref={wrapRef}
      className={`fs ${pinned ? 'fs--pinned' : 'fs--flow'}`}
      aria-labelledby="fs-title"
    >
      <div ref={stageRef} className="fs__stage">
        <svg
          className="fs__shapes"
          viewBox="0 0 2000 1630"
          preserveAspectRatio={pinned ? 'xMidYMax meet' : 'xMidYMid slice'}
          aria-hidden="true"
        >
          <path
            d={SWOOSH_PATH}
            fill="#fff"
            opacity="0.1"
            transform="matrix(1.6636 -0.0108 -0.0412 1.6104 10.1 21.8)"
          />
        </svg>

        <div className="fs__canvas">
          <header className="fs__head">
            <h2 id="fs-title" className="fs__title">
              One App. Unlimited{' '}
              <br className="fs__br" />
              Possibilities
            </h2>
            <p className="fs__lede">No matter where life takes you, your money follows.</p>
          </header>

          <div className="fs__visual">
            <img
              className="fs__woman"
              src={woman}
              alt="Woman laughing with her hand on her forehead"
              width={2000}
              height={3000}
              draggable={false}
            />
          </div>
          <div className="fs__fade" aria-hidden="true" />

          <div className="fs__track">
            {features.map((f, i) => (
              <article
                key={f.title}
                className={`fs__card${active === i ? ' is-active' : ''}`}
                style={{ ['--a' as string]: i === 0 ? 1 : 0 }}
              >
                <span className="fs__num">{f.number}</span>
                <div className="fs__panel">
                  <h3 className="fs__card-title">{f.title}</h3>
                  <p className="fs__desc">
                    {f.lines.map((line) => (
                      <span key={line} className="fs__line">
                        {line}{' '}
                      </span>
                    ))}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="fs__pill" aria-hidden="true">
            {features.map((f) => (
              <i key={f.title} className="fs__dot" style={{ ['--a' as string]: f.number === '01' ? 1 : 0 }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
