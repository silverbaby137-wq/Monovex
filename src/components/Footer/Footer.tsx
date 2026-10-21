import logo from '../../assets/ft-logo.svg'
import scan from '../../assets/ft-scan.svg'
import './Footer.css'

const socials = ['Instagram', 'Linkedin', 'Twitter', 'Facebook']
const legal = ['Terms', 'Policy', 'Security']

export default function Footer() {
  return (
    <div className="ft">
      <section className="ft__cta" aria-labelledby="ft-title">
        <h2 id="ft-title" className="ft__big">
          Beyond <br />
          Borders
        </h2>
        <img
          className="ft__qr"
          src={scan}
          alt="QR code: scan to download the Monovex app"
          width={319}
          height={350}
          loading="lazy"
        />
      </section>

      <footer className="ft__foot">
        <div className="ft__grid">
          <div className="ft__brand">
            <a href="#top" aria-label="Monovex home">
              <img className="ft__logo" src={logo} alt="Monovex" width={155} height={29} />
            </a>
            <p className="ft__tag">Your money. Your world.</p>
            <p className="ft__rights">All rights reserved © 2026 Monovex</p>
          </div>

          <nav className="ft__col" aria-label="Socials">
            <h3 className="ft__h">Socials</h3>
            <ul className="ft__list ft__list--social">
              {socials.map((s) => (
                <li key={s}>
                  <a href="#">{s}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ft__col">
            <h3 className="ft__h">Company</h3>
            <ul className="ft__list ft__list--company">
              <li><a href="tel:+12125550142">+1 (212) 555-0142</a></li>
              <li>
                <address>88 Madison Avenue, Suite 1200, New York, NY 10016, United States.</address>
              </li>
              <li><a href="mailto:hello@monovex.com">hello@monovex.com</a></li>
            </ul>
          </div>
        </div>

        <nav className="ft__legal" aria-label="Legal">
          {legal.map((l) => (
            <a key={l} href="#">{l}</a>
          ))}
        </nav>
      </footer>
    </div>
  )
}
