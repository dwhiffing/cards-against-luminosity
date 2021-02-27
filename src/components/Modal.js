import React from 'react'
import BaseModal from 'react-modal'
import * as utils from '../utils'
import * as constants from '../constants'
import { Card } from './Card'

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

      {name === 'store' ? (
        <Store state={state} setState={setState} purchases={purchases} />
      ) : (
        <Deck state={state} />
      )}
      <button onClick={onClose}>close</button>
    </BaseModal>
  )
}

const Store = ({ state, setState, purchases }) =>
  purchases.map((purchase) => (
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
