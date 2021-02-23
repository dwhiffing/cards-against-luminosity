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

export const Cards = () => {
  const [activeCard, setActiveCard] = useState(null)
  const [cursorState, setCursorState] = useState(initialState)
  const startRef = useRef({ x: 0, y: 0 })
  const deltaRef = useRef({ x: 0, y: 0 })
  const [pressed, setPressed] = useState(false)
  const [cards, setCards] = useState(shuffleDeck())

  const onMouseDown = ({ clientX, clientY }) => {
    let card = getCardFromPoint(clientX, clientY, cards)

    if (!card) return setActiveCard(null)

    if (activeCard) {
      setCards(moveCard(cards, activeCard, card))
      setActiveCard(null)
    } else if (!getCardIsActive(activeCard, card) && card.canMove) {
      setActiveCard(card)
    }

    startRef.current = { x: clientX, y: clientY }
    deltaRef.current = { x: clientX - card.x, y: clientY - card.y }

    setPressed(true)
    setCursorState({ mouseX: card.x, mouseY: card.y })
  }

  const onMouseMove = ({ clientY, clientX }) => {
    const mouseY = clientY - deltaRef.current.y
    const mouseX = clientX - deltaRef.current.x
    setCursorState({ mouseY, mouseX })
  }

  const onMouseUp = ({ clientX, clientY }) => {
    const diffX = Math.abs(startRef.current.x - clientX)
    const diffY = Math.abs(startRef.current.y - clientY)
    const passedThreshold = diffX > 15 || diffY > 15

    deltaRef.current = { x: 0, y: 0 }
    setPressed(false)

    if (activeCard) {
      let clickedCard = getCardFromPoint(clientX, clientY, cards)
      if (clickedCard) setCards(moveCard(cards, activeCard, clickedCard))
      if (passedThreshold) setActiveCard(null)
    }
  }

  useWindowEvent('resize', debounce(useForceUpdate(), 500))
  useWindowEvent('pointerup', onMouseUp)
  useWindowEvent('pointerdown', onMouseDown)
  useWindowEvent('pointermove', onMouseMove)

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: `${0.5 + BOARD_SIZE * 2}rem`,
          height: `${0.5 + BOARD_SIZE * 2}rem`,
        }}
      >
        {EMPTY_CARDS.map((n) => (
          <Card key={`pile-${n.index}`} card={n} />
        ))}

        {cards.map((card, cardIndex) => {
          const isActive = getCardIsActive(activeCard, card)

          return (
            <Card
              key={`card-${cardIndex}`}
              card={card}
              isActive={isActive}
              mouseX={isActive && pressed ? cursorState.mouseX : null}
              mouseY={isActive && pressed ? cursorState.mouseY : null}
            />
          )
        })}
      </div>
    </div>
  )
}

const Card = React.memo(
  ({ card, isActive, isFinished, onRest = () => {}, mouseX, mouseY }) => {
    useWindowEvent('resize', debounce(useForceUpdate(), 500))
    const { x: xPos, y: yPos } = getCardPosition({ ...card, isFinished })
    const x = typeof mouseX === 'number' ? mouseX : spring(xPos, config)
    const y = typeof mouseY === 'number' ? mouseY : spring(yPos, config)
    const r = spring(0, config)
    const s = spring(isActive ? 1.185 : 1, config)
    const zIndex = 10

    const classes = [
      'card',
      `rank${card.value}`,
      isFinished && 'finished',
      'can-move',
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
              zIndex,
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
                height: '160%',
                width: CARD_HEIGHT,
              }}
            />
          </div>
        )}
      </Motion>
    )
  },
)

const shuffleDeck = () => shuffle(CARDS).map((n, index) => ({ ...n, index }))

const moveCard = (cards, movedCard, destinationCard) => {
  return cards
}

function getCardIsActive(activeCard, card) {
  return activeCard ? activeCard.index === card.index : false
}

const getCardFromPoint = (x, y, cards) => {
  const elementUnder = document.elementFromPoint(x, y)

  if (!elementUnder?.parentElement?.dataset?.index) return null

  const dataIndex = elementUnder.parentElement.dataset.index

  return {
    ...cards[+dataIndex],
    ...getCardPosition(cards[+dataIndex]),
    canMove: true,
  }
}

const getCardPosition = (card) => {
  const x = (card.index % BOARD_SIZE) * CARD_HEIGHT
  const y = Math.floor(card.index / BOARD_SIZE) * CARD_HEIGHT
  return { x, y }
}
