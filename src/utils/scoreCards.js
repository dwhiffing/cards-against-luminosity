import { groupBy } from 'lodash'
import { getBoardWidth } from '../components/App'
import * as constants from '../constants'
import { getDirections } from './index'

export const scoreCards = (state) => {
  const scoredCards = state.cards.board
    .map((c, index) => ({ ...c, index, _value: c.value, _color: c.color }))
    .filter((c) => c.value > 0)

  const cardGroups = groupBy(scoredCards, (c) => c.suit)
  let {
    0: pointCards = [],
    1: multiCards = [],
    2: removeCards = [],
    3: upgradeCards = [],
    4: persistCards = [],
  } = cardGroups

  const applyEffect = (card, effect) => {
    const effectedCards = getCardsInDirection(state, card)
    effectedCards.forEach((c) => {
      const target = scoredCards.find((pc) => c.id === pc.id)
      if (target) effect(target)
    })
  }

  persistCards.forEach((card) =>
    applyEffect(card, (target) => {
      target._hp = card._value
    }),
  )

  upgradeCards.forEach((card) =>
    applyEffect(card, (target) => {
      target.value += card._value
    }),
  )

  multiCards.forEach((card) =>
    applyEffect(card, (target) => {
      target._value *= card._value
    }),
  )

  state = {
    ...state,
    cards: {
      ...state.cards,
      board: state.cards.board.map(
        (c) => scoredCards.find((pc) => pc.id === c.id) || c,
      ),
    },
    points: addCardScores(state, pointCards),
  }

  state = {
    ...state,
    max_points: {
      red: Math.max(state.max_points.red, state.points.red),
      green: Math.max(state.max_points.green, state.points.green),
      blue: Math.max(state.max_points.blue, state.points.blue),
    },
  }

  removeCards.forEach((card) =>
    applyEffect(card, (target) => {
      state.cards = Object.entries({ ...state.cards }).reduce(
        (obj, [k, v]) => ({
          ...obj,
          [k]: v.map((c) =>
            c.id !== target.id ? c : { ...constants.emptyCard, id: c.id },
          ),
        }),
        {},
      )
    }),
  )

  state = {
    ...discardBoard(state),
    counters: {
      ...state.counters,
      submit_cache: state.counters.submit_cache - 1,
    },
  }

  return state
}

const discardBoard = (state) => {
  return {
    ...state,
    cards: {
      ...state.cards,
      board: state.cards.board.map((c) =>
        c.value > 0 && !c._hp
          ? { ...c, ...constants.emptyCard }
          : { ...c, _hp: (c._hp || 1) - 1 },
      ),
      discard: [
        ...state.cards.discard,
        ...state.cards.board
          .filter((c) => c.value > 0 && !c._hp)
          .map((c) => ({
            ...c,
            _value: undefined,
            _color: undefined,
            index: undefined,
          })),
      ],
    },
  }
}

const addCardScores = (state, cards) =>
  cards.reduce(
    (sum, current) => {
      if (current._color === 1) {
        sum.red += Math.round(current._value * state.limits.prestige)
      }
      if (current._color === 2) {
        sum.green += Math.round(current._value * state.limits.prestige)
      }
      if (current._color === 3) {
        sum.blue += Math.round(current._value * state.limits.prestige)
      }

      return sum
    },
    { ...state.points },
  )

const getCardsInDirection = (state, card) => {
  const cards = state.cards.board
  const s = getBoardWidth(state.limits.board_size)
  const p = card.index
  // TODO: implement diagonals  tr, br, bl, tl
  const [t, r, b, l] = getDirections(card.direction)
  let result = []

  if (t) result.push(cards[p - s])
  if (r && p % s !== s - 1) result.push(cards[p + 1])
  if (b) result.push(cards[p + s])
  if (l && p % s !== 0) result.push(cards[p - 1])

  return result.filter((c) => c?.value > 0)
}
