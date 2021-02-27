import { groupBy } from 'lodash'
import { v4 as uuid } from 'uuid'
import * as constants from './constants'
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

export const discardBoard = (state) => {
  return {
    ...state,
    cards: {
      ...state.cards,
      board: state.cards.board.map((c) =>
        c.value > 0 ? { ...c, ...emptyCard } : c,
      ),
      discard: [
        ...state.cards.discard,
        ...state.cards.board
          .filter((c) => c.value > 0)
          .map((c) => ({ ...c, _value: undefined, index: undefined })),
      ],
    },
  }
}

export const addCardScores = (state, cards) =>
  cards.reduce(
    (sum, current) => {
      if (current.color === 1) {
        sum.red += current._value
      }
      if (current.color === 2) {
        sum.green += current._value
      }
      if (current.color === 3) {
        sum.blue += current._value
      }

      return sum
    },
    { ...state.points },
  )

// TODO: should change scoring system to apply cards in order based on suit
// ie, first all of the highest suit are resolved in order, repeat down to the lowest
const getCardsInDirection = (cards, card) => {
  const p = card.index
  const s = constants.BOARD_SIZE
  const [t, r, b, l, tr, br, bl, tl] = getDirections(card.direction)
  let result = []

  if (t) result.push(cards[p - s])
  if (r && p % s !== s - 1) result.push(cards[p + 1])
  if (b) result.push(cards[p + s])
  if (l && p % s !== 0) result.push(cards[p - 1])

  //1: -ROW_SIZE
  //2: +1
  //4: +ROW_SIZE
  //8: -1

  return result.filter((c) => c?.value > 0)
}
export const scoreCards = (state) => {
  // get all valid cards
  const scoredCards = state.cards.board
    .map((c, index) => ({ ...c, index, _value: c.value }))
    .filter((c) => c.value > 0)

  const cardGroups = groupBy(scoredCards, (c) => c.suit)
  let {
    0: pointCards = [],
    1: multiCards = [],
    2: upgradeCards = [],
  } = cardGroups

  const applyEffect = (card, effect) => {
    const effectedCards = getCardsInDirection(state.cards.board, card)
    effectedCards.forEach((c) => {
      const target = pointCards.find((pc) => c.id === pc.id)
      effect(target)
    })
  }

  upgradeCards.forEach((card) =>
    applyEffect(card, (target) => {
      target.value += card.value
    }),
  )

  multiCards.forEach((card) =>
    applyEffect(card, (target) => {
      target._value *= card.value
    }),
  )

  state = {
    ...state,
    cards: {
      ...state.cards,
      board: state.cards.board.map(
        (c) => pointCards.find((pc) => pc.id === c.id) || c,
      ),
    },
    points: addCardScores(state, pointCards),
  }

  state = {
    ...discardBoard(state),
  }

  return state
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
        counters: { ...state.counters, draw: constants.DRAW_TIMER },
      }
    } else {
      return {
        ...shuffleDiscard(state),
        counters: { ...state.counters, draw: constants.DRAW_TIMER },
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

const emptyCard = { value: undefined, id: null, direction: 0 }
