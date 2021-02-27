import * as utils from '../utils'
import { moveCard } from './moveCard'

export const doCounters = (state) => {
  if (state.counters.draw === 0) {
    state = {
      ...state,
      counters: { ...state.counters, draw: state.limits.draw_time },
    }
    if (state.cards.draw.length > 0) {
      if (state.cards.hand.length < state.limits.hand_size)
        state = { ...moveCard(state, 'draw', 'hand') }
    } else {
      state = { ...shuffleDiscard(state) }
    }
  }

  if (state.counters.submit === 0) {
    state = {
      ...utils.scoreCards(state),
      counters: { ...state.counters, submit: state.limits.submit_time },
    }
  }

  state = {
    ...state,
    counters: {
      ...state.counters,
      submit: state.counters.submit - 1,
      draw: state.counters.draw - 1,
    },
  }

  return state
}
const shuffleDiscard = (state) => {
  return {
    ...state,
    cards: { ...state.cards, draw: state.cards.discard, discard: [] },
  }
}
