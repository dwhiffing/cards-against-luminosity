import React, { useRef, useState } from 'react'
import shuffle from 'lodash/shuffle'
import * as constants from '../../utils/constants'
import * as utils from '../../utils'
import { Card } from './Card'
import { Footer } from '../Footer'
import { Header } from '../Header'
import './card.css'
import { debounce } from 'lodash'
import { Store } from '../Store'
import { Deck } from '../Deck'

export const Cards = () => {
  const [activeCard, setActiveCard] = useState(null)
  const [state, setState] = useState(initialState)

  utils.useWindowEvent('resize', debounce(utils.useForceUpdate(), 500))
  utils.useInterval(() => setState(utils.handleCounters), 1000)
  const lastClickRef = useRef(0)

  const onMove = ({ element }) => {
    const { list, index } = element.dataset
    if (!list) {
      if (+new Date() - lastClickRef.current < 250) {
        const index = state.cards.board.findIndex((c) => !c.value)
        setState(utils.swapCards(state, { list: 'board', index }, activeCard))
      }

      return setActiveCard(null)
    }

    const clicked = { list, index, ...state.cards[list][+index] }

    if (activeCard) {
      setState((state) => utils.swapCards(state, clicked, activeCard))
      setActiveCard(null)
    } else if (clicked.value > -1) {
      lastClickRef.current = +new Date()
      setActiveCard(clicked)
    }
  }

  const { cursorState } = utils.useMouse({
    onMouseUp: onMove,
    onMouseDown: onMove,
  })

  const cards = Object.entries(state.cards)
    .map(([list, cards]) => cards.map((c, index) => ({ ...c, index, list })))
    .flat()

  const onSubmit = () => setState(utils.scoreCards)
  const onStore = (n) => setState((state) => utils.openStore(state, n))

  return (
    <>
      <Header />

      <Store state={state} setState={setState} onClose={() => onStore(0)} />

      <div className="cards-container">
        {cards.map(({ id, list, index, value, suit, color }) => {
          const isActive = activeCard?.id === id && value > -1
          return (
            <Card
              key={id || 'empty' + index}
              card={{ list, index, value, suit, color }}
              isActive={isActive}
              cursorState={cursorState}
            />
          )
        })}
      </div>

      <Footer onSubmit={onSubmit} onStore={onStore} state={state} />
    </>
  )
}

const shuffled = shuffle(constants.CARDS)

const initialState = {
  store: {
    open: 0,
  },
  counters: {
    draw: 3,
  },
  points: {
    red: 0,
    green: 0,
    blue: 0,
  },
  cards: {
    board: constants.NEW_BOARD,
    draw: shuffled.slice(1),
    discard: [],
    hand: shuffled.slice(0, 1),
  },
}
