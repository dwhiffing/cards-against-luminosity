import { shuffle } from 'lodash'
import { v4 as uuid } from 'uuid'

export const emptyCard = { value: undefined, id: null, direction: 0 }
export const CHEAT_MODE = false
export const TICK = 200
export const SUITS = '●×✂+↻'.split('')
export const COLORS = ['#333', '#d40000', '#33bb55', '#3322aa']
export const CARD_HEIGHT = 50
const draw_time = 25
const submit_time = 25

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

export const getCardWithRarity = ({ color, level }) => {
  let value, suit, direction
  if (level === 1) {
    suit = shuffle([0, 1, 2])[0]
    value = shuffle(suit === 0 ? [2, 3, 4, 5] : suit === 1 ? [2, 3] : [1, 2])[0]
  }
  if (level === 2) {
    suit = shuffle([0, 1, 2, 3, 4])[0]
    value = shuffle(
      suit === 0
        ? [6, 8, 10, 20]
        : suit === 1
        ? [3, 4, 5]
        : suit === 2
        ? [1, 2, 3]
        : suit === 3
        ? [1, 2, 3]
        : [1, 2, 3],
    )[0]
  }
  if (level === 3) {
    suit = shuffle([1, 2, 3, 4])[0]
    value = shuffle(
      suit === 0
        ? [20, 40, 60, 100]
        : suit === 1
        ? [10, 20, 30]
        : suit === 2
        ? [3, 4, 5]
        : suit === 3
        ? [3, 4, 5]
        : [3, 4, 5],
    )[0]
  }

  if (suit >= 1) {
    if (level === 1) direction = shuffle([2, 8])[0]
    if (level > 1) direction = shuffle([1, 2, 4, 8])[0]
  }

  // 0: pointCards = [],
  //   1: multiCards = [],
  //   2: upgradeCards = [],
  //   3: removeCards = [],
  //   4: persistCards = [],

  return getNewCard({ value, color, suit, direction })
}

const getPrice = (baseCost = 1, priceRatio = 1.07, level) =>
  Math.floor(Math.pow(baseCost * priceRatio, level))
const getPrices = (baseCost, priceRatio, maxLevel = 20) =>
  new Array(maxLevel + 1)
    .fill('')
    .map((_, level) => getPrice(baseCost, priceRatio, level))
    .slice(1)

// TODO: should create function to generate array of prices from scaling config
// input { baseCost, scalingRatio, maxPrice}

export const getNewCards = (props) => [
  getCardWithRarity(props),
  getCardWithRarity(props),
  getCardWithRarity(props),
]

const standardCurve = getPrices(1, 1.6, 10)
const BASEUPGRADES = {
  increaseMaxDraws: {
    title: 'Increase Draw max',
    description: (l) => `You can store up to ${l + 1} card draws.`,
    cost: { type: 'red', levels: standardCurve },
    effect: { type: 'change-limit', params: { name: 'draw_cache', value: 1 } },
  },
  increaseHandSize: {
    title: 'Increase Hand Size',
    description: (l) => `Raise your max hand size to ${l + 2}`,
    cost: { type: 'green', levels: standardCurve },
    effect: { type: 'change-limit', params: { name: 'hand_size', value: 1 } },
  },

  increaseBoardSize: {
    title: 'Increase Board Size',
    description: (l) => 'WRITE ME',
    cost: { type: 'blue', levels: [1, 10, 100, 1000] },
    effect: { type: 'change-limit', params: { name: 'board_size', value: 1 } },
  },

  addRedCard: {
    title: 'Add Common Red Card',
    description: (l) => 'WRITE ME',
    cost: { type: 'red', levels: getPrices(2, 1.07, 10) },
    effect: {
      type: 'add-card',
      params: { cardConfig: { color: 1, level: 1 } },
    },
  },
  addGreenCard: {
    title: 'Add Common Green Card',
    description: (l) => 'WRITE ME',
    cost: { type: 'green', levels: getPrices(2, 1.07, 10) },
    effect: {
      type: 'add-card',
      params: { cardConfig: { color: 2, level: 1 } },
    },
  },
  addBlueCard: {
    title: 'Add Common Blue Card',
    cost: { type: 'blue', levels: getPrices(2, 1.07, 10) },
    effect: {
      type: 'add-card',
      params: { cardConfig: { color: 3, level: 1 } },
    },
  },

  addRedUncommonCard: {
    title: 'Add Uncommon Red Card',
    description: (l) => 'WRITE ME',
    cost: { type: 'red', levels: getPrices(5, 1.07, 10) },
    effect: {
      type: 'add-card',
      params: { cardConfig: { color: 1, level: 2 } },
    },
  },
  addGreenUncommonCard: {
    title: 'Add Uncommon Green Card',
    description: (l) => 'WRITE ME',
    cost: { type: 'green', levels: getPrices(5, 1.07, 10) },
    effect: {
      type: 'add-card',
      params: { cardConfig: { color: 2, level: 2 } },
    },
  },
  addBlueUncommonCard: {
    title: 'Add Uncommon Blue Card',
    cost: { type: 'blue', levels: getPrices(5, 1.07, 10) },
    effect: {
      type: 'add-card',
      params: { cardConfig: { color: 3, level: 2 } },
    },
  },

  addRedRareCard: {
    title: 'Add Rare Red Card',
    description: (l) => 'WRITE ME',
    cost: { type: 'red', levels: getPrices(10, 1.07, 10) },
    effect: {
      type: 'add-card',
      params: { cardConfig: { color: 1, level: 2 } },
    },
  },
  addGreenRareCard: {
    title: 'Add Rare Green Card',
    description: (l) => 'WRITE ME',
    cost: { type: 'green', levels: getPrices(10, 1.07, 10) },
    effect: {
      type: 'add-card',
      params: { cardConfig: { color: 2, level: 2 } },
    },
  },
  addBlueRareCard: {
    title: 'Add Rare Blue Card',
    cost: { type: 'blue', levels: getPrices(10, 1.07, 10) },
    effect: {
      type: 'add-card',
      params: { cardConfig: { color: 3, level: 3 } },
    },
  },

  decreaseDrawTime: {
    title: 'Decrease Draw Time',
    description: (l) =>
      `Decrease your draw time to ${
        (draw_time * TICK) / 1000 - (l + 1) * 0.2
      } seconds`,
    cost: { type: 'red', levels: getPrices(3, 1.6, 10) },
    effect: { type: 'change-limit', params: { name: 'draw_time', value: -1 } },
  },

  decreaseSubmitTime: {
    title: 'Decrease Submit Time',
    description: (l) => 'WRITE ME',
    cost: { type: 'blue', levels: getPrices(3, 1.6, 10) },
    effect: {
      type: 'change-limit',
      params: { name: 'submit_time', value: -1 },
    },
  },

  increaseMaxSubmits: {
    title: 'Increase Submit max',
    description: (l) => 'WRITE ME',
    cost: { type: 'blue', levels: getPrices(3, 1.6, 10) },
    effect: { type: 'change-limit', params: { name: 'draw_cache', value: 1 } },
  },

  autoDraw: {
    title: 'Auto Draw',
    description: (l) => 'WRITE ME',
    cost: { type: 'red', levels: [1000] },
    effect: {
      type: 'change-limit',
      params: { name: 'draw_auto', value: 1 },
    },
  },

  autoSubmit: {
    title: 'Auto Submit',
    description: (l) => 'WRITE ME',
    cost: { type: 'blue', levels: [1000] },
    effect: {
      type: 'change-limit',
      params: { name: 'submit_auto', value: 1 },
    },
  },
  autoPlay: {
    title: 'Auto Play',
    description: (l) => 'WRITE ME',
    cost: { type: 'green', levels: [1000] },
    effect: {
      type: 'change-limit',
      params: { name: 'play_auto', value: 1 },
    },
  },

  // addPoints: {
  //   title: 'Cheat Points',
  //   cost: { type: 'red', levels: [0, 0, 0, 0, 0, 0] },
  //   effect: { type: 'add-points', params: { value: 100 } },
  // },
  // prestige: {
  //   title: 'Prestige',
  //   cost: { type: 'blue', levels: [1] },
  //   effect: {
  //     type: 'change-limit',
  //     params: { name: 'prestige', value: 0.1 },
  //   },
  // },
}

export const UPGRADES = Object.entries(BASEUPGRADES).reduce((obj, [k, v]) => {
  return { ...obj, [k]: { ...v, name: k } }
}, {})

export const STORES = {
  red: Object.values(UPGRADES).filter((u) => u.cost.type === 'red'),
  green: Object.values(UPGRADES).filter((u) => u.cost.type === 'green'),
  blue: Object.values(UPGRADES).filter((u) => u.cost.type === 'blue'),
}

const CARDS = [
  getNewCard({ value: 1, color: 1, suit: 0 }),
  getNewCard({ value: 1, color: 2, suit: 0 }),
  getNewCard({ value: 1, color: 3, suit: 0 }),
  getNewCard({ value: 2, color: 1, suit: 0 }),
  getNewCard({ value: 2, color: 2, suit: 0 }),
  getNewCard({ value: 2, color: 3, suit: 0 }),
  getNewCard({ value: 1, color: 1, suit: 0 }),
  getNewCard({ value: 1, color: 2, suit: 0 }),
  getNewCard({ value: 1, color: 3, suit: 0 }),
]
export const getInitialState = () => {
  const shuffled = CARDS
  const board_size = 1

  return {
    store: {
      open: 0,
    },
    purchases: {},
    limits: {
      prestige: 1,
      hand_size: 1,
      draw_count: 1,
      draw_auto: 0,
      submit_auto: 0,
      play_auto_time: 20,
      play_auto: 0,
      draw_cache: 1,
      submit_cache: 1,
      board_size,
      draw_time,
      submit_time,
    },
    auto_play: {
      draw: false,
      submit: false,
      play: false,
    },
    counters: {
      play_time: 0,
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
    max_points: {
      red: 0,
      green: 0,
      blue: 0,
    },
    seen_upgrades: {},
    cards: {
      board: getBoard(board_size),
      draw: shuffled,
      discard: [],
      hand: [],
    },
  }
}

export const getBoard = (size) =>
  new Array(size)
    .fill('')
    .slice(0, size)
    .map(() => ({ id: uuid() }))
