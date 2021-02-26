import React, { useState } from 'react'
import debounce from 'lodash/debounce'
import shuffle from 'lodash/shuffle'
import * as constants from '../../utils/constants'
import * as utils from '../../utils'
import { Card } from './Card'
import './card.css'

export const Cards = () => {
  const [activeCard, setActiveCard] = useState(null)
  const [state, setState] = useState({
    hand: shuffle(constants.CARDS).slice(0, 10),
    board: constants.NEW_BOARD,
  })

  const onMove = ({ element }) => {
    const { list, index } = element.dataset
    if (!list) return setActiveCard(null)

    const clicked = { list, index, ...state[list][+index] }

    if (activeCard) {
      setState((state) => utils.swapCards(state, clicked, activeCard))
      setActiveCard(null)
    } else if (clicked.value > -1) setActiveCard(clicked)
  }

  const { cursorState } = utils.useMouse({
    onMouseUp: onMove,
    onMouseDown: onMove,
  })
  utils.useWindowEvent('resize', debounce(utils.useForceUpdate(), 500))

  const cards = Object.entries(state)
    .map(([list, cards]) => cards.map((c, index) => ({ ...c, index, list })))
    .flat()

  return (
    <div className="cards-container">
      {cards.map(({ id, list, index, value, suit }) => {
        const { x, y } = utils.getCardPos({ index, list })
        const isActive = activeCard?.id === id && value > -1
        return (
          <Card
            key={id}
            card={{ list, index, value, suit }}
            isActive={isActive}
            x={isActive ? cursorState.mouseX : x}
            y={isActive ? cursorState.mouseY : y}
          />
        )
      })}
    </div>
  )
}
