import React from 'react'
import { getDirections } from '../../utils'

export const Arrows = ({ direction = 0 }) => {
  const [t, r, b, l, tr, br, bl, tl] = getDirections(direction)
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: 25 }}
    >
      <g clip-path="url(#clip0)">
        {l && (
          <path
            d="M4.33333 15.7314L4.33333 13.6373L8.49333 13.6464L8.49333 12.3536L4.33333 12.3627L4.33333 10.2686L6.92497e-07 13L4.33333 15.7314Z"
            fill="black"
          />
        )}
        {r && (
          <path
            d="M21.6667 12.3627V10.2686L26 13L21.6667 15.7314L21.6667 13.6373L17.5067 13.6464V12.3536L21.6667 12.3627Z"
            fill="black"
          />
        )}
        {b && (
          <path
            d="M13.6373 21.6667L15.7314 21.6667L13 26L10.2686 21.6667L12.3627 21.6667L12.3536 17.5067H13.6464L13.6373 21.6667Z"
            fill="black"
          />
        )}
        {t && (
          <path
            d="M12.3627 4.33333L10.2686 4.33333L13 9.53674e-07L15.7314 4.33333L13.6373 4.33333L13.6464 8.49333H12.3536L12.3627 4.33333Z"
            fill="black"
          />
        )}
        {tl && (
          <path
            d="M7.24583 8.217L5.65034 9.81249L5 5L9.81249 5.65034L8.217 7.24583L10.8461 9.86104L9.86104 10.8461L7.24583 8.217Z"
            fill="black"
          />
        )}
        {bl && (
          <path
            d="M8.21699 18.7542L9.81249 20.3497L5 21L5.65033 16.1875L7.24582 17.783L9.86104 15.1539L10.8461 16.139L8.21699 18.7542Z"
            fill="black"
          />
        )}
        {br && (
          <path
            d="M18.7542 17.783L20.3497 16.1875L21 21L16.1875 20.3497L17.783 18.7542L15.1539 16.139L16.139 15.1539L18.7542 17.783Z"
            fill="black"
          />
        )}
        {tr && (
          <path
            d="M16.1875 5.65034L17.783 7.24583L15.1539 9.86105L16.139 10.8461L18.7542 8.217L20.3497 9.81249L21 5L16.1875 5.65034Z"
            fill="black"
          />
        )}
      </g>
      <defs>
        <clipPath id="clip0">
          <rect width="26" height="26" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}
