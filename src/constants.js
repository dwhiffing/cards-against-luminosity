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
    suit = shuffle([0, 0, 1, 1, 2])[0]
    value = shuffle(suit === 0 ? [3, 4, 5] : suit === 1 ? [2, 3] : [1])[0]
  }
  if (level === 2) {
    suit = shuffle([0, 1, 2, 3, 4])[0]
    value = shuffle(
      suit === 0
        ? [6, 8, 10, 20]
        : suit === 1
        ? [3, 4, 5]
        : suit === 2
        ? [1]
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
        ? [1]
        : suit === 3
        ? [3, 4, 5]
        : [3, 4, 5],
    )[0]
  }

  if (suit >= 1) {
    if (level === 1) direction = shuffle([1, 2, 4, 8])[0]
    if (level === 2) direction = shuffle([1, 2, 3, 4, 5, 6, 7, 8])[0]
    if (level === 3)
      direction = shuffle([3, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15])[0]
  }

  return getNewCard({ value, color: suit === 0 ? color : 0, suit, direction })
}

const getPrice = (baseCost = 1, priceRatio = 1.07, level) =>
  Math.floor(baseCost * Math.pow(priceRatio, level))
const getPrices = (baseCost, priceRatio, maxLevel = 20) => [
  1,
  ...new Array(maxLevel)
    .fill('')
    .map((_, level) => getPrice(baseCost, priceRatio, level)),
]

export const getNewCards = (props) => [
  getCardWithRarity(props),
  getCardWithRarity(props),
  getCardWithRarity(props),
]

const BASEUPGRADES = {
  increaseMaxDraws: {
    title: 'Increase Draw max',
    description: (l) => `You can store up to ${l + 1} card draws.`,
    cost: { type: 'red', levels: getPrices(1, 4, 9).slice(1) },
    effect: { type: 'change-limit', params: { name: 'draw_cache', value: 1 } },
  },

  increaseHandSize: {
    title: 'Increase Hand Size',
    description: (l) => `Raise your max hand size to ${l + 2}`,
    cost: { type: 'green', levels: getPrices(1, 5, 4).slice(1) },
    effect: { type: 'change-limit', params: { name: 'hand_size', value: 1 } },
  },

  increaseBoardSize: {
    title: 'Increase Board Size',
    description: (l) => `You can submit ${l + 2} cards at once.`,
    cost: { type: 'blue', levels: getPrices(5, 2.2, 23) },
    effect: { type: 'change-limit', params: { name: 'board_size', value: 1 } },
  },

  addRedCard: {
    title: 'Add Common Red Card',
    description: (l) => `Buy your ${l + 1}nd common red card`,
    cost: { type: 'red', levels: getPrices(10, 1.3, 50).slice(1) },
    effect: {
      type: 'add-card',
      params: { cardConfig: { color: 1, level: 1 } },
    },
  },
  addGreenCard: {
    title: 'Add Common Green Card',
    description: (l) => `Buy your ${l + 1}nd common green card`,
    cost: { type: 'green', levels: getPrices(10, 1.3, 50).slice(1) },
    effect: {
      type: 'add-card',
      params: { cardConfig: { color: 2, level: 1 } },
    },
  },
  addBlueCard: {
    title: 'Add Common Blue Card',
    description: (l) => `Buy your ${l + 1}nd common blue card`,
    cost: { type: 'blue', levels: getPrices(10, 1.3, 50).slice(1) },
    effect: {
      type: 'add-card',
      params: { cardConfig: { color: 3, level: 1 } },
    },
  },

  decreaseDrawTime: {
    title: 'Decrease Draw Time',
    description: (l) =>
      `Decrease your draw time to ${(
        (draw_time * TICK) / 1000 -
        (l + 1) * 0.4
      ).toFixed(1)} seconds`,
    cost: { type: 'red', levels: getPrices(3, 1.6, 10).slice(1) },
    effect: { type: 'change-limit', params: { name: 'draw_time', value: -2 } },
  },

  decreaseSubmitTime: {
    title: 'Decrease Submit Time',
    description: (l) =>
      `Decrease your submit time to ${(
        (draw_time * TICK) / 1000 -
        (l + 1) * 0.4
      ).toFixed(1)} seconds`,
    cost: { type: 'blue', levels: getPrices(3, 1.6, 10).slice(1) },
    effect: {
      type: 'change-limit',
      params: { name: 'submit_time', value: -2 },
    },
  },

  increaseMaxSubmits: {
    title: 'Increase Submit max',
    description: (l) => `You can store up to ${l + 2} card submits.`,
    cost: { type: 'blue', levels: getPrices(3, 1.6, 9).slice(1) },
    effect: {
      type: 'change-limit',
      params: { name: 'submit_cache', value: 1 },
    },
  },

  autoDraw: {
    title: 'Auto Draw',
    description: (l) => `Use your draws automatically`,
    cost: { type: 'red', levels: [100] },
    effect: {
      type: 'change-limit',
      params: { name: 'draw_auto', value: 1 },
    },
  },

  autoSubmit: {
    title: 'Auto Submit',
    description: (l) => `Use your submits automatically`,
    cost: { type: 'blue', levels: [100] },
    effect: {
      type: 'change-limit',
      params: { name: 'submit_auto', value: 1 },
    },
  },
  autoPlay: {
    title: 'Auto Play',
    description: (l) =>
      `Play a card from your hand automatically every 5 seconds`,
    cost: { type: 'green', levels: [100] },
    effect: {
      type: 'change-limit',
      params: { name: 'play_auto', value: 1 },
    },
  },

  addRedUncommonCard: {
    title: 'Add Uncommon Red Card',
    description: (l) => `Buy your ${l + 1}nd uncommon red card`,
    cost: { type: 'red', levels: getPrices(100, 1.5, 50).slice(1) },
    effect: {
      type: 'add-card',
      params: { cardConfig: { color: 1, level: 2 } },
    },
  },

  addGreenUncommonCard: {
    title: 'Add Uncommon Green Card',
    description: (l) => `Buy your ${l + 1}nd uncommon green card`,
    cost: { type: 'green', levels: getPrices(100, 1.5, 50).slice(1) },
    effect: {
      type: 'add-card',
      params: { cardConfig: { color: 2, level: 2 } },
    },
  },

  addBlueUncommonCard: {
    title: 'Add Uncommon Blue Card',
    description: (l) => `Buy your ${l + 1}nd uncommon blue card`,
    cost: { type: 'blue', levels: getPrices(100, 1.5, 50).slice(1) },
    effect: {
      type: 'add-card',
      params: { cardConfig: { color: 3, level: 2 } },
    },
  },

  addRedRareCard: {
    title: 'Add Rare Red Card',
    description: (l) => `Buy your ${l + 1}nd rare red card`,
    cost: { type: 'red', levels: getPrices(500, 1.6, 50).slice(1) },
    effect: {
      type: 'add-card',
      params: { cardConfig: { color: 1, level: 2 } },
    },
  },
  addGreenRareCard: {
    title: 'Add Rare Green Card',
    description: (l) => `Buy your ${l + 1}nd rare green card`,
    cost: { type: 'green', levels: getPrices(500, 1.6, 50).slice(1) },
    effect: {
      type: 'add-card',
      params: { cardConfig: { color: 2, level: 2 } },
    },
  },
  addBlueRareCard: {
    title: 'Add Rare Blue Card',
    description: (l) => `Buy your ${l + 1}nd rare blue card`,
    cost: { type: 'blue', levels: getPrices(500, 1.6, 50).slice(1) },
    effect: {
      type: 'add-card',
      params: { cardConfig: { color: 3, level: 3 } },
    },
  },
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
  getNewCard({ value: 3, color: 1, suit: 0 }),
  getNewCard({ value: 3, color: 2, suit: 0 }),
  getNewCard({ value: 3, color: 3, suit: 0 }),
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
      play_auto_time: 5,
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
