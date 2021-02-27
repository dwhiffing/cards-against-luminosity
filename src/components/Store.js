import React from 'react'
import { Modal } from './Modal'
import * as utils from '../utils'
import { Deck } from './Deck'

const STORE_LABELS = ['red', 'green', 'blue']

export function Store({ state, setState, onClose }) {
  const n = state.store.open
  const label = STORE_LABELS[n - 1]
  const purchases = STORES[label] || []
  return (
    <Modal isOpen={n > 0} onRequestClose={onClose}>
      <p>{label}</p>

      {n < 4 ? (
        <StoreContent state={state} setState={setState} purchases={purchases} />
      ) : (
        <Deck
          state={state}
          onUpgrade={(id) =>
            setState((state) =>
              utils.doPurchase(state, {
                cost: {},
                effect: { type: 'upgrade-card', params: { id } },
              }),
            )
          }
          onRemove={(id) =>
            setState((state) =>
              utils.doPurchase(state, {
                cost: {},
                effect: { type: 'remove-card', params: { id } },
              }),
            )
          }
        />
      )}
      <button onClick={onClose}>close</button>
    </Modal>
  )
}

const StoreContent = ({ state, setState, purchases }) =>
  purchases.map((purchase) => (
    <button
      key={purchase.title}
      onClick={() => {
        if (
          Object.entries(purchase.cost).every(
            ([key, val]) => state.points[key] >= val,
          )
        ) {
          setState((state) => utils.doPurchase(state, purchase))
        } else {
          alert("You can't afford it")
        }
        // validate cost
        // if valid, deduct cost, apply effect
        // else error
      }}
    >
      {purchase.title}
    </button>
  ))

const UPGRADES = {
  addRedCard: {
    title: 'Add Red Card',
    cost: { red: 1 },
    effect: { type: 'add-card', params: { value: 2, color: 0 } },
  },
  addGreenCard: {
    title: 'Add Green Card',
    cost: { green: 1 },
    effect: { type: 'add-card', params: { value: 2, color: 1 } },
  },
  addBlueCard: {
    title: 'Add Blue Card',
    cost: { blue: 1 },
    effect: { type: 'add-card', params: { value: 2, color: 2 } },
  },
}

const STORES = {
  red: [UPGRADES.addRedCard],
  green: [UPGRADES.addGreenCard],
  blue: [UPGRADES.addBlueCard],
}
