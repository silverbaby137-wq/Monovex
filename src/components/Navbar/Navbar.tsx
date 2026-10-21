import { useEffect, useRef, useState } from 'react'
import logo from '../../assets/logo.svg'
import './Navbar.css'

const links = ['Individual', 'Business', 'Buy', 'Trade']

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

  // Mobile menu: Escape or an outside tap closes it, focus returns to the toggle,
  // and it closes itself if the viewport grows into the desktop layout.
  useEffect(() => {
    if (!open) return
    firstLinkRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    const onPointer = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setOpen(false)
    }
    const mq = window.matchMedia('(min-width: 721px)')
    const onMq = () => mq.matches && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    mq.addEventListener('change', onMq)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
      mq.removeEventListener('change', onMq)
    }
  }, [open])

  return (
    <header className="nav" ref={headerRef}>
      <div className="nav__pill">
        <a className="nav__brand" href="#top" aria-label="Monovex home">
          <img src={logo} alt="" width={54} height={28.5} />
          <span>Monovex</span>
        </a>

        <nav id="nav-menu" className={`nav__links${open ? ' is-open' : ''}`} aria-label="Primary">
          {links.map((l, i) => (
            <a key={l} href="#top" ref={i === 0 ? firstLinkRef : undefined} onClick={() => setOpen(false)}>
              {l}
            </a>
          ))}
          <div className="nav__menu-actions">
            <a className="nav__signin" href="#top" onClick={() => setOpen(false)}>
              Sign In
            </a>
            <a className="nav__cta" href="#top" onClick={() => setOpen(false)}>
              Create Free Account
            </a>
          </div>
        </nav>

        <div className="nav__actions">
          <a className="nav__signin" href="#top">
            Sign In
          </a>
          <a className="nav__cta" href="#top">
            Create Free Account
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="nav__toggle"
            aria-expanded={open}
            aria-controls="nav-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  )
}
