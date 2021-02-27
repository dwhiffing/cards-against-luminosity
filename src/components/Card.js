import React from 'react'
import * as constants from '../constants'
import { Motion, spring } from 'react-motion'
import { Arrows } from './Arrows'

export const Card = React.memo(
  ({ card, handSize = 0, isActive, cursorState, style = {} }) => {
    const w = window.innerWidth / 2
    const h = window.innerHeight / 2
    let _x = 0,
      _y = 0

    if (card.list === 'hand') {
      _x = w - (handSize / 2) * constants.CARD_HEIGHT
      _y = h / 0.8
      _x += card.index * constants.CARD_HEIGHT
    }

    if (card.list === 'board') {
      _x = w - constants.BOARD_SIZE * 25
      _y = h / 3
      _x += (card.index % constants.BOARD_SIZE) * constants.CARD_HEIGHT
      _y +=
        Math.floor(card.index / constants.BOARD_SIZE) * constants.CARD_HEIGHT
    }

    if (card.list === 'draw') {
      _x = w - 4 * constants.CARD_HEIGHT
      _y = h / 0.8
    }
    if (card.list === 'discard') {
      _x = w + 3 * constants.CARD_HEIGHT
      _y = h / 0.8
    }

    _x = isActive ? cursorState.mouseX : _x
    _y = isActive ? cursorState.mouseY : _y

    const config = { stiffness: 200, damping: 20 }
    const x = card.value > -1 ? spring(_x, config) : _x
    const y = card.value > -1 ? spring(_y, config) : _y
    const r = spring(0, config)
    const s = spring(isActive ? 1.185 : 1, config)
    const o = spring(card.value > -1 ? 1 : 0, config)
    const suit = constants.SUITS[card.suit]
    const color = constants.COLORS[card._color || card.color]
    const isHidden = card.list === 'draw'

    const classes = [
      `card can-move rank${card.value}`,
      isHidden && 'hidden',
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
              color,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              ...style,
            }}
          >
            {typeof card.value === 'number' && suit && (
              <div className="face">{suit}</div>
            )}
            {card._hp && card._hp > 0 ? (
              <div className="hp">{card._hp}</div>
            ) : null}
            {card.direction > 0 && <Arrows direction={card.direction} />}
            <div className="back" />
            <div className="click" />
          </div>
        )}
      </Motion>
    )
  },
)
