import React, { useState, useEffect, useRef } from 'react'
import {
  shuffleDeck,
  useWindowEvent,
  moveCard,
  getCanCardMove,
  getCardIsActive,
  getCardFromPoint,
  useForceUpdate,
  getBottomCard,
  checkForFinishedPiles,
  getCardPile,
} from './utils'
import Card from './components/Card'
import debounce from 'lodash/debounce'
import { Header } from './components/Header'
import './index.css'
import './card.css'

const initialState = { mouseY: 0, mouseX: 0 }
const EMPTY_CARDS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => ({
  cardPileIndex: -1,
  pileIndex: n,
  isEmpty: true,
}))

function App() {
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
    <div className="container">
      <Header
        hasWon={hasWon}
        onReset={() => {
          setCards(shuffleDeck())
          setHasWon(false)
        }}
      />

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

      <footer>
        <button>One</button>
        <button>Two</button>
        <button>Three</button>
      </footer>
    </div>
  )
}

export default App
