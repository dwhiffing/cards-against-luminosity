import React, { useEffect, useRef, useState } from 'react'
import debounce from 'lodash/debounce'
import shuffle from 'lodash/shuffle'
import * as constants from '../../utils/constants'
import * as utils from '../../utils'
import { Card } from './Card'
import './card.css'
import { Footer } from '../Footer'
import { Header } from '../Header'
import { set } from 'lodash'

const shuffled = shuffle(constants.CARDS)

function useInterval(callback, delay) {
  const savedCallback = useRef()
  useEffect(() => {
    savedCallback.current = callback
  })
  useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    let id = setInterval(tick, delay)
    return () => clearInterval(id)
  }, [delay])
}

export const Cards = () => {
  const [activeCard, setActiveCard] = useState(null)
  const [state, setState] = useState({
    counters: {
      draw: 5,
    },
    points: {
      red: 0,
      green: 0,
      blue: 0,
    },
    cards: {
      board: constants.NEW_BOARD,
      draw: shuffled.slice(1, 11),
      discard: [],
      hand: shuffled.slice(0, 1),
    },
  })

  useInterval(() => {
    setState((state) => {
      if (state.counters.draw === 0) {
        return {
          ...state,
          ...utils.moveCard(state, 'draw', 'hand'),
          counters: { ...state.counters, draw: 5 },
        }
      } else {
        return {
          ...state,
          counters: { ...state.counters, draw: state.counters.draw - 1 },
        }
      }
    })
  }, 1000)

  const onMove = ({ element }) => {
    const { list, index } = element.dataset
    if (!list) return setActiveCard(null)

    const clicked = { list, index, ...state.cards[list][+index] }

    if (activeCard) {
      setState((state) => utils.swapCards(state, clicked, activeCard))
      setActiveCard(null)
    } else if (clicked.value > -1) setActiveCard(clicked)
  }

  const { cursorState } = utils.useMouse({
    onMouseUp: onMove,
    onMouseDown: onMove,
  })
  // utils.useWindowEvent('resize', debounce(utils.useForceUpdate(), 500))

  const cards = Object.entries(state.cards)
    .map(([list, cards]) => cards.map((c, index) => ({ ...c, index, list })))
    .flat()

  const onSubmit = () => {
    setState((state) => {
      return {
        ...state,
        ...utils.scoreCards(state),
      }
    })
  }

  return (
    <>
      <Header />

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

      <Footer onSubmit={onSubmit} state={state} />
    </>
  )
}
