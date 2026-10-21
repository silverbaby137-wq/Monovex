import './Ticker.css'

const labels = [
  'GIFTCARD MARKETPLACE',
  'VIRTUAL CARDS',
  'CRYPTO SWAP',
  'PAY BILLS',
  'GLOBAL REMITTANCE',
]

// Each group repeats the labels so a single group is wider than any screen;
// two identical groups + translateX(-50%) give a seamless loop.
const REPEATS = 4

function Group({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="ticker__group" aria-hidden={hidden || undefined}>
      {Array.from({ length: REPEATS }).flatMap((_, r) =>
        labels.map((label) => (
          <li key={`${r}-${label}`} className="ticker__item">
            <span>{label}</span>
            <i className="ticker__dot" aria-hidden="true" />
          </li>
        )),
      )}
    </ul>
  )
}

export default function Ticker() {
  return (
    <div className="ticker" role="region" aria-label="Monovex features">
      <div className="ticker__track">
        <Group />
        <Group hidden />
      </div>
    </div>
  )
}
