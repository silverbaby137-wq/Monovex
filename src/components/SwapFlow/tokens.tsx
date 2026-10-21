import type { SVGProps } from 'react'
import { EthIcon } from '../Hero/icons'

type P = SVGProps<SVGSVGElement>

export const SolToken = (p: P) => (
  <svg viewBox="0 0 36 36" aria-hidden="true" {...p}>
    <defs>
      <linearGradient id="sw-sol" x1="9" y1="27" x2="27" y2="9" gradientUnits="userSpaceOnUse">
        <stop stopColor="#9945ff" />
        <stop offset="1" stopColor="#14f195" />
      </linearGradient>
    </defs>
    <circle cx="18" cy="18" r="18" fill="#0c0619" />
    <g fill="url(#sw-sol)">
      <path d="M12 21.400a.6.6 0 0 1 .4-.2h13.300c.3 0 .5.4.3.6l-2.200 2.300a.6.6 0 0 1-.4.2H10.100c-.3 0-.5-.4-.3-.6Z" />
      <path d="M12 11.900a.6.6 0 0 1 .4-.2h13.300c.3 0 .5.4.3.600L23.800 14.600a.6.6 0 0 1-.4.2H10.100c-.3 0-.5-.4-.3-.600Z" />
      <path d="M23.800 16.600a.6.6 0 0 0-.4-.2H10.100c-.3 0-.5.400-.3.600L12 19.300c.1.100.3.200.4.200h13.300c.3 0 .5-.4.3-.6Z" />
    </g>
  </svg>
)

export const EthToken = (p: P) => <EthIcon {...p} />
