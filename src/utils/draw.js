import { moveCard } from './moveCard'
import { shuffleDiscard } from './doCounters'

export const draw = (state) => {
  if (state.cards.draw.length > 0) {
    if (state.cards.hand.length < state.limits.hand_size)
      state = { ...moveCard(state, 'draw', 'hand') }
  } else {
    state = { ...shuffleDiscard(state) }
    if (
      state.cards.draw.length > 0 &&
      state.cards.hand.length < state.limits.hand_size
    )
      state = { ...moveCard(state, 'draw', 'hand') }
  }
  state = {
    ...state,
    counters: { ...state.counters, draw_cache: state.counters.draw_cache - 1 },
  }

  return state
}
