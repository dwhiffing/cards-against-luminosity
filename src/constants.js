import { shuffle } from 'lodash'
import { v4 as uuid } from 'uuid'

export const emptyCard = { value: undefined, id: null, direction: 0 }
export const SUITS = '●×+✂↻✎'.split('')
export const COLORS = ['#333', '#d40000', '#33bb55', '#3322aa']
export const CARD_HEIGHT = 50

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

export const UPGRADES = {
  addRedCard: {
    title: 'Add Red Card',
    cost: { red: 0 },
    effect: { type: 'add-card', params: { value: 2, color: 0 } },
  },
  addGreenCard: {
    title: 'Add Green Card',
    cost: { green: 0 },
    effect: { type: 'add-card', params: { value: 2, color: 1 } },
  },
  addBlueCard: {
    title: 'Add Blue Card',
    cost: { blue: 0 },
    effect: { type: 'add-card', params: { value: 2, color: 2 } },
  },
  increaseHandSize: {
    title: 'Increase Hand Size',
    cost: { blue: 0 },
    effect: { type: 'change-limit', params: { name: 'hand_size', value: 1 } },
  },
  decreaseDrawTime: {
    title: 'Decrease Draw Time',
    cost: { blue: 0 },
    effect: { type: 'change-limit', params: { name: 'draw_time', value: -1 } },
  },
  decreaseSubmitTime: {
    title: 'Decrease Submit Time',
    cost: { blue: 0 },
    effect: {
      type: 'change-limit',
      params: { name: 'submit_time', value: -1 },
    },
  },
  increaseBoardSize: {
    title: 'Increase Board Size',
    cost: { blue: 0 },
    effect: { type: 'change-limit', params: { name: 'board_size', value: 1 } },
  },
}

export const STORES = {
  red: [UPGRADES.addRedCard],
  green: [UPGRADES.addGreenCard],
  // blue: [UPGRADES.increaseHandSize],
  blue: Object.values(UPGRADES),
}

const CARDS = [
  getNewCard({ value: 1, color: 1, suit: 0 }),
  getNewCard({ value: 1, color: 1, suit: 0 }),
  getNewCard({ value: 1, color: 1, suit: 0 }),
  getNewCard({ value: 1, color: 2, suit: 0 }),
  getNewCard({ value: 1, color: 2, suit: 0 }),
  getNewCard({ value: 1, color: 2, suit: 0 }),
  getNewCard({ value: 1, color: 3, suit: 0 }),
  getNewCard({ value: 1, color: 3, suit: 0 }),
  getNewCard({ value: 1, color: 3, suit: 0 }),
]
export const getInitialState = () => {
  const shuffled = shuffle(CARDS)
  const board_size = 1
  const draw_time = 30
  const submit_time = 100
  return {
    store: {
      open: 0,
    },
    limits: {
      hand_size: 1,
      draw_count: 1,
      board_size,
      draw_time,
      submit_time,
    },
    counters: {
      draw: draw_time,
      submit: submit_time,
    },
    points: {
      red: 0,
      green: 0,
      blue: 0,
    },
    cards: {
      board: getBoard(board_size),
      draw: shuffled.slice(1),
      discard: [],
      hand: shuffled.slice(0, 1),
    },
  }
}

export const getBoard = (size) =>
  new Array(size * size)
    .fill('')
    .slice(0, size * size)
    .map(() => ({ id: uuid() }))
