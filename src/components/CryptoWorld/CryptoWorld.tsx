import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import eth from '../../assets/coins/eth.webp'
import btc from '../../assets/coins/btc.webp'
import matic from '../../assets/coins/matic.webp'
import eos from '../../assets/coins/eos.webp'
import usdc from '../../assets/coins/usdc.webp'
import sol from '../../assets/coins/sol.webp'
import './CryptoWorld.css'

/**
 * Coin placement is measured from the Figma reference and expressed as
 * percentages of the coin group, so the arrangement scales with the group.
 * Later coins sit in front of earlier ones.
 */
interface Coin {
  name: string
  src: string
  left: number
  top: number
  width: number
}

const coins: Coin[] = [
  {
    name: 'Ethereum',
    src: eth,
    left: 0,
    top: 34.6,
    width: 31.22,
  },
  {
    name: 'Bitcoin',
    src: btc,
    left: 12.04,
    top: 11.96,
    width: 32.88,
  },
  {
    name: 'Polygon',
    src: matic,
    left: 26.22,
    top: 2.69,
    width: 32.87,
  },
  {
    name: 'EOS',
    src: eos,
    left: 42.68,
    top: 0,
    width: 32.87,
  },
  {
    name: 'USD Coin',
    src: usdc,
    left: 58.29,
    top: 5.72,
    width: 32.87,
  },
  {
    name: 'Solana',
    src: sol,
    left: 67.13,
    top: 29.81,
    width: 32.87,
  },
]

function coinStyle(c: Coin, i: number): CSSProperties {
  return {
    left: `${c.left}%`,
    top: `${c.top}%`,
    width: `${c.width}%`,
    zIndex: i + 1,
  }
}

/**
 * Scroll-linked travelling wave. As the section scrolls through the viewport a
 * wave passes along the arc: each coin lifts and settles a beat after its
 * neighbour, the arc bends (middle coins travel further than the outer ones)
 * and the coins fan out slightly. At rest the arrangement matches the design
 * exactly, and the coins hold perfectly still.
 */
const N = coins.length
const AMP_Y = 3.5 // % of a coin's own height
const AMP_X = 1.6 // % of a coin's own width
const AMP_R = 2 // degrees
const WAVES = 1.4 // wave cycles across the whole scroll

function useScrollWave(group: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = group.current
    if (!root) return
    const els = Array.from(root.querySelectorAll<HTMLElement>('.world__coin'))
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let target = 0.5
    let current = 0.5
    let raf = 0

    const readProgress = () => {
      const r = root.getBoundingClientRect()
      const vh = window.innerHeight
      // 0 as the group enters at the bottom, 1 as it leaves at the top
      target = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)))
    }

    const apply = (p: number) => {
      const theta = (p - 0.5) * 2 * Math.PI * WAVES
      els.forEach((el, i) => {
        const phase = (i / (N - 1)) * 2 * Math.PI
        const y = AMP_Y * (Math.cos(phase - theta) - Math.cos(phase))
        const r = AMP_R * (Math.sin(phase - theta) - Math.sin(phase))
        const x = AMP_X * (((i - (N - 1) / 2) / ((N - 1) / 2)) * Math.sin(theta))
        el.style.transform = `translate3d(${x}%, ${y}%, 0) rotate(${r}deg)`
      })
    }

    const tick = () => {
      current += (target - current) * 0.12 // gentle inertia
      apply(current)
      raf = Math.abs(target - current) > 0.0004 ? requestAnimationFrame(tick) : 0
    }
    const onScroll = () => {
      readProgress()
      if (!raf) raf = requestAnimationFrame(tick)
    }

    readProgress()
    current = target
    apply(current)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [group])
}

export default function CryptoWorld() {
  const groupRef = useRef<HTMLDivElement>(null)
  useScrollWave(groupRef)

  return (
    <section className="world" aria-labelledby="world-title">
      <div ref={groupRef} className="world__coins" role="img" aria-label="Floating Ethereum, Bitcoin, Polygon, EOS, USD Coin and Solana coins">
        {coins.map((c, i) => (
          <div key={c.name} className="world__coin" style={coinStyle(c, i)}>
            <img src={c.src} alt="" width={695} height={563} draggable={false} />
          </div>
        ))}
      </div>

      <h2 id="world-title" className="world__title">
        Your world of crypto
      </h2>
      <p className="world__text">
        Explore the world's leading cryptocurrencies, all in one<br className="world__br" /> place. Discover digital assets, track market movements, and<br className="world__br" /> build your portfolio with Monovex.
      </p>
    </section>
  )
}
