import React, { useState } from 'react'
import { debounce } from 'lodash'

import { Card } from './Card'
import { Footer } from './Footer'
import { Header } from './Header'
import { Modal } from './Modal'
import * as constants from '../constants'
import * as utils from '../utils'

const App = () => {
  const [state, setState] = useState(constants.getInitialState())
  const onMouseDown = utils.useOnClick(state, setState)
  const { cursorState } = utils.useMouse(onMouseDown)

  const setModal = (modal) => setState((state) => ({ ...state, modal }))

  utils.useWindowEvent('resize', debounce(utils.useForceUpdate(), 500))
  utils.useInterval(() => setState(utils.doCounters), 500)

  const cards = Object.entries(state.cards)
    .map(([list, cards]) => cards.map((c, index) => ({ ...c, index, list })))
    .flat()
  const handSize = cards.filter((c) => c.list === 'hand').length

  return (
    <>
      <Header state={state} />

      <Modal state={state} setState={setState} onClose={() => setModal()} />

      <div className="cards-container">
        {cards.map((card) => {
          const isActive = state.activeCard?.id === card.id && card.value > -1

          return (
            <Card
              key={card.id || 'empty' + card.index}
              card={card}
              handSize={handSize}
              isActive={isActive}
              cursorState={cursorState}
            />
          )
        })}
      </div>

      <Footer setModal={setModal} state={state} />
    </>
  )
}

export default App
