import React, { useEffect, useState } from 'react'
import BaseModal from 'react-modal'
import * as utils from '../utils'
import * as constants from '../constants'
import { Card } from './Card'
import { getCost, getCurrentLevel } from '../utils/doPurchase'
import { startCase } from 'lodash'

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
      <p style={{ textAlign: 'center' }}>{startCase(label)}</p>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          maxWidth: 400,
          width: '100%',
          justifyContent: 'center',
        }}
      >
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
  const [cards] = useState(constants.getNewCards(state.modal.cardConfig))
  return (
    <div>
      <p>Add card</p>
      <div style={{ display: 'flex' }}>
        {cards.map((c, i) => (
          <div key={c.id}>
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

const Store = ({ state, setState, purchases, afford }) => {
  const seenOrAffordable = purchases.filter(
    (p) =>
      utils.getCanAfford(state, p) ||
      Object.keys(state.seen_upgrades).includes(p.name),
  )

  useEffect(() => {
    const newUpgrades = seenOrAffordable.reduce((obj, up) => {
      return {
        ...obj,
        [up.name]: true,
      }
    }, {})

    setState((state) => {
      return {
        ...state,
        seen_upgrades: { ...state.seen_upgrades, ...newUpgrades },
      }
    })
    // eslint-disable-next-line
  }, [])

  return seenOrAffordable.map((purchase) => {
    const cost = getCost(state, purchase)
    const canAfford = utils.getCanAfford(state, purchase)
    const currentLevel = getCurrentLevel(state, purchase)
    return (
      <div
        key={purchase.title}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          textAlign: 'center',
          width: 150,
          height: 80,
          margin: 10,
        }}
      >
        <p style={{ fontSize: 12, margin: 0 }}>{purchase.title}</p>
        {purchase.description && (
          <p style={{ fontSize: 9, margin: '5px 0' }}>
            {purchase.description(currentLevel)}
          </p>
        )}

        <button
          key={purchase.title}
          disabled={typeof cost.value !== 'number' || !canAfford}
          onClick={() => {
            if (canAfford) {
              setState((state) => utils.doPurchase(state, purchase))
            } else {
              alert("You can't afford it")
            }
          }}
        >
          {typeof cost.value === 'number'
            ? `Buy (${cost.value} ${cost.type})`
            : 'Max'}
        </button>
      </div>
    )
  })
}

function Deck({ state }) {
  const cards = Object.values(state.cards)
    .flat()
    .filter((c) => !!c.value)

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {cards.map((card) => (
        <div key={card.id}>
          <Card
            card={card}
            style={{ position: 'relative', marginTop: 8, marginRight: 8 }}
          />
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
