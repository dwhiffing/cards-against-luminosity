import React, { useState } from 'react'
import { useForceUpdate, useWindowEvent } from '../../utils'
import debounce from 'lodash/debounce'
import shuffle from 'lodash/shuffle'
import { v4 as uuid } from 'uuid'
import { Card } from './Card'
import './card.css'

const BOARD_SIZE = 5
const CARD_HEIGHT = 50
const OFFSET_X = BOARD_SIZE * 25
const OFFSET_Y = BOARD_SIZE * 50
const POSITIONS = { hand: { y: 300 } }

export const SUITS = '♥♠♣♦'.split('')
const VALUES = new Array(12).fill('').map((n, i) => i + 1)
const CARDS = shuffle(
  new Array(Math.ceil((BOARD_SIZE * BOARD_SIZE) / 12))
    .fill(VALUES)
    .flat()
    .map((n) => ({ value: n, suit: shuffle([0, 1, 2, 3])[0], id: uuid() }))
    .slice(0, BOARD_SIZE * BOARD_SIZE),
)

const initialState = {
  hand: CARDS,
  board: new Array(BOARD_SIZE * BOARD_SIZE).fill('').map((n, i) => ({
    value: -1,
    id: uuid(),
  })),
}

export const Cards = () => {
  useWindowEvent('resize', debounce(useForceUpdate(), 500))

  const [activeCard, setActiveCard] = useState(null)
  const [state, setState] = useState(initialState)
  const cards = Object.entries(state)
    .map(([list, _cards]) => _cards.map((h, index) => ({ ...h, index, list })))
    .flat()

  const onMouseDown = ({ element }) => {
    const { list, index } = element.dataset
    if (!list) return setActiveCard(null)

    const clicked = { list, index, ...state[list][+index] }

    if (activeCard) {
      setState((state) => swapCards(state, clicked, activeCard))
      setActiveCard(null)
    } else if (clicked.value > -1) setActiveCard(clicked)
  }

  const { cursorState } = useMouse({ onMouseUp: () => {}, onMouseDown })

  return (
    <div className="cards-container">
      {cards.map(({ id, list, index, value, suit }) => {
        const { x: _x = 0, y: _y = 0 } = POSITIONS[list] || {}
        const isActive = activeCard
          ? activeCard.list === list && +activeCard.index === +index
          : false
        const x =
          (index % BOARD_SIZE) * CARD_HEIGHT +
          (window.innerWidth / 2 - OFFSET_X + _x)
        const y =
          Math.floor(index / BOARD_SIZE) * CARD_HEIGHT +
          (window.innerHeight / 2 - OFFSET_Y + _y)

        return (
          <Card
            key={id}
            card={{ list, index, value, suit }}
            isActive={isActive && value !== -1}
            x={isActive && value !== -1 ? cursorState.mouseX : x}
            y={isActive && value !== -1 ? cursorState.mouseY : y}
          />
        )
      })}
    </div>
  )
}

const useMouse = ({ onMouseDown: _onMouseDown, onMouseUp: _onMouseUp }) => {
  const [cursorState, setCursorState] = useState({ mouseY: 0, mouseX: 0 })

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
  const { list: l1, index: i1, ...s1 } = a
  const { list: l2, index: i2, ...s2 } = b

  return {
    ...state,
    [l1]: state[l1].map((c, i) => (i === +i1 ? s2 : c)),
    [l2]: state[l2].map((c, i) =>
      i === +i2 ? s1 : l1 === l2 && i === +i1 ? s2 : c,
    ),
  }
}
