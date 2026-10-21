import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import appStoreIcon from '../../assets/dl-appstore.svg'
import googlePlayIcon from '../../assets/dl-googleplay.svg'
import sepIcon from '../../assets/dl-sep.svg'
import photo from '../../assets/dl-photo.webp'
import { PEN_D, RIBBON_D } from './vectorPaths'
import './DownloadApp.css'

/**
 * Two observers on the section:
 *  - `seen`  flips once, the first time it nears the viewport -> entrance plays once and never replays.
 *  - `inView` follows visibility -> the looping trace only runs while the section is on screen.
 */
function useSectionVisibility<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const noIO = typeof IntersectionObserver === 'undefined'
  const [seen, setSeen] = useState(noIO)
  const [inView, setInView] = useState(noIO)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const reveal = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true)
          reveal.disconnect()
        }
      },
      { threshold: 0.18, rootMargin: '0px 0px -6% 0px' },
    )
    const watch = new IntersectionObserver((entries) => {
      entries.forEach((e) => setInView(e.isIntersecting))
    })
    reveal.observe(el)
    watch.observe(el)
    return () => {
      reveal.disconnect()
      watch.disconnect()
    }
  }, [])
  return [ref, seen, inView] as const
}

const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties

export default function DownloadApp() {
  const [ref, seen, inView] = useSectionVisibility<HTMLElement>()
  return (
    <section
      ref={ref}
      className={`dl${seen ? ' is-in' : ''}${inView ? ' is-vis' : ''}`}
      aria-labelledby="dl-title"
    >
      <div className="dl__bg" aria-hidden="true" />
      <div className="dl__stage">
        {/* Decorative ribbon: the filled artwork is revealed by a pen-stroke mask. */}
        <svg className="dl__vec" viewBox="0 0 1200 802" aria-hidden="true" focusable="false">
          <defs>
            <mask id="dl-pen" maskUnits="userSpaceOnUse" x="-300" y="-600" width="2000" height="1800">
              <path
                className="dl__pen"
                d={PEN_D}
                pathLength={1}
                fill="none"
                stroke="#fff"
                strokeWidth="150"
                strokeLinejoin="round"
              />
            </mask>
          </defs>
          <path d={RIBBON_D} fill="#fff" opacity="0.1" mask="url(#dl-pen)" />
        </svg>

        <div className="dl__frame">
          <div className="dl__card dl__r dl__r--card" style={d(160)}>
            <h2 id="dl-title" className="dl__title dl__r" style={d(420)}>
              Take Monovex <br className="dl__br" />
              everywhere <br className="dl__br" />
              you go!
            </h2>
            <p className="dl__text dl__r" style={d(500)}>
              Enjoy greater financial freedom with MONOVEX
            </p>
            <a className="dl__cta dl__r" style={d(580)} href="#top">
              <span>Download the App</span>
              <span className="dl__icons">
                <img src={appStoreIcon} alt="App Store" width={17} height={17} />
                <img className="dl__sep" src={sepIcon} alt="" aria-hidden="true" width={1} height={12} />
                <img src={googlePlayIcon} alt="Google Play" width={17} height={17} />
              </span>
            </a>
          </div>
          <img
            className="dl__photo dl__r dl__r--photo"
            style={d(260)}
            src={photo}
            alt="Smiling woman in sunglasses resting her head on her hand on a sunny lawn"
            width={2000}
            height={1549}
            loading="lazy"
          />
        </div>
      </div>
    </section>
  )
}
