import { shuffle } from 'lodash'
import { v4 as uuid } from 'uuid'

export const emptyCard = { value: undefined, id: null, direction: 0 }
export const TICK = 200
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

// TODO: should create function to generate array of prices from scaling config
// input { baseCost, scalingRatio, maxPrice}

const BASEUPGRADES = {
  increaseHandSize: {
    title: 'Increase Hand Size',
    cost: { red: [1, 5, 20] },
    effect: { type: 'change-limit', params: { name: 'hand_size', value: 1 } },
  },
  decreaseDrawTime: {
    title: 'Decrease Draw Time',
    cost: { green: [1, 2, 4, 9, 15, 50, 100, 200] },
    effect: { type: 'change-limit', params: { name: 'draw_time', value: -1 } },
  },
  increaseMaxDraws: {
    title: 'Increase Draw max',
    cost: { green: [1, 2, 4, 9, 15, 50, 100, 200] },
    effect: { type: 'change-limit', params: { name: 'draw_cache', value: 1 } },
  },
  increaseBoardSize: {
    title: 'Increase Board Size',
    cost: { blue: [1, 50, 1000] },
    effect: { type: 'change-limit', params: { name: 'board_size', value: 1 } },
  },

  decreaseSubmitTime: {
    title: 'Decrease Submit Time',
    cost: { blue: 0 },
    effect: {
      type: 'change-limit',
      params: { name: 'submit_time', value: -1 },
    },
  },

  addPoints: {
    title: 'Cheat Points',
    cost: {},
    effect: { type: 'add-points', params: { value: 100 } },
  },

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
}

export const UPGRADES = Object.entries(BASEUPGRADES).reduce((obj, [k, v]) => {
  return { ...obj, [k]: { ...v, name: k } }
}, {})

export const STORES = {
  red: [UPGRADES.increaseHandSize, UPGRADES.addPoints],
  green: [UPGRADES.decreaseDrawTime, UPGRADES.increaseMaxDraws],
  blue: [UPGRADES.increaseBoardSize],
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
  const draw_time = 25
  const submit_time = 50
  return {
    store: {
      open: 0,
    },
    purchases: {},
    limits: {
      hand_size: 1,
      draw_count: 1,
      draw_cache: 1,
      submit_cache: 1,
      board_size,
      draw_time,
      submit_time,
    },
    counters: {
      draw_time: 0,
      submit_time: 0,
      draw_cache: 0,
      submit_cache: 0,
    },
    points: {
      red: 0,
      green: 0,
      blue: 0,
    },
    cards: {
      board: getBoard(board_size),
      draw: shuffled,
      discard: [],
      hand: [],
    },
  }
}

export const getBoard = (size) =>
  new Array(size * size)
    .fill('')
    .slice(0, size * size)
    .map(() => ({ id: uuid() }))
