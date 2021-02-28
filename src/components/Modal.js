import React, { useEffect, useState } from 'react'
import BaseModal from 'react-modal'
import * as utils from '../utils'
import * as constants from '../constants'
import { Card } from './Card'
import { getCost } from '../utils/doPurchase'
import { random } from 'lodash'

export function Modal({ state, setState, onClose }) {
  const { name, type } = state.modal || {}
  const label = type
  const purchases = constants.STORES[label] || []
  return (
    <BaseModal
      isOpen={!!name}
      onRequestClose={onClose}
      overlayClassName="Overlay"
      style={customStyles}
    >
      <p>{label}</p>
      <div>
        {name === 'store' ? (
          <Store state={state} setState={setState} purchases={purchases} />
        ) : name === 'addCard' ? (
          <AddCard state={state} setState={setState} />
        ) : (
          <Deck state={state} />
        )}
      </div>
      <button onClick={onClose}>close</button>
    </BaseModal>
  )
}

// TODO colors should be based on what kind of card we bought
// value and suit should be based on dice roll
const AddCard = ({ state, setState }) => {
  const [cards, setCards] = useState([
    constants.getCardWithRarity({ color: state.modal.color || 1 }),
    constants.getCardWithRarity({ color: state.modal.color || 1 }),
    constants.getCardWithRarity({ color: state.modal.color || 1 }),
  ])
  return (
    <div>
      <p>Add card</p>
      <div style={{ display: 'flex' }}>
        {cards.map((c, i) => (
          <div>
            <div
              style={{
                position: 'relative',
                width: constants.CARD_HEIGHT,
                height: constants.CARD_HEIGHT,
              }}
            >
              <Card card={c} />
            </div>
            <button
              onClick={() => {
                setState((state) => ({
                  ...state,
                  modal: null,
                  cards: {
                    ...state.cards,
                    discard: state.cards.discard.concat([c]),
                  },
                }))
              }}
            >
              pick
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

const Store = ({ state, setState, purchases }) =>
  purchases.map((purchase) => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontSize: 8 }}>
        {JSON.stringify(getCost(state, purchase))}
      </span>
      <button
        key={purchase.title}
        onClick={() => {
          if (utils.getCanAfford(state, purchase)) {
            setState((state) => utils.doPurchase(state, purchase))
          } else {
            alert("You can't afford it")
          }
        }}
      >
        {purchase.title}
      </button>
    </div>
  ))

function Deck({ state }) {
  const cards = Object.values(state.cards)
    .flat()
    .filter((c) => !!c.value)

  return (
    <div style={{ display: 'flex' }}>
      {cards.map((card) => (
        <div key={card.id}>
          <Card card={card} style={{ position: 'relative', marginRight: 8 }} />
        </div>
      ))}
    </div>
  )
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 99999,
  },
}

BaseModal.setAppElement('#root')
