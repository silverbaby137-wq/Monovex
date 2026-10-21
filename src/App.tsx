import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import Ticker from './components/Ticker/Ticker'
import CryptoWorld from './components/CryptoWorld/CryptoWorld'
import FeatureShowcase from './components/FeatureShowcase/FeatureShowcase'
import RealMoney from './components/RealMoney/RealMoney'
import MoneyEverywhere from './components/MoneyEverywhere/MoneyEverywhere'
import DownloadApp from './components/DownloadApp/DownloadApp'
import Footer from './components/Footer/Footer'
import SwapShowcase from './components/SwapShowcase/SwapShowcase'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Ticker />
        <CryptoWorld />
        <FeatureShowcase />
        <RealMoney />
        <SwapShowcase />
        <MoneyEverywhere />
        <DownloadApp />
      </main>
      <Footer />
    </>
  )
}
