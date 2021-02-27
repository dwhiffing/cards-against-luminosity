export { useForceUpdate } from './useForceUpdate'
export { useWindowEvent } from './useWindowEvent'
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

export const moveCard = (state, source, destination, index = 0) => {
  const card = [...(state.cards[source] || [])].find((c, i) => i === index)
  const newSource = [...(state.cards[source] || [])].filter(
    (c, i) => i !== index,
  )

  return {
    ...state,
    cards: {
      ...state.cards,
      [source]: newSource,
      [destination]: [...(state.cards[destination] || []), card],
    },
  }
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
      .reduce((sum, current) => {
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
      }, state.points),
  }
}
