import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode, SVGProps } from 'react'
import { BtcIcon, EthIcon } from '../Hero/icons'
import womanImg from '../../assets/real-money-woman.webp'
import avatarImg from '../../assets/avatar-anna.webp'
import coinPound from '../../assets/coin-pound.svg'
import coinDollar from '../../assets/coin-dollar.svg'
import './RealMoney.css'

type P = SVGProps<SVGSVGElement>

const WalletGlyph = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M5 3.5h11.2c1 0 1.800.8 1.800 1.800V6H5.500a.5.5 0 0 0 0 1H19a2 2 0 0 1 2 2v9.500a2.500 2.500 0 0 1-2.500 2.500h-13A2.500 2.500 0 0 1 3 18.500V6a2.500 2.500 0 0 1 2-2.500Zm11 9.500a1.300 1.300 0 1 0 0 2.600 1.300 1.300 0 0 0 0-2.600Z"
    />
  </svg>
)

const SwapGlyph = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.700" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M4 11V8a3 3 0 0 1 3-3h12M16 2l3 3-3 3" />
    <path d="M20 13v3a3 3 0 0 1-3 3H5M8 22l-3-3 3-3" />
  </svg>
)

const PlaneGlyph = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
    <path
      fill="currentColor"
      d="M21.800 2.600a.8.8 0 0 0-.9-.2L2.500 9.500a.8.8 0 0 0 0 1.500l6.900 2.700 2.800 7.500a.8.8 0 0 0 1.500 0l8.200-17.200a.8.8 0 0 0-.1-.9ZM11 11.700 9.400 9.800l8.100-3.300-6.500 5.200Z"
    />
  </svg>
)

const PhoneGlyph = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M8 2.500h8A2.500 2.500 0 0 1 18.500 5v14a2.500 2.500 0 0 1-2.500 2.500H8A2.500 2.500 0 0 1 5.500 19V5A2.500 2.500 0 0 1 8 2.500Zm4 15a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"
    />
  </svg>
)

const SolIcon = (p: P) => (
  <svg viewBox="0 0 36 36" aria-hidden="true" {...p}>
    <defs>
      <linearGradient id="rm-sol" x1="9" y1="27" x2="27" y2="9" gradientUnits="userSpaceOnUse">
        <stop stopColor="#9945ff" />
        <stop offset="1" stopColor="#14f195" />
      </linearGradient>
    </defs>
    <circle cx="18" cy="18" r="18" fill="#0c0619" />
    <g fill="url(#rm-sol)">
      <path d="M12 21.400a.6.6 0 0 1 .4-.2h13.300c.3 0 .5.4.3.6l-2.200 2.300a.6.6 0 0 1-.4.2H10.100c-.3 0-.5-.4-.3-.6Z" />
      <path d="M12 11.900a.6.6 0 0 1 .4-.2h13.300c.3 0 .5.4.3.600L23.800 14.600a.6.6 0 0 1-.4.2H10.100c-.3 0-.5-.4-.3-.600Z" />
      <path d="M23.800 16.600a.6.6 0 0 0-.4-.2H10.100c-.3 0-.5.400-.3.600L12 19.300c.1.100.3.200.4.200h13.300c.3 0 .5-.4.3-.6Z" />
    </g>
  </svg>
)

const items: { icon: ReactNode; text: string }[] = [
  { icon: <WalletGlyph />, text: 'Your money, always within reach' },
  { icon: <SwapGlyph />, text: 'Exchange crypto in seconds' },
  { icon: <PlaneGlyph />, text: 'Send money across borders' },
  { icon: <PhoneGlyph />, text: 'Grow your wealth with confidence' },
]

/** Adds `is-in` once the section scrolls into view; the reveal plays once. */
function useRevealOnce<T extends HTMLElement>() {
  const ref = useRef<T>(null)
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
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, seen] as const
}

const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties

export default function RealMoney() {
  const [ref, seen] = useRevealOnce<HTMLElement>()

  return (
    <section ref={ref} className={`rm${seen ? ' is-in' : ''}`} aria-labelledby="rm-title">
      <h2 id="rm-title" className="rm__title rm__r" style={d(0)}>
        Use Crypto like <br className="rm__br" />
        Real Money
      </h2>
      <p className="rm__lead rm__r" style={d(110)}>
        Pay for everyday purchases, send money <br className="rm__br" />
        worldwide, and swap digital assets seamlessly, <br className="rm__br" />
        all from one powerful app.
      </p>

      <div className="rm__grid">
        <div className="rm__panel rm__panel--purple rm__r rm__r--panel" style={d(240)}>
          <div className="rm__in">
          <ul className="rm__list">
            {items.map((it, i) => (
              <li key={it.text} className="rm__item rm__r" style={d(520 + i * 90)}>
                <span className="rm__ico">{it.icon}</span>
                {it.text}
              </li>
            ))}
          </ul>

          <div className="rm__comp">
            <div className="rm__comp-in">
              {[3, 2, 1, 0].map((n) => (
                <img
                  key={n}
                  className="rm__coin rm__coin--dollar rm__r rm__r--pop"
                  style={{ ...d(700), '--n': n } as CSSProperties}
                  src={coinDollar}
                  alt=""
                />
              ))}
              <img className="rm__coin rm__coin--pound rm__r rm__r--pop" style={d(820)} src={coinPound} alt="" />

              <div className="rm__sent rm__r rm__r--pop" style={d(1000)}>
                <img className="rm__avatar" src={avatarImg} alt="" />
                <SolIcon className="rm__sol" />
                <div className="rm__sent-txt">
                  <strong>0.7010 Sol</strong>
                  <span>Successfully sent to Anna Perry</span>
                </div>
              </div>

              <div className="rm__swap rm__r rm__r--pop" style={d(1150)}>
                <div className="rm__pair">
                  <BtcIcon className="rm__pair-btc" />
                  <EthIcon className="rm__pair-eth" />
                </div>
                <div className="rm__amount">
                  <SwapGlyph />
                  0.4BTC
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>

        <div className="rm__panel rm__panel--photo rm__r rm__r--panel" style={d(380)}>
          <img src={womanImg} alt="Smiling woman looking at her phone" />
        </div>
      </div>
    </section>
  )
}
