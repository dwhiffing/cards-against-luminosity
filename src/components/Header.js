import React from 'react'
import { COLORS, STORES } from '../constants'
import { getCanAfford } from '../utils'

export function Header({ state, setModal }) {
  const unseenUpgradesRed = STORES.red.filter(
    (u) =>
      !Object.keys(state.seen_upgrades).includes(u.name) &&
      getCanAfford(state, u),
  )
  const unseenUpgradesGreen = STORES.green.filter(
    (u) =>
      !Object.keys(state.seen_upgrades).includes(u.name) &&
      getCanAfford(state, u),
  )
  const unseenUpgradesBlue = STORES.blue.filter(
    (u) =>
      !Object.keys(state.seen_upgrades).includes(u.name) &&
      getCanAfford(state, u),
  )

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
        {state.max_points.red > 0 && (
          <button onClick={() => setModal({ name: 'store', type: 'red' })}>
            Red Store{' '}
            {unseenUpgradesRed.length > 0
              ? `(${unseenUpgradesRed.length})`
              : ''}
          </button>
        )}
        {state.max_points.green > 0 && (
          <button onClick={() => setModal({ name: 'store', type: 'green' })}>
            Green Store{' '}
            {unseenUpgradesGreen.length > 0
              ? `(${unseenUpgradesGreen.length})`
              : ''}
          </button>
        )}
        {state.max_points.blue > 0 && (
          <button onClick={() => setModal({ name: 'store', type: 'blue' })}>
            Blue Store{' '}
            {unseenUpgradesBlue.length > 0
              ? `(${unseenUpgradesBlue.length})`
              : ''}
          </button>
        )}
      </div>
    </header>
  )
}
