import * as constants from '../constants'
import { moveCard } from './moveCard'

export const doCounters = (state) => {
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
const shuffleDiscard = (state) => {
  return {
    ...state,
    cards: { ...state.cards, draw: state.cards.discard, discard: [] },
  }
}
