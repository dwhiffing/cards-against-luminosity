import { getNewCard, getBoard } from '../constants'

// utils.doPurchase(state, {
//                 cost: {},
//                 effect: { type: 'remove-card', params: { id } },
//               }),

export const doPurchase = (state, purchase) => {
  let points = getCost(state, purchase).reduce(
    (sum, [k, v]) => ({ ...sum, [k]: sum[k] - v }),
    { ...state.points },
  )
  let cards = { ...state.cards }
  let limits = { ...state.limits }

  if (purchase.effect.type === 'add-points') {
    points = Object.entries(points).reduce(
      (sum, [k, v]) => ({ ...sum, [k]: v + purchase.effect.params.value }),
      {},
    )
  }

  if (purchase.effect.type === 'add-card') {
    state.modal = { name: 'addCard', color: purchase.effect.params.color }
  }

  if (purchase.effect.type === 'change-limit') {
    if (purchase.effect?.params?.name) {
      const size = purchase.effect?.params?.value || 0
      limits[purchase.effect.params.name] += size
      if (purchase.effect.params.name === 'board_size') {
        // TODO: need to make sure this copies over contents of existing board
        cards.board = getBoard(limits[purchase.effect.params.name])
      }
    }
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
    purchases: {
      ...state.purchases,
      [purchase.name]: (state.purchases[purchase.name] || 0) + 1,
    },
    limits,
    cards,
    points,
  }
}

export const getCost = (state, purchase) => {
  const currentLevel = state.purchases[purchase.name] || 0
  return Object.entries(purchase.cost).map(([k, v]) => [k, v[currentLevel]])
}

export const getCanAfford = (state, purchase) => {
  return getCost(state, purchase).every(([key, val]) => {
    return state.points[key] >= val
  })
}
