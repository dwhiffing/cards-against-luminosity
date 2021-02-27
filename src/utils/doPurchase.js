import { getNewCard, getBoard } from '../constants'

// utils.doPurchase(state, {
//                 cost: {},
//                 effect: { type: 'remove-card', params: { id } },
//               }),

export const doPurchase = (state, purchase) => {
  let points = Object.entries(purchase.cost).reduce(
    (sum, [k, v]) => ({ ...sum, [k]: sum[k] - v }),
    { ...state.points },
  )
  let cards = { ...state.cards }
  let limits = { ...state.limits }

  if (purchase.effect.type === 'add-card') {
    cards.discard = cards.discard.concat([getNewCard(purchase.effect.params)])
  }

  if (purchase.effect.type === 'change-limit') {
    if (purchase.effect?.params?.name) {
      const size = purchase.effect?.params?.value || 0
      limits[purchase.effect.params.name] += size
      if (purchase.effect.params.name === 'board_size') {
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
    limits,
    cards,
    points,
  }
}

export const getCanAfford = (state, purchase) =>
  Object.entries(purchase.cost).every(([key, val]) => state.points[key] >= val)