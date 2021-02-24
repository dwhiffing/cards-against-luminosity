import React from 'react'
import { Motion, spring } from 'react-motion'

const SUITS = '♥♠♣♦'.split('')

export const Card = React.memo(({ card, isActive, x: _x, y: _y }) => {
  const config = { stiffness: 200, damping: 20 }
  const x = card.value > -1 ? spring(_x, config) : _x
  const y = card.value > -1 ? spring(_y, config) : _y
  const r = spring(0, config)
  const s = spring(isActive ? 1.185 : 1, config)
  const o = spring(card.value > -1 ? 1 : 0, config)
  const suit = SUITS[card.suit]
  const classes = [
    `card can-move rank${card.value}`,
    isActive && 'disable-touch',
    typeof card.value !== 'number' && 'empty',
    suit,
  ]

  return (
    <Motion style={{ x, y, r, s, o }}>
      {({ x, y, r, s, o }) => (
        <div
          data-index={card.index}
          data-list={card.list}
          data-value={card.value}
          className={classes.join(' ')}
          style={{
            transform: `translate3d(${x}px, ${y}px, 0) rotate(${r}deg) scale(${s})`,
            backgroundColor: `rgba(255,255,255,${o})`,
            zIndex: isActive ? 20 : typeof card.value !== 'number' ? 0 : 10,
          }}
        >
          {suit && <div className="face">{suit}</div>}
          <div className="back" />
          <div className="click" />
        </div>
      )}
    </Motion>
  )
})
