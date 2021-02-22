import React from 'react'
import { Motion, spring } from 'react-motion'
import {
  getCardPosition,
  getCardSpacing,
  useWindowEvent,
  useForceUpdate,
} from '../utils'
import debounce from 'lodash/debounce'
const SUITS = ['spades', 'clubs', 'hearts', 'diamonds']

const config = { stiffness: 200, damping: 20 }

const Card = ({
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
}

export default React.memo(Card)
