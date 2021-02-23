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
}))

// TODO: need to make list/card behavior generic
// should be able to have a list for board, deck and hand with different display components
// however, they all share an interface allowing the cards to be dragged between eachother.etc

export const Cards = () => {
  const [activeCard, setActiveCard] = useState(null)
  const [hand, setHand] = useState(
    shuffle(CARDS)
      .map((n, index) => ({ ...n, index }))
      .slice(0, 5)
      .map((c) => ({ ...c, inHand: true })),
  )
  const [board, setBoard] = useState(EMPTY_CARDS)
  const cards = { hand, board }
  const { cursorState, pressed } = useMouse({
    cards,
    onMouseDown: ({ clientX, clientY }) => {
      let handCard = getCardFromPoint(clientX, clientY, 'hand', cards)
      let boardCard = getCardFromPoint(clientX, clientY, 'board', cards)
      let card = handCard || boardCard
      if (activeCard) {
        let boardCard = getCardFromPoint(clientX, clientY, 'board', cards)
        boardCard && moveCards(activeCard, boardCard)
        setActiveCard(null)
      } else if (card?.canMove && !card?.isEmpty) {
        setActiveCard(card)
      }
    },
    onMouseUp: ({ card }) => {
      if (activeCard && card) {
        moveCards(activeCard, card)
      }
    },
  })

  const moveCards = (cardA, cardB) => {
    // TODO: need this to be able to easily move cards between lists
    setBoard((b) => [
      ...b.slice(0, cardB.index),
      { ...cardA, index: cardB.index, inHand: false },
      ...b.slice(cardB.index + 1),
    ])
    setHand((h) => h.map((c) => (c?.index !== cardA?.index ? c : null)))
  }

  useWindowEvent('resize', debounce(useForceUpdate(), 500))

  const size = 0.5 + BOARD_SIZE * 2
  return (
    <div className="cards-container">
      <div
        style={{
          position: 'relative',
          width: `${size}rem`,
          height: `${size}rem`,
        }}
      >
        <List
          cards={cards.board}
          activeCard={activeCard}
          pressed={pressed}
          cursorState={cursorState}
        />
        <List
          cards={cards.hand}
          activeCard={activeCard}
          pressed={pressed}
          cursorState={cursorState}
        />
      </div>
    </div>
  )
}

const List = ({ cards, activeCard, pressed, cursorState }) => {
  return cards.map((card, cardIndex) => {
    if (!card) return null
    const isActive = activeCard ? activeCard.index === card.index : false
    const { x, y } = getCardPosition(card)

    return (
      <Card
        key={`card-${cardIndex}`}
        card={card}
        isActive={isActive && !card.isEmpty}
        x={isActive && pressed && !card.isEmpty ? cursorState.mouseX : x}
        y={isActive && pressed && !card.isEmpty ? cursorState.mouseY : y}
      />
    )
  })
}

const Card = React.memo(
  ({ card, isActive, x: _x, y: _y, onRest = () => {} }) => {
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
            className={classes.join(' ')}
            style={{
              transform: `translate3d(${x}px, ${y}px, 0) rotate(${r}deg) scale(${s})`,
              zIndex: 10,
            }}
          >
            {/* <div className="face" /> */}
            <div className="back" />
            <div
              className="click"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: CARD_HEIGHT,
                width: CARD_HEIGHT,
              }}
            />
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
  let x = (card.index % BOARD_SIZE) * CARD_HEIGHT
  let y = Math.floor(card.index / BOARD_SIZE) * CARD_HEIGHT
  // TODO: Gross
  if (card.inHand) y += 400
  return { x, y }
}

const useMouse = ({
  cards,
  onMouseDown: _onMouseDown,
  onMouseUp: _onMouseUp,
}) => {
  const [cursorState, setCursorState] = useState(initialState)
  const startRef = useRef({ x: 0, y: 0 })
  const deltaRef = useRef({ x: 0, y: 0 })
  const [pressed, setPressed] = useState(false)

  const onMouseDown = ({ clientX, clientY }) => {
    let card = getCardFromPoint(clientX, clientY, 'hand', cards)
    _onMouseDown({ clientX, clientY })
    setPressed(true)

    startRef.current = { x: clientX, y: clientY }
    if (card) {
      deltaRef.current = { x: clientX - card.x, y: clientY - card.y }
      setCursorState({ mouseX: card.x, mouseY: card.y })
    }
  }

  const onMouseMove = ({ clientY, clientX }) => {
    const mouseY = clientY - deltaRef.current.y
    const mouseX = clientX - deltaRef.current.x
    setCursorState({ mouseY, mouseX })
  }

  const onMouseUp = ({ clientX, clientY }) => {
    deltaRef.current = { x: 0, y: 0 }
    setPressed(false)

    let card = getCardFromPoint(clientX, clientY, 'board', cards)
    _onMouseUp({ clientX, clientY, card })
  }

  useWindowEvent('pointerup', onMouseUp)
  useWindowEvent('pointerdown', onMouseDown)
  useWindowEvent('pointermove', onMouseMove)

  return { cursorState, pressed }
}
