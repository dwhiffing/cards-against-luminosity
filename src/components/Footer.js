import React from 'react'
import * as constants from '../constants'

export function Footer({ onSave, onReset, onSubmit, onDraw, setModal, state }) {
  return (
    <footer>
      <div
        style={{
          flex: 1,
          alignItems: 'flex-end',
          display: 'flex',
          justifyContent: 'flex-start',
        }}
      >
        <button onClick={() => setModal({ name: 'deck' })}>Deck</button>
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}
      >
        <TimerButton
          cache={state.counters.draw_cache}
          time={state.counters.draw_time}
          cacheMax={state.limits.draw_cache}
          totalTime={state.limits.draw_time}
          onClick={onDraw}
          disabled={state.cards.hand.length === state.limits.hand_size}
        >
          Draw
        </TimerButton>

        <TimerButton
          cache={state.counters.submit_cache}
          cacheMax={state.limits.submit_cache}
          time={state.counters.submit_time}
          totalTime={state.limits.submit_time}
          onClick={onSubmit}
          disabled={state.cards.board.filter((c) => !!c.value).length === 0}
        >
          Submit
        </TimerButton>
      </div>
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
        }}
      >
        <button onClick={onSave}>save</button>
        <button onClick={onReset}>reset</button>
      </div>
    </footer>
  )
}

const tps = 1000 / constants.TICK

// TODO: should make this a progress bar style button
const TimerButton = ({
  cache = 0,
  cacheMax = 1,
  time,
  totalTime,
  children,
  onClick,
  disabled,
}) => (
  <div>
    <p style={{ fontSize: 10, margin: 0, textAlign: 'center' }}>
      {cache}/{cacheMax}
    </p>
    <p style={{ fontSize: 10, margin: 0, textAlign: 'center' }}>
      {Math.round(time / tps)}/{Math.round(totalTime / tps)}
    </p>
    <button disabled={cache === 0 || disabled} onClick={onClick}>
      {children}
    </button>
  </div>
)
