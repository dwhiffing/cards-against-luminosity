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
