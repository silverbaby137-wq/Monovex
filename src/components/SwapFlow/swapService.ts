/**
 * MOCK SWAP SERVICE: demonstration only.
 *
 * The prototype has no backend, so this module plays the part of a swap API:
 * `createSwap` submits an order, `getStatus` is polled for its state and
 * `cancelSwap` asks for it to be cancelled. The UI only ever shows the success
 * screen after `getStatus` (or `cancelSwap`) returns `confirmed`, so replacing
 * this file with calls to a real API is the only change needed to go live.
 * Nothing here talks to a blockchain and no funds move.
 */

export interface SwapQuote {
  from: string
  to: string
  sendAmount: string
  receiveEstimate: string
  rate: string
  networkFee: string
  monovexFee: string
  netReceive: string
}

export interface SwapReceipt {
  id: string
  received: string
  networkFee: string
  monovexFee: string
}

export type SwapStatus =
  | { state: 'pending' }
  | { state: 'confirmed'; receipt: SwapReceipt }
  | { state: 'failed'; reason: string }
  | { state: 'cancelled' }

export interface SwapService {
  createSwap(quote: SwapQuote, signal: AbortSignal): Promise<{ id: string }>
  getStatus(id: string, signal: AbortSignal): Promise<SwapStatus>
  cancelSwap(id: string): Promise<SwapStatus>
}

/** Abortable delay used by the mock and by the polling loop. */
export function sleep(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException('Aborted', 'AbortError'))
      return
    }
    const t = setTimeout(resolve, ms)
    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(t)
        reject(new DOMException('Aborted', 'AbortError'))
      },
      { once: true },
    )
  })
}

export type MockScenario = 'success' | 'failure' | 'slow'

interface Order {
  quote: SwapQuote
  scenario: MockScenario
  polls: number
  cancelled: boolean
  settled: SwapStatus | null
}

const orders = new Map<string, Order>()
/** Developer hook only (no UI): open the page with ?swap=fail or ?swap=slow to exercise those paths. */
const fromUrl = (): MockScenario => {
  const q = typeof location === 'undefined' ? null : new URLSearchParams(location.search).get('swap')
  return q === 'fail' ? 'failure' : q === 'slow' ? 'slow' : 'success'
}
let scenario: MockScenario = fromUrl()
let counter = 0

/** How many status polls the simulated network needs before it settles. */
const POLLS_TO_SETTLE: Record<MockScenario, number> = { success: 4, failure: 3, slow: 11 }

function settle(order: Order, id: string): SwapStatus {
  if (order.settled) return order.settled
  if (order.cancelled) return (order.settled = { state: 'cancelled' })
  if (order.polls < POLLS_TO_SETTLE[order.scenario]) return { state: 'pending' }
  order.settled =
    order.scenario === 'failure'
      ? {
          state: 'failed',
          reason: 'The network could not complete this swap right now. Nothing was exchanged.',
        }
      : {
          state: 'confirmed',
          receipt: {
            id,
            received: order.quote.netReceive,
            networkFee: order.quote.networkFee,
            monovexFee: order.quote.monovexFee,
          },
        }
  return order.settled
}

export const mockSwapService: SwapService & { setScenario(next: MockScenario): void } = {
  setScenario(next) {
    scenario = next
  },
  async createSwap(quote, signal) {
    await sleep(400, signal) // simulated request latency
    const id = `demo-${++counter}`
    orders.set(id, { quote, scenario, polls: 0, cancelled: false, settled: null })
    return { id }
  },
  async getStatus(id, signal) {
    await sleep(300, signal)
    const order = orders.get(id)
    if (!order) return { state: 'failed', reason: 'Swap not found.' }
    order.polls += 1
    return settle(order, id)
  },
  async cancelSwap(id) {
    const order = orders.get(id)
    if (!order) return { state: 'cancelled' }
    // Too late to cancel once the order has settled.
    if (!order.settled && !order.cancelled) order.cancelled = true
    return settle(order, id)
  },
}

export const demoQuote: SwapQuote = {
  from: 'SOL',
  to: 'ETH',
  sendAmount: '20.00',
  receiveEstimate: '0.861',
  rate: '1SOL ~ 0.04305ETH',
  networkFee: '0.00000561 ETH',
  monovexFee: '0.00430 ETH',
  netReceive: '0.85589',
}
