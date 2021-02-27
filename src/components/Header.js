import React from 'react'
import { COLORS } from '../constants'

export function Header({ state }) {
  return (
    <header>
      <div style={{ width: 80 }}>
        <span>Game</span>
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p style={{ color: COLORS[1], margin: '0px 10px' }}>
          {state.points.red}
        </p>
        <p style={{ color: COLORS[2], margin: '0px 10px' }}>
          {state.points.green}
        </p>
        <p style={{ color: COLORS[3], margin: '0px 10px' }}>
          {state.points.blue}
        </p>
      </div>

      <div style={{ width: 80, textAlign: 'center' }}></div>
    </header>
  )
}
