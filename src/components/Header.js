import React from 'react'
import { COLORS } from '../constants'

export function Header({ state, setModal }) {
  return (
    <header>
      <div style={{ flex: 1, display: 'flex' }}>
        <span style={{ fontSize: 12 }}>Cards Against Luminosity</span>
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
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

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}
      >
        <button onClick={() => setModal({ name: 'store', type: 'red' })}>
          Red Store
        </button>
        <button onClick={() => setModal({ name: 'store', type: 'green' })}>
          Green Store
        </button>
        <button onClick={() => setModal({ name: 'store', type: 'blue' })}>
          Blue Store
        </button>
      </div>
    </header>
  )
}
