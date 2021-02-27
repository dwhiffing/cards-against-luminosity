import { v4 as uuid } from 'uuid'

export { useForceUpdate } from './useForceUpdate'
export { useWindowEvent } from './useWindowEvent'
export { useInterval } from './useInterval'
export { useMouse } from './useMouse'

export const swapCards = (state, a = {}, b = {}) => {
  const { list: l1, index: i1, ...s1 } = a
  const { list: l2, index: i2, ...s2 } = b

  let result = {
    ...state,
    cards: {
      ...state.cards,
      [l1]: (state.cards[l1] || []).map((c, i) => (i === +i1 ? s2 : c)),
      [l2]: (state.cards[l2] || []).map((c, i) =>
        i === +i2 ? s1 : l1 === l2 && i === +i1 ? s2 : c,
      ),
    },
  }

  result.cards.hand = result.cards.hand.filter((c) => !!c.value)

  return result
}

export const moveCard = (
  state,
  source,
  destination,
  sourceIndex = 0,
  destIndex = destination.length - 1,
) => {
  const card = [...(state.cards[source] || [])].find(
    (c, i) => i === sourceIndex,
  )
  const newSource = [...(state.cards[source] || [])].filter(
    (c, i) => i !== sourceIndex,
  )

  const dest = state.cards[destination] || []

  return {
    ...state,
    cards: {
      ...state.cards,
      [source]: newSource,
      [destination]: [
        ...dest.slice(0, destIndex),
        card,
        ...dest.slice(destIndex),
      ],
    },
  }
}
export const getDirections = (n = 0) => {
  let value = n
  return new Array(8).fill('').map((_, i) => (value >> i) & 0x1)
}

export const scoreCards = (state) => {
  const scoredCards = state.cards.board.filter((c) => c.value > 0)
  const board = state.cards.board.map((c) =>
    c.value > 0 ? { ...c, value: undefined, id: null } : c,
  )

  return {
    ...state,
    cards: {
      ...state.cards,
      board,
      discard: [...state.cards.discard, ...scoredCards],
    },
    points: state.cards.board
      .filter((c) => c.value > 0)
      .reduce(
        (sum, current) => {
          if (current.color === 0) {
            sum.red += current.value
          }
          if (current.color === 1) {
            sum.green += current.value
          }
          if (current.color === 2) {
            sum.blue += current.value
          }

          return sum
        },
        { ...state.points },
      ),
  }
}
export const openStore = (state, n) => {
  return {
    ...state,
    store: { ...state.store, open: n },
  }
}
export const shuffleDiscard = (state) => {
  return {
    ...state,
    cards: { ...state.cards, draw: state.cards.discard, discard: [] },
  }
}
export const doPurchase = (state, purchase) => {
  let points = Object.entries(purchase.cost).reduce(
    (sum, [k, v]) => ({ ...sum, [k]: sum[k] - v }),
    { ...state.points },
  )
  let cards = state.cards

  if (purchase.effect.type === 'add-card') {
    cards.discard = cards.discard.concat([getNewCard(purchase.effect.params)])
  }

  if (purchase.effect.type === 'remove-card') {
    cards = Object.entries({ ...cards }).reduce(
      (obj, [k, v]) => ({
        ...obj,
        [k]: v.filter((c) => c.id !== purchase.effect.params.id),
      }),
      {},
    )
  }

  if (purchase.effect.type === 'upgrade-card') {
    cards = Object.entries({ ...cards }).reduce(
      (obj, [k, v]) => ({
        ...obj,
        [k]: v.map((c) =>
          c.id === purchase.effect.params.id ? { ...c, value: c.value + 1 } : c,
        ),
      }),
      {},
    )
  }

  return {
    ...state,
    cards,
    points,
  }
}
export const handleCounters = (state) => {
  if (state.counters.draw === 0) {
    if (state.cards.draw.length > 0) {
      return {
        ...moveCard(state, 'draw', 'hand'),
        counters: { ...state.counters, draw: 3 },
      }
    } else {
      return {
        ...shuffleDiscard(state),
        counters: { ...state.counters, draw: 3 },
      }
    }
  } else {
    return {
      ...state,
      counters: { ...state.counters, draw: state.counters.draw - 1 },
    }
  }
}

export const getNewCard = ({
  value = 1,
  color = 0,
  suit = 0,
  direction = 0,
} = {}) => ({
  value,
  color,
  suit,
  direction,
  id: uuid(),
})
