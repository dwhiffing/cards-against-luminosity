import React from 'react'

export function Header() {
  return (
    <header>
      <div style={{ width: 80 }}>
        <span>Incremental</span>
      </div>

      <div style={{ width: 80, textAlign: 'center' }}>
        <span>Game</span>
      </div>

      <div style={{ width: 80, textAlign: 'center' }}>
        <span
          onClick={() => {
            const yes = window.confirm('You clicked it')
            if (yes) {
            }
          }}
        >
          +
        </span>
      </div>
    </header>
  )
}
