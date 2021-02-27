import { shuffle } from 'lodash'
import { v4 as uuid } from 'uuid'

export const emptyCard = { value: undefined, id: null, direction: 0 }
export const SUITS = '●×+✂↻✎'.split('')
export const COLORS = ['#333', '#d40000', '#33bb55', '#3322aa']
export const CARD_HEIGHT = 50
export const DRAW_TIMER = 0
export const BOARD_SIZE = 5

export const getNewCard = ({
  value = 1,
  color = 0,
  suit = 0,
  direction = 0,
} = {}) => ({
  value,
  color,
  suit,
  direction,
  id: uuid(),
})

export const CARDS = [
  getNewCard({ value: 1, color: 1, suit: 0 }),
  getNewCard({ value: 1, color: 2, suit: 0 }),
  getNewCard({ value: 1, color: 3, suit: 0 }),
]

export const UPGRADES = {
  addRedCard: {
    title: 'Add Red Card',
    cost: { red: 1 },
    effect: { type: 'add-card', params: { value: 2, color: 0 } },
  },
  addGreenCard: {
    title: 'Add Green Card',
    cost: { green: 1 },
    effect: { type: 'add-card', params: { value: 2, color: 1 } },
  },
  addBlueCard: {
    title: 'Add Blue Card',
    cost: { blue: 1 },
    effect: { type: 'add-card', params: { value: 2, color: 2 } },
  },
}

export const STORES = {
  red: [UPGRADES.addRedCard],
  green: [UPGRADES.addGreenCard],
  blue: [UPGRADES.addBlueCard],
}

export const getInitialState = () => {
  const shuffled = shuffle(CARDS)
  return {
    store: {
      open: 0,
    },
    counters: {
      draw: DRAW_TIMER,
    },
    points: {
      red: 0,
      green: 0,
      blue: 0,
    },
    cards: {
      board: getBoard(),
      draw: shuffled.slice(1),
      discard: [],
      hand: shuffled.slice(0, 1),
    },
  }
}

const getBoard = () =>
  new Array(BOARD_SIZE * BOARD_SIZE)
    .fill('')
    .slice(0, BOARD_SIZE * BOARD_SIZE)
    .map(() => ({ id: uuid() }))
