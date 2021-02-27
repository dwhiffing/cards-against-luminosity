import React, { useEffect, useState } from 'react'
import { debounce } from 'lodash'

import { Card } from './Card'
import { Footer } from './Footer'
import { Header } from './Header'
import { Modal } from './Modal'
import * as constants from '../constants'
import * as utils from '../utils'

const App = () => {
  const [state, setState] = useState(null)

  const onMouseDown = utils.useOnClick(state, setState)
  const { cursorState } = utils.useMouse(onMouseDown)

  useEffect(() => {
    utils.readFromStorage('save').then(({ save } = {}) => {
      if (!!save) {
        setState(save)
      } else {
        setState(constants.getInitialState())
      }
    })
  }, [])

  const setModal = (modal) => setState((state) => ({ ...state, modal }))

  utils.useWindowEvent('resize', debounce(utils.useForceUpdate(), 500))
  utils.useInterval(() => setState(utils.doCounters), constants.TICK)
  utils.useInterval(
    () =>
      setState((state) => {
        utils.writeToStorage('save', state)
        return state
      }),
    30000,
  )

  if (!state) return null

  const cards = Object.entries(state.cards)
    .map(([list, cards]) => cards.map((c, index) => ({ ...c, index, list })))
    .flat()
  const handSize = cards.filter((c) => c.list === 'hand').length

  return (
    <>
      <Header state={state} setModal={setModal} />

      <Modal state={state} setState={setState} onClose={() => setModal()} />

      <div className="cards-container">
        {cards.map((card) => {
          const isActive = state.activeCard?.id === card.id && card.value > -1

          return (
            <Card
              key={card.id || 'empty' + card.index}
              card={card}
              handSize={handSize}
              boardSize={state.limits.board_size}
              isActive={isActive}
              cursorState={cursorState}
            />
          )
        })}
      </div>

      <Footer
        onSave={() => utils.writeToStorage('save', state)}
        onReset={() => {
          utils.removeFromStorage('save')
          window.location.reload()
        }}
        onSubmit={() => setState(utils.scoreCards)}
        onDraw={() => setState(utils.draw)}
        setModal={setModal}
        state={state}
      />
    </>
  )
}

export default App
