import React from 'react'
import { COLORS } from '../constants'

export function Footer({ onSubmit, setModal, state }) {
  return (
    <footer>
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <button onClick={onSubmit}>Submit</button>
        <button onClick={() => setModal({ name: 'store', type: 'red' })}>
          Red Store
        </button>
        <button onClick={() => setModal({ name: 'store', type: 'green' })}>
          Green Store
        </button>
        <button onClick={() => setModal({ name: 'store', type: 'blue' })}>
          Blue Store
        </button>
        <button onClick={() => setModal({ name: 'deck' })}>Deck</button>
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p>{state.counters.draw}</p>
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
    </footer>
  )
}
