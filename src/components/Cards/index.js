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
  .map((n) => [{ value: n }])
  .flat()
  .slice(0, BOARD_SIZE * BOARD_SIZE)

const EMPTY_CARDS = new Array(BOARD_SIZE * BOARD_SIZE).fill('').map((n, i) => ({
  index: i,
  isEmpty: true,
  list: 'board',
}))

export const Cards = () => {
  const [activeCard, setActiveCard] = useState(null)
  const [hand, setHand] = useState(
    shuffle(CARDS)
      .map((n, index) => ({ ...n, index }))
      .slice(0, 10)
      .map((c) => ({ ...c, list: 'hand' })),
  )
  const [board, setBoard] = useState(EMPTY_CARDS)
  const cards = { hand, board }

  const { cursorState } = useMouse({
    onMouseDown: ({ clientX, clientY }) => {
      if (!activeCard) {
        let handCard = getCardFromPoint(clientX, clientY, 'hand', cards)
        let boardCard = getCardFromPoint(clientX, clientY, 'board', cards)
        let card = handCard || boardCard
        if (card?.canMove && !card?.isEmpty) setActiveCard(card)
        return
      }

      let otherCard = getCardFromPoint(
        clientX,
        clientY,
        activeCard.list === 'hand' ? 'board' : 'hand',
        cards,
      )
      let element = document.elementFromPoint(clientX, clientY)
      if (element.classList.contains('click')) {
        element = element.parentElement
      }

      const { list, index } = element.dataset

      if (activeCard.list === 'board') {
        // move card from board to hand
        if (list === 'hand') {
          setActiveCard(null)
          setHand(addItem({ ...activeCard, list: 'hand' }, hand.length))
          setBoard(removeItem(activeCard.index))
        }
        // move card from board to board
        if (typeof index === 'string' && +index !== +activeCard.index) {
          setActiveCard(null)
          setBoard((cards) => {
            cards = cards.map((c) =>
              c.index === activeCard.index
                ? { index: c.index, isEmpty: true }
                : c.index === +index
                ? { ...activeCard, index: c.index }
                : c,
            )

            return cards
          })
        }
      } else if (otherCard?.index) {
        // move card from hand to board
        setActiveCard(null)
        setBoard(addItem({ ...activeCard, list: 'board' }, otherCard?.index))
        setHand((c) =>
          c
            .filter((c) => c.index !== activeCard.index)
            .map((c, i) => ({ ...c, index: i })),
        )
      }
    },
    onMouseUp: ({ clientX, clientY }) => {},
  })

  const removeItem = (index) => (cards) =>
    cards.map((card) =>
      card?.index !== index ? card : { index: card.index, isEmpty: true },
    )
  const addItem = (card, index) => (cards) => [
    ...cards.slice(0, index),
    { ...card, index },
    ...cards.slice(index + 1),
  ]

  useWindowEvent('resize', debounce(useForceUpdate(), 500))

  return (
    <div className="cards-container">
      <List
        name="board"
        cards={cards.board}
        activeCard={activeCard}
        cursorState={cursorState}
      />
      <List
        name="hand"
        cards={cards.hand}
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
        const isActive = activeCard ? activeCard.index === card.index : false
        const { x, y } = getCardPosition(card)

        return (
          <Card
            key={`card-${cardIndex}`}
            list={name}
            card={card}
            isActive={isActive && !card.isEmpty}
            x={isActive && !card.isEmpty ? cursorState.mouseX : x}
            y={isActive && !card.isEmpty ? cursorState.mouseY : y}
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
      card.isEmpty && 'empty',
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
            {/* <div className="face" /> */}
            <div className="back" />
            <div className="click" />
          </div>
        )}
      </Motion>
    )
  },
)

const getCardFromPoint = (x, y, tag, cards) => {
  const elementUnder = document.elementFromPoint(x, y)
  const dataIndex = elementUnder?.parentElement?.dataset?.index
  const card = cards[tag][+dataIndex]

  if (!dataIndex || !card) return null

  return {
    ...card,
    ...getCardPosition(card),
    canMove: true,
  }
}

const getCardPosition = (card) => {
  const xBuffer = window.innerWidth / 2 - BOARD_SIZE * 25
  const yBuffer = window.innerHeight / 2 - BOARD_SIZE * 50
  let x = (card.index % BOARD_SIZE) * CARD_HEIGHT + xBuffer
  let y = Math.floor(card.index / BOARD_SIZE) * CARD_HEIGHT + yBuffer
  // TODO: Gross
  if (card.list === 'hand') y += 400
  return { x, y }
}

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
