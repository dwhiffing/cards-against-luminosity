import { groupBy } from 'lodash'
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
    2: upgradeCards = [],
    3: removeCards = [],
    4: persistCards = [],
    5: convertCards = [],
  } = cardGroups

  const applyEffect = (card, effect) => {
    const effectedCards = getCardsInDirection(state, card)
    effectedCards.forEach((c) => {
      const target = pointCards.find((pc) => c.id === pc.id)
      effect(target)
    })
  }

  persistCards.forEach((card) =>
    applyEffect(card, (target) => {
      target._hp = card.value
    }),
  )

  convertCards.forEach((card) =>
    applyEffect(card, (target) => {
      target._color = card.color
    }),
  )

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
        sum.red += current._value
      }
      if (current._color === 2) {
        sum.green += current._value
      }
      if (current._color === 3) {
        sum.blue += current._value
      }

      return sum
    },
    { ...state.points },
  )

const getCardsInDirection = (state, card) => {
  const cards = state.cards.board
  const s = state.limits.board_size
  const p = card.index
  // TODO: implement diagonals
  const [t, r, b, l, tr, br, bl, tl] = getDirections(card.direction)
  let result = []

  if (t) result.push(cards[p - s])
  if (r && p % s !== s - 1) result.push(cards[p + 1])
  if (b) result.push(cards[p + s])
  if (l && p % s !== 0) result.push(cards[p - 1])

  return result.filter((c) => c?.value > 0)
}
