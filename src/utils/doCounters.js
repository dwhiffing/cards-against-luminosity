import * as utils from '../utils'
import { draw } from './draw'

export const doCounters = (state) => {
  if (state.counters.draw_time === 0) {
    state = {
      ...state,
      counters: {
        ...state.counters,
        draw_cache: state.counters.draw_cache + 1,
        draw_time: state.limits.draw_time,
      },
    }
  } else if (state.counters.draw_cache < state.limits.draw_cache) {
    state = {
      ...state,
      counters: { ...state.counters, draw_time: state.counters.draw_time - 1 },
    }
  }

  if (state.counters.submit_time === 0) {
    state = {
      ...state,
      counters: {
        ...state.counters,
        submit_cache: state.counters.submit_cache + 1,
        submit_time: state.limits.submit_time,
      },
    }
  } else {
    if (state.counters.submit_cache < state.limits.submit_cache)
      state = {
        ...state,
        counters: {
          ...state.counters,
          submit_time: state.counters.submit_time - 1,
        },
      }
  }

  if (state.counters.draw_cache > 0 && state.auto_play.draw) {
    state = draw(state)
  }

  if (
    state.counters.submit_cache > 0 &&
    state.auto_play.submit &&
    state.cards.board.filter((c) => !!c.value).length > 0
  ) {
    state = utils.scoreCards(state)
  }

  return state
}
export const shuffleDiscard = (state) => {
  return {
    ...state,
    cards: { ...state.cards, draw: state.cards.discard, discard: [] },
  }
}
