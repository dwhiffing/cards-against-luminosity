import React from 'react'

export function Footer({ setModal, state }) {
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
        <p style={{ margin: 20 }}>{state.counters.draw}</p>
        <p style={{ margin: 20 }}>{state.counters.submit}</p>
      </div>
    </footer>
  )
}
