import React from 'react'
import { Card } from './Cards/Card'

export function Deck({ state, onUpgrade, onRemove }) {
  const cards = Object.values(state.cards)
    .flat()
    .filter((c) => !!c.value)
  return (
    <div style={{ display: 'flex' }}>
      {cards.map((card) => (
        <div key={card.id}>
          <Card card={card} style={{ position: 'relative', marginRight: 8 }} />
          {onUpgrade && (
            <button
              onClick={() => onUpgrade(card.id)}
              style={{ display: 'block' }}
            >
              upgrade
            </button>
          )}
          {onRemove && (
            <button
              onClick={() => onRemove(card.id)}
              style={{ display: 'block' }}
            >
              remove
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
