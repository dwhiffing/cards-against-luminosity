import React from 'react'
import {
  BOARD_SIZE,
  CARD_HEIGHT,
  OFFSET_X,
  OFFSET_Y,
} from '../../utils/constants'
import { Motion, spring } from 'react-motion'
import { Arrows } from './Arrows'

export const SUITS = '●×+⚜✂'.split('')
export const COLORS = ['#d40000', '#33bb55', '#3322aa']

export const Card = React.memo(
  ({ card, isActive, cursorState, style = {} }) => {
    const w = window.innerWidth / 2
    const h = window.innerHeight / 2

    let _x = 0,
      _y = 0
    if (card.list === 'hand') {
      _y = 200
    }
    if (card.list === 'draw') {
      _x = 150
      _y = 10
    }
    if (card.list === 'discard') {
      _x = 150
      _y = 50
    }

    const isPile = card.list === 'draw' || card.list === 'discard'
    const isHidden = card.list === 'draw'

    _x += w - OFFSET_X + _x
    _y += h - OFFSET_Y + _y

    if (!isPile) {
      _x += (card.index % BOARD_SIZE) * CARD_HEIGHT
      _y += Math.floor(card.index / BOARD_SIZE) * CARD_HEIGHT

      _x = isActive ? cursorState.mouseX : _x
      _y = isActive ? cursorState.mouseY : _y
    }

    const config = { stiffness: 200, damping: 20 }
    const x = card.value > -1 ? spring(_x, config) : _x
    const y = card.value > -1 ? spring(_y, config) : _y
    const r = spring(0, config)
    const s = spring(isActive ? 1.185 : 1, config)
    const o = spring(card.value > -1 ? 1 : 0, config)
    const suit = SUITS[card.suit]
    const color = COLORS[card.color]
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
            {card.direction > 0 && <Arrows direction={card.direction} />}
            <div className="back" />
            <div className="click" />
          </div>
        )}
      </Motion>
    )
  },
)
