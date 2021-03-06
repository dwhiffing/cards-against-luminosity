import { CHEAT_MODE, getBoard } from '../constants'

// utils.doPurchase(state, {
//                 cost: {},
//                 effect: { type: 'remove-card', params: { id } },
//               }),

export const doPurchase = (state, purchase) => {
  const cost = getCost(state, purchase)
  let points = { ...state.points }
  let cards = { ...state.cards }
  let limits = { ...state.limits }

  if (!CHEAT_MODE) points[cost.type] -= cost.value

  if (purchase.effect.type === 'add-points') {
    points = Object.entries(points).reduce(
      (sum, [k, v]) => ({ ...sum, [k]: v + purchase.effect.params.value }),
      {},
    )
  }

  if (purchase.effect.type === 'add-card') {
    state.modal = {
      name: 'addCard',
      cardConfig: purchase.effect.params.cardConfig,
    }
  }

  if (purchase.effect.type === 'change-limit') {
    if (purchase.effect?.params?.name) {
      const size = purchase.effect?.params?.value || 0
      limits[purchase.effect.params.name] += size
      if (purchase.effect.params.name === 'board_size') {
        const newBoard = getBoard(limits[purchase.effect.params.name])
        cards.board = newBoard.map((c, i) => cards.board[i] || c)
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

export const getCurrentLevel = (state, purchase) => {
  return state.purchases[purchase.name] || 0
}
export const getCost = (state, purchase) => {
  return {
    type: purchase.cost.type,
    value: purchase.cost.levels[getCurrentLevel(state, purchase)],
  }
}

export const getCanAfford = (state, purchase) => {
  if (CHEAT_MODE) return true
  const cost = getCost(state, purchase)
  return state.points[cost.type] >= cost.value
}
