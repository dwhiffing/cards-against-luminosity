import React, { useState } from 'react'
import { useForceUpdate, useWindowEvent } from '../../utils'
import debounce from 'lodash/debounce'
import shuffle from 'lodash/shuffle'
import { Motion, spring } from 'react-motion'
import { v4 as uuid } from 'uuid'
import './card.css'

const BOARD_SIZE = 5
const CARD_HEIGHT = 50
const config = { stiffness: 200, damping: 20 }
const initialState = { mouseY: 0, mouseX: 0 }
const VALUES = new Array(12).fill('').map((n, i) => i + 1)
const SUITS = '♥♠♣♦'.split('')
const OFFSET_X = BOARD_SIZE * 25
const OFFSET_Y = BOARD_SIZE * 50
const OFFSETS = { hand: { y: 300 }, deck: { x: 300 } }
const CARDS = new Array(Math.ceil((BOARD_SIZE * BOARD_SIZE) / 12))
  .fill(VALUES)
  .flat()
  .map((n) => ({ value: n, suit: shuffle([0, 1, 2, 3])[0], id: uuid() }))
  .slice(0, BOARD_SIZE * BOARD_SIZE)

const EMPTY_CARDS = new Array(BOARD_SIZE * BOARD_SIZE).fill('').map((n, i) => ({
  value: -1,
  id: uuid(),
}))

export const Cards = () => {
  const [activeCard, setActiveCard] = useState(null)
  const [state, setState] = useState({
    hand: shuffle(CARDS),
    board: EMPTY_CARDS,
    // deck: shuffle(CARDS),
  })

  const { cursorState } = useMouse({
    onMouseUp: ({ clientX, clientY }) => {},
    onMouseDown: ({ element }) => {
      const { list, index } = element.dataset
      if (!list) return setActiveCard(null)
      const clicked = { list, index, ...state[list][+index] }

      if (!activeCard) {
        clicked.value > -1 && setActiveCard(clicked)
        return
      }

      setState((state) => swapCards(state, clicked, activeCard))
      setActiveCard(null)
    },
  })

  useWindowEvent('resize', debounce(useForceUpdate(), 500))

  const cards = Object.entries(state)
    .map(([list, _cards]) => _cards.map((h, index) => ({ ...h, index, list })))
    .flat()

  return (
    <div className="cards-container">
      {cards.map((card) => {
        const offset = OFFSETS[card.list]
        if (!card) return null
        const isActive = activeCard
          ? activeCard.list === card.list && +activeCard.index === +card.index
          : false
        const _x = window.innerWidth / 2 - OFFSET_X
        const _y = window.innerHeight / 2 - OFFSET_Y
        let x = (card.index % BOARD_SIZE) * CARD_HEIGHT + _x + (offset?.x || 0)
        let y =
          Math.floor(card.index / BOARD_SIZE) * CARD_HEIGHT +
          _y +
          (offset?.y || 0)

        return (
          <Card
            key={card.id}
            list={card.list}
            card={card}
            index={card.index}
            isActive={isActive && card.value !== -1}
            x={isActive && card.value !== -1 ? cursorState.mouseX : x}
            y={isActive && card.value !== -1 ? cursorState.mouseY : y}
          />
        )
      })}
    </div>
  )
}

const Card = React.memo(({ card, index, list, isActive, x: _x, y: _y }) => {
  const x = card.value === -1 ? _x : spring(_x, config)
  const y = card.value === -1 ? _y : spring(_y, config)
  const r = spring(0, config)
  const s = spring(isActive ? 1.185 : 1, config)
  const suit = SUITS[card.suit]
  const classes = [
    `card can-move rank${card.value}`,
    isActive && 'disable-touch',
    card.value === -1 && 'empty',
    suit,
  ]
  const o = spring(card.value === -1 ? 0 : 1, config)

  return (
    <Motion style={{ x, y, r, s, o }}>
      {({ x, y, r, s, o }) => (
        <div
          data-index={index}
          data-list={list}
          data-value={card.value}
          className={classes.join(' ')}
          style={{
            transform: `translate3d(${x}px, ${y}px, 0) rotate(${r}deg) scale(${s})`,
            backgroundColor: `rgba(255,255,255,${o})`,
            zIndex: isActive ? 20 : 10,
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

const useMouse = ({ onMouseDown: _onMouseDown, onMouseUp: _onMouseUp }) => {
  const [cursorState, setCursorState] = useState(initialState)

  useWindowEvent('pointermove', ({ clientY, clientX }) => {
    setCursorState({ mouseX: clientX, mouseY: clientY })
  })

  useWindowEvent('pointerdown', ({ clientX, clientY }) => {
    let element = document.elementFromPoint(clientX, clientY)
    if (element.classList.contains('click')) element = element.parentElement
    _onMouseDown({ clientX, clientY, element })
    setCursorState({ mouseX: clientX, mouseY: clientY })
  })

  useWindowEvent('pointerup', ({ clientX, clientY }) => {
    _onMouseUp({ clientX, clientY })
  })

  return { cursorState }
}

const swapCards = (state, a, b) => {
  const { list: l1, index: i1, value: v1, ...s1 } = a
  const { list: l2, index: i2, value: v2, ...s2 } = b

  return {
    ...state,
    [l1]: state[l1].map((c, i) => (i === +i1 ? { value: +v2, ...s2 } : c)),
    [l2]: state[l2].map((c, i) =>
      i === +i2
        ? { value: +v1, ...s1 }
        : l1 === l2 && i === +i1
        ? { value: +v2, ...s2 }
        : c,
    ),
  }
}
