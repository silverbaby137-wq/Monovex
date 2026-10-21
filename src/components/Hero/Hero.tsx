import heroWoman from '../../assets/hero-woman.png'
import appStoreIcon from '../../assets/app-store.svg'
import googlePlayIcon from '../../assets/google-play.svg'
import { WalletIcon, BtcIcon, TrxIcon, EthIcon, LtcIcon } from './icons'
import './Hero.css'

function BackgroundShapes() {
  return (
    <svg
      className="hero__shapes"
      viewBox="0 0 1200 720"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* Large swoosh sweeping behind the headline and rising to the top-right */}
      <path
        d="M-40 365 C 260 372 420 392 600 372 C 840 346 960 300 1040 190 C 1100 108 1130 40 1170 -20 L 1250 -20 C 1215 60 1190 150 1150 230 C 1080 360 900 410 760 418 C 560 442 300 420 -40 418 Z"
        fill="#c9b8ff"
        opacity="0.12"
      />
      <ellipse cx="307" cy="732" rx="620" ry="260" fill="#0b0518" opacity="0.45" />
    </svg>
  )
}

export default function Hero() {
  return (
    <section className="hero" id="top">
      <BackgroundShapes />

      <div className="hero__inner">
        <div className="hero__copy">
          <h1 className="hero__title">
            <span>Crypto</span>
            <span>Made Easy</span>
            <span>for Everyone</span>
          </h1>
          <p className="hero__text">
            Receive, hold, and spend crypto like cash instantly with zero exchange fees and full
            wallet control.
          </p>
          <a className="hero__download" href="#top">
            <span>Download the App</span>
            <i className="hero__download-sep" aria-hidden="true" />
            <img src={appStoreIcon} alt="App Store" width={17} height={17} />
            <img src={googlePlayIcon} alt="Google Play" width={17} height={17} />
          </a>
        </div>

        <div className="visual">
          <div className="visual__stage">
            <div className="visual__frame" aria-hidden="true" />
            <img
              className="visual__photo"
              src={heroWoman}
              alt="Woman smiling while looking at her phone"
              width={1433}
              height={1344}
            />

            <div className="visual__coins" aria-label="Supported coins: Bitcoin, Tron, Ethereum, Litecoin">
              <BtcIcon />
              <TrxIcon />
              <EthIcon />
              <LtcIcon />
            </div>

            <div className="visual__wallet">
              <WalletIcon className="visual__wallet-icon" />
              <p className="visual__wallet-label">
                Main Wallet <b>+0.00%</b>
              </p>
              <p className="visual__wallet-amount">$92,768.00</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
