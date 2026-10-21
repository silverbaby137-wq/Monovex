import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>

export const WalletIcon = (p: P) => (
  <svg viewBox="0 0 28 28" aria-hidden="true" {...p}>
    <circle cx="10.5" cy="10.5" r="9" fill="#a79df4" />
    <circle cx="17" cy="16.5" r="9.5" fill="#8f84ee" stroke="#fff" strokeWidth="1.4" />
    <path d="M15.2 12.6 19 16.5l-3.8 3.9" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const BtcIcon = (p: P) => (
  <svg viewBox="0 0 32 32" aria-hidden="true" {...p}>
    <circle cx="16" cy="16" r="16" fill="#f7931a" />
    <path
      fill="#fff"
      d="M22.2 14.1c.3-2.1-1.3-3.2-3.5-4l.7-2.9-1.8-.4-.7 2.8-1.4-.3.7-2.8-1.7-.4-.7 2.9-1.1-.3-2.4-.6-.5 1.9s1.3.3 1.3.3c.7.2.8.6.8 1l-.8 3.3c0 0 .1 0 .2.1h-.2l-1.2 4.7c-.1.2-.3.6-.8.4 0 0-1.3-.3-1.3-.3l-.9 2 2.3.6 1.3.3-.7 3 1.8.4.7-2.9 1.4.4-.7 2.9 1.8.4.7-3c3 .6 5.3.3 6.300-2.4.8-2.200 0-3.400-1.600-4.200 1.100-.3 2-1 2.200-2.600zm-4 5.600c-.5 2.200-4.200 1-5.400.7l1-3.900c1.200.3 5 .9 4.400 3.200zm.6-5.600c-.5 2-3.500 1-4.500.7l.9-3.500c1 .2 4.100.7 3.600 2.800z"
    />
  </svg>
)

export const TrxIcon = (p: P) => (
  <svg viewBox="0 0 32 32" aria-hidden="true" {...p}>
    <circle cx="16" cy="16" r="16" fill="#ef0027" />
    <path
      fill="#fff"
      d="m8.1 8.4 14.700 2.700c.6.100 1 .6.800 1.200l-.3.800-6.700 9.800zm.8 1.300 9.400 9.600 3.800-5.700zm8.500 11.700 5.100-7.600-.4 1z"
      opacity=".95"
    />
    <path fill="#fff" d="M8.200 8.600 17 21.700l.5-.7z" opacity=".35" />
  </svg>
)

export const EthIcon = (p: P) => (
  <svg viewBox="0 0 32 32" aria-hidden="true" {...p}>
    <circle cx="16" cy="16" r="16" fill="#eef0f5" />
    <g fill="#343434">
      <path d="m16 5.500-.1.3v10.300l.1.1 5.500-3.200z" opacity=".8" />
      <path d="m16 5.500-5.500 7.500 5.500 3.200z" />
      <path d="m16 17.600-.1.100v4.700l.1.200 5.500-7.700z" opacity=".8" />
      <path d="M16 22.600v-5L10.500 14.900z" />
      <path d="m16 16.200 5.500-3.200-5.500-2.400z" opacity=".55" />
      <path d="m10.500 13 5.500 3.200v-5.600z" opacity=".75" />
    </g>
  </svg>
)

export const LtcIcon = (p: P) => (
  <svg viewBox="0 0 32 32" aria-hidden="true" {...p}>
    <circle cx="16" cy="16" r="16" fill="#345d9d" />
    <path
      fill="#fff"
      d="M10.500 22.500 12 17.200l-1.900.7.5-1.800 1.900-.7 2.200-7.500h4.500l-1.800 6.200 1.900-.7-.5 1.700-1.900.7-.8 2.800h7.600l-.9 3.100z"
    />
  </svg>
)
