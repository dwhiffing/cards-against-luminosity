import React, { useState, useRef } from 'react'
import { useForceUpdate, useWindowEvent } from '../../utils'
import debounce from 'lodash/debounce'
import shuffle from 'lodash/shuffle'
import { Motion, spring } from 'react-motion'
import './card.css'

const BOARD_SIZE = 5
const CARD_HEIGHT = 50
const config = { stiffness: 200, damping: 20 }
const initialState = { mouseY: 0, mouseX: 0 }
const VALUES = new Array(12).fill('').map((n, i) => i + 1)
const CARDS = new Array(Math.ceil((BOARD_SIZE * BOARD_SIZE) / 12))
  .fill(VALUES)
  .flat()
  .slice(0, BOARD_SIZE * BOARD_SIZE)

const EMPTY_CARDS = new Array(BOARD_SIZE * BOARD_SIZE).fill('').map((n, i) => ({
  index: i,
  list: 'board',
  value: -1,
}))

export const Cards = () => {
  const [activeCard, setActiveCard] = useState(null)
  const [state, setState] = useState({
    hand: shuffle(CARDS).map((n, index) => ({ value: n, index, list: 'hand' })),
    board: EMPTY_CARDS,
  })

  const { cursorState } = useMouse({
    onMouseDown: ({ clientX, clientY }) => {
      let element = document.elementFromPoint(clientX, clientY)
      if (element.classList.contains('click')) {
        element = element.parentElement
      }

      const { list: bList, index: bIndex } = element.dataset
      const cardB =
        bList && typeof bIndex === 'string' ? state[bList][+bIndex] : null

      if (!cardB) return setActiveCard(null)
      if (!activeCard) return setActiveCard(cardB)

      const { value: bValue } = cardB
      const { list: aList, index: aIndex, value: aValue } = activeCard

      if (aList === bList) {
        // moving within the same list
        setState((state) => {
          const newState = {
            ...state,
            [bList]: state[bList].map((c) =>
              c.index === +bIndex
                ? { value: aValue, index: +bIndex, list: bList }
                : c.index === +aIndex
                ? { value: bValue, index: +aIndex, list: bList }
                : c,
            ),
          }
          return newState
        })
      }
      // moving to another list
      else
        setState((state) => {
          const newState = {
            ...state,
            [aList]: state[aList].map((c) =>
              c.index === +aIndex
                ? { value: bValue, index: +aIndex, list: aList }
                : c,
            ),
            [bList]: state[bList].map((c) =>
              c.index === +bIndex
                ? { value: aValue, index: +bIndex, list: bList }
                : c,
            ),
          }
          return newState
        })

      setActiveCard(null)
    },
    onMouseUp: ({ clientX, clientY }) => {},
  })

  useWindowEvent('resize', debounce(useForceUpdate(), 500))

  return (
    <div className="cards-container">
      <List
        name="board"
        cards={state.board}
        activeCard={activeCard}
        cursorState={cursorState}
      />
      <List
        name="hand"
        cards={state.hand}
        activeCard={activeCard}
        cursorState={cursorState}
      />
    </div>
  )
}

const List = ({ name, cards, activeCard, cursorState }) => {
  return (
    <div style={{ flex: 1 }} data-list={name}>
      {cards.map((card, cardIndex) => {
        if (!card) return null
        const isActive = activeCard
          ? activeCard.index === card.index && activeCard.list === card.list
          : false
        const xBuffer = window.innerWidth / 2 - BOARD_SIZE * 25
        const yBuffer = window.innerHeight / 2 - BOARD_SIZE * 50
        let x = (card.index % BOARD_SIZE) * CARD_HEIGHT + xBuffer
        let y = Math.floor(card.index / BOARD_SIZE) * CARD_HEIGHT + yBuffer
        // TODO: Gross
        if (card.list === 'hand') y += 400

        return (
          <Card
            key={`card-${cardIndex}`}
            list={name}
            card={card}
            isActive={isActive && card.value !== -1}
            x={isActive && card.value !== -1 ? cursorState.mouseX : x}
            y={isActive && card.value !== -1 ? cursorState.mouseY : y}
          />
        )
      })}
    </div>
  )
}

const Card = React.memo(
  ({ card, list, isActive, x: _x, y: _y, onRest = () => {} }) => {
    const x = spring(_x, config)
    const y = spring(_y, config)
    const r = spring(0, config)
    const s = spring(isActive ? 1.185 : 1, config)

    const classes = [
      `card can-move rank${card.value}`,
      isActive && 'disable-touch',
      card.value === -1 && 'empty',
    ]

    return (
      <Motion style={{ x, y, r, s }} onRest={onRest}>
        {({ x, y, r, s }) => (
          <div
            data-index={card.index}
            data-list={list}
            className={classes.join(' ')}
            style={{
              transform: `translate3d(${x}px, ${y}px, 0) rotate(${r}deg) scale(${s})`,
              zIndex: 10,
            }}
          >
            <div className="back" />
            <div className="click" />
          </div>
        )}
      </Motion>
    )
  },
)

const useMouse = ({ onMouseDown: _onMouseDown, onMouseUp: _onMouseUp }) => {
  const [cursorState, setCursorState] = useState(initialState)
  const startRef = useRef({ x: 0, y: 0 })
  const deltaRef = useRef({ x: 0, y: 0 })

  const onMouseDown = ({ clientX, clientY }) => {
    _onMouseDown({ clientX, clientY })
    startRef.current = { x: clientX, y: clientY }
    setCursorState({ mouseX: clientX, mouseY: clientY })
  }

  const onMouseMove = ({ clientY, clientX }) => {
    const mouseY = clientY - deltaRef.current.y
    const mouseX = clientX - deltaRef.current.x
    setCursorState({ mouseY, mouseX })
  }

  const onMouseUp = ({ clientX, clientY }) => {
    deltaRef.current = { x: 0, y: 0 }
    _onMouseUp({ clientX, clientY })
  }

  useWindowEvent('pointerup', onMouseUp)
  useWindowEvent('pointerdown', onMouseDown)
  useWindowEvent('pointermove', onMouseMove)

  return { cursorState }
}
