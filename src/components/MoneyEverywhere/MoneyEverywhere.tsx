import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import photo1 from '../../assets/me-photo-1.webp'
import photo2 from '../../assets/me-photo-2.webp'
import photo3 from '../../assets/me-photo-3.webp'
import chipCur from '../../assets/me-chip-cur.webp'
import chipGift from '../../assets/me-chip-gift.webp'
import chipUtil from '../../assets/me-chip-util.webp'
import giftBase from '../../assets/me-gift-base.svg'
import giftRow1 from '../../assets/me-gift-row1.svg'
import giftRow2 from '../../assets/me-gift-row2.svg'
import giftRow3 from '../../assets/me-gift-row3.svg'
import sendPill from '../../assets/me-send.svg'
import attPill from '../../assets/me-att.svg'
import usdCard from '../../assets/me-usd.svg'
import './MoneyEverywhere.css'

/** Adds `is-in` once, the first time the element scrolls into view. */
function useRevealOnce<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null)
  // No IntersectionObserver (old browsers / SSR): show everything immediately.
  const [seen, setSeen] = useState(() => typeof IntersectionObserver === 'undefined')
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, seen] as const
}

/** Per-element reveal tuning: delay, travel distance, duration. */
const r = (delay: number, o: { y?: number; x?: number; t?: number } = {}) =>
  ({
    '--d': `${delay}ms`,
    ...(o.y !== undefined && { '--y': `${o.y}px` }),
    ...(o.x !== undefined && { '--x': `${o.x}px` }),
    ...(o.t !== undefined && { '--t': `${o.t}ms` }),
  }) as CSSProperties

const Chevron = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="me__chev">
    <path d="M9 5.500 15.500 12 9 18.500" fill="none" stroke="currentColor" strokeWidth="2.200" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

type CardProps = {
  id: string
  flip?: boolean
  chipImg: string
  chipText: string
  title: ReactNode
  text: string
  cta: string
  children: ReactNode
}

function Card({ id, flip, chipImg, chipText, title, text, cta, children }: CardProps) {
  const [ref, seen] = useRevealOnce<HTMLElement>()
  return (
    <article
      ref={ref}
      className={`me__card${flip ? ' me__card--flip' : ''}${seen ? ' is-in' : ''}`}
      aria-labelledby={id}
    >
      <div className="me__copy">
        <p className="me__chip me__r" style={r(120)}>
          <img src={chipImg} alt="" className="me__chip-ico" />
          <span>{chipText}</span>
        </p>
        <h3 id={id} className="me__h3 me__r" style={r(180)}>
          {title}
        </h3>
        <p className="me__p me__r" style={r(250)}>
          {text}
        </p>
        <a href="#" className="me__btn me__r" style={r(420, { y: 10 })}>
          {cta}
          <Chevron />
        </a>
      </div>
      <div className="me__photo me__r" style={r(320, { y: 16, t: 640 })}>
        {children}
      </div>
    </article>
  )
}

export default function MoneyEverywhere() {
  const [headRef, headSeen] = useRevealOnce<HTMLHeadingElement>(0.4)
  return (
    <section className="me" aria-labelledby="me-title">
      <h2 ref={headRef} id="me-title" className={`me__title me__head${headSeen ? ' is-in' : ''}`}>
        Your money should <br className="me__br" />
        work everywhere
      </h2>

      <div className="me__list">
        <Card
          id="me-c1"
          chipImg={chipCur}
          chipText="Supports Mult-Currency"
          title={<>Virtual <br />USD Card</>}
          text="Pay online with a virtual USD card for eligible purchases, from digital subscriptions to shopping and travel bookings."
          cta="Learn More"
        >
          <img className="me__img" src={photo1} alt="Two people smiling as they hold their phones together" width={1840} height={1495} loading="lazy" />
        </Card>

        <Card
          id="me-c2"
          flip
          chipImg={chipGift}
          chipText="Top rated Giftcards"
          title={<>Gift Cards <br />Purchases</>}
          text="Turn your gift card balance into something useful, or shop for gift cards from popular brands, all in one place."
          cta="Learn More"
        >
          <img className="me__img" src={photo2} alt="A man smiling at his phone" width={1380} height={1121} loading="lazy" />
          <img className="me__ov me__send me__r" style={r(640, { y: 14, t: 600 })} src={sendPill} alt="Send gift card" />
          <div className="me__ov me__gift me__r" style={r(700, { y: 26, t: 700 })} role="img" aria-label="Amazon, Walmart and Steam gift cards">
            <img className="me__gift-l" src={giftBase} alt="" />
            <img className="me__gift-l me__gift-row me__r" style={r(900, { y: 6, t: 420 })} src={giftRow1} alt="" />
            <img className="me__gift-l me__gift-row me__r" style={r(1000, { y: 6, t: 420 })} src={giftRow2} alt="" />
            <img className="me__gift-l me__gift-row me__r" style={r(1100, { y: 6, t: 420 })} src={giftRow3} alt="" />
          </div>
        </Card>

        <Card
          id="me-c3"
          chipImg={chipUtil}
          chipText="All kind of utilities supported"
          title={<>Everyday <br />Payments</>}
          text="From household bills to mobile top-ups, manage supported payments without the usual back-and-forth between apps."
          cta="Explore Monovex"
        >
          <img className="me__img" src={photo3} alt="A woman smiling at her phone on a train platform" width={1380} height={1121} loading="lazy" />
          <img className="me__ov me__att me__r" style={r(660, { x: -34, y: 0, t: 650 })} src={attPill} alt="$530 AT&T Prepaid Refill Successful" />
          <img className="me__ov me__usd me__r" style={r(780, { y: 20, t: 650 })} src={usdCard} alt="USD Account, balance $600,000" />
        </Card>
      </div>
    </section>
  )
}
