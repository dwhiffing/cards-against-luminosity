import React, { useState, useEffect, useRef } from 'react'

import { useForceUpdate, useWindowEvent } from '../../utils'
import debounce from 'lodash/debounce'
import { Motion, spring } from 'react-motion'
import './card.css'
import shuffle from 'lodash/shuffle'
import chunk from 'lodash/chunk'
import groupBy from 'lodash/groupBy'

const SUITS = ['spades', 'clubs', 'hearts', 'diamonds']

const config = { stiffness: 200, damping: 20 }

const Card = React.memo(
  ({
    card,
    activeCard,
    pileSize,
    isActive,
    isFinished,
    canMove,
    onRest = () => {},
    mouseX = -1,
    mouseY = -1,
  }) => {
    useWindowEvent('resize', debounce(useForceUpdate(), 500))
    const { height, xBuffer, width } = getCardSpacing(pileSize)
    const { x: xPos, y: yPos } = getCardPosition(
      { ...card, isFinished },
      pileSize,
    )

    const yOffset =
      mouseX > -1
        ? height * Math.abs(activeCard.cardPileIndex - card.cardPileIndex)
        : 0

    const x = mouseX > -1 ? mouseX : spring(xPos, config)
    const y = mouseY > -1 ? mouseY + yOffset : spring(yPos, config)
    const r = spring(card.isCheat ? 17 : 0, config)
    const s = spring(isActive ? 1.185 : 1, config)
    const zIndex = isFinished
      ? -1
      : mouseX > -1
      ? 35 + card.cardPileIndex
      : card.cardPileIndex

    const classes = [
      'card',
      `rank${card.value}`,
      isFinished && 'finished',
      canMove && 'can-move',
      isActive && 'disable-touch',
      card.isEmpty && 'empty',
      SUITS[card.suit],
    ]

    return (
      <Motion style={{ x, y, r, s }} onRest={onRest}>
        {({ x, y, r, s }) => (
          <div
            data-index={card.index}
            data-pileindex={card.pileIndex}
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
                left: -xBuffer,
                height: '160%',
                width: width + xBuffer,
              }}
            />
          </div>
        )}
      </Motion>
    )
  },
)

const initialState = { mouseY: 0, mouseX: 0 }
const EMPTY_CARDS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => ({
  cardPileIndex: -1,
  pileIndex: n,
  isEmpty: true,
}))
export const Cards = () => {
  const [activeCard, setActiveCard] = useState(null)
  const [cursorState, setCursorState] = useState(initialState)
  const startRef = useRef({ x: 0, y: 0 })
  const deltaRef = useRef({ x: 0, y: 0 })
  const [finishedPiles, setFinishedPiles] = useState([])
  const [pressed, setPressed] = useState(false)
  const [cards, setCards] = useState(shuffleDeck())
  const [hasWon, setHasWon] = useState(false)

  useEffect(() => {
    const newFinishedPiles = checkForFinishedPiles(cards)
    if (!hasWon && newFinishedPiles.length !== finishedPiles.length) {
      if (newFinishedPiles.length >= 4) {
        setHasWon(true)
      }
      setTimeout(() => setFinishedPiles(newFinishedPiles), 500)
    }
  }, [cards, finishedPiles, hasWon])

  const onMouseDown = ({ clientX, clientY }) => {
    let card = getCardFromPoint(clientX, clientY, cards)

    if (!card) {
      return setActiveCard(null)
    }

    if (activeCard) {
      const bottomCard = getBottomCard(card, cards)
      setCards(moveCard(cards, activeCard, bottomCard))

      setActiveCard(null)
    } else if (!card.isActive && card.canMove) {
      setActiveCard(card)
    }
    const mouseY = card.y
    const mouseX = card.x
    startRef.current = { x: clientX, y: clientY }
    deltaRef.current = { x: clientX - card.x, y: clientY - card.y }
    setPressed(true)

    setCursorState({ mouseX, mouseY })
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
      clickedCard = getBottomCard(clickedCard, cards)
      if (clickedCard) {
        setCards(moveCard(cards, activeCard, clickedCard))
      }
      if (passedThreshold) {
        setActiveCard(null)
      }
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
      <div style={{ position: 'relative', width: '25rem', height: '25rem' }}>
        {[0, 1, 2, 3, 4, 5].map((n) => (
          <Card key={`pile-${n}`} card={EMPTY_CARDS[n]} />
        ))}

        {cards.map((card, cardIndex) => {
          const isActive = getCardIsActive(activeCard, card)

          return (
            <Card
              key={`card-${cardIndex}`}
              card={card}
              activeCard={activeCard}
              isActive={isActive}
              pileSize={getCardPile(card, cards).length}
              canMove={getCanCardMove(card, cards)}
              isFinished={finishedPiles.includes(card.pileIndex)}
              mouseX={
                getCardIsActive(activeCard, card) && pressed
                  ? cursorState.mouseX
                  : -1
              }
              mouseY={
                getCardIsActive(activeCard, card) && pressed
                  ? cursorState.mouseY
                  : -1
              }
            />
          )
        })}
      </div>
    </div>
  )
}

const VALUES = '987654321abcdefghijklmnopqrstuvwxyz'

const CARDS = VALUES.split('')
  .map((n) => [
    { value: Number(n), suit: 0 },
    { value: Number(n), suit: 1 },
    { value: Number(n), suit: 2 },
    { value: Number(n), suit: 3 },
    { value: Number(n), suit: 4 },
  ])
  .flat()
  .slice(0, 144)

const shuffleDeck = () =>
  chunk(shuffle(CARDS), 12)
    .map((pile, pileIndex) =>
      pile.map((n, i) => ({
        ...n,
        cardPileIndex: i,
        pileIndex,
      })),
    )
    .flat()
    .map((c, i) => ({ ...c, index: i }))

const isDescending = (numbers) => {
  return (
    numbers.filter((number, index) => {
      return numbers[index + 1] ? number === numbers[index + 1] + 1 : true
    }).length === numbers.length
  )
}

const moveCard = (cards, movedCard, destinationCard) => {
  const sourcePile = getCardPile(movedCard, cards)
  if (movedCard.isFinished || !destinationCard || destinationCard.isFinished) {
    return cards
  }

  const numToMove = sourcePile.length - movedCard.cardPileIndex
  const allowCheat =
    numToMove === 1 && !movedCard.isCheat && !destinationCard.isCheat
  const isCheat =
    movedCard.value !== destinationCard.value - 1 && !destinationCard.isEmpty

  const movingCards = sourcePile.slice(
    movedCard.cardPileIndex,
    movedCard.cardPileIndex + numToMove,
  )

  const validOrder =
    destinationCard.isEmpty ||
    (!destinationCard.isCheat &&
      isDescending([destinationCard.value, ...movingCards.map((m) => m.value)]))

  return cards.map((card) => {
    if (
      card.pileIndex !== movedCard.pileIndex ||
      movedCard.pileIndex === destinationCard.pileIndex
    ) {
      return card
    }

    if (!movingCards.map((c) => c.index).includes(card.index)) {
      return card
    }

    if (
      (validOrder || allowCheat) &&
      !Number.isNaN(destinationCard.pileIndex)
    ) {
      const cardPileIndex =
        destinationCard.cardPileIndex +
        movingCards.findIndex((c) => c.index === card.index) +
        1

      return {
        ...card,
        pileIndex: destinationCard.pileIndex,
        cardPileIndex,
        isCheat,
      }
    }

    return card
  })
}

const checkForFinishedPiles = (cards) => {
  const piles = Object.values(
    groupBy(cards, (card) => card.pileIndex),
  ).map((pile) => pile.sort((a, b) => a.cardPileIndex - b.cardPileIndex))

  return piles
    .map((pile) => ({
      pile: pile.map((card) => card.value).join(''),
      index: pile[0].pileIndex,
    }))
    .filter(({ pile }) => pile === '987654321')
    .map((pile) => pile.index)
}

export function getCardIsActive(activeCard, card) {
  let isActive = false

  if (activeCard) {
    isActive =
      activeCard.pileIndex === card.pileIndex &&
      activeCard.cardPileIndex <= card.cardPileIndex
  }

  return isActive
}

const getCardPile = (card, cards) => {
  const pile = cards.filter((c) => c.pileIndex === card.pileIndex)
  return pile.sort((a, b) => a.cardPileIndex - b.cardPileIndex)
}

const decorateCard = (card, cards) =>
  card
    ? {
        ...card,
        ...getCardPosition(card, getCardPile(card, cards).length),
        canMove: getCanCardMove(card, cards),
        isActive: getCardIsActive(card, cards),
      }
    : null

const getBottomCard = (card, cards) => {
  if (!card) {
    return null
  }

  if (card.isEmpty) {
    return card
  }

  const pile = getCardPile(card, cards)
  card = pile[pile.length - 1]
  return decorateCard(card, cards)
}

const getCanCardMove = (card, cards) => {
  const pile = getCardPile(card, cards)
  const bottom = pile.map((c) => c.value).slice(card.cardPileIndex, pile.length)
  return isDescending(bottom)
}

const getCardFromPoint = (x, y, cards) => {
  let card
  const elementUnder = document.elementFromPoint(x, y)

  if (elementUnder && elementUnder.parentElement) {
    const dataIndex = elementUnder.parentElement.dataset.index

    if (dataIndex) {
      card = cards[+dataIndex]
    } else {
      let emptyCard = {
        cardPileIndex: -1,
        pileIndex: +elementUnder.parentElement.dataset.pileindex,
        isEmpty: true,
      }
      const pile = getCardPile(emptyCard, cards)

      if (pile.length === 0) {
        return { ...emptyCard, ...getCardPosition(emptyCard) }
      }
    }
  }

  return decorateCard(card, cards)
}

const getCardSpacing = (pileSize = 0) => {
  // const outerWidth = clamp(document.documentElement.clientWidth, 740)
  // const outerHeight = clamp(document.documentElement.clientHeight, 740)
  const width = 50
  let height = 50
  const xBuffer = 0
  let yBuffer = 0
  return { width, height, yBuffer, xBuffer }
}

const getCardPosition = (card, pileSize) => {
  const { width, height, yBuffer, xBuffer } = getCardSpacing(pileSize)

  const x = card.pileIndex * width + xBuffer

  const y = card.isEmpty
    ? yBuffer
    : yBuffer + (card.isFinished ? 0 : card.cardPileIndex * height)

  return { x, y }
}
