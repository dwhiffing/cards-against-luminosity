import { v4 as uuid } from 'uuid'
import { getNewCard } from '../utils/index'

export const CARD_HEIGHT = 50
export const DRAW_TIMER = 0
export const BOARD_SIZE = 5
export const OFFSET_X = BOARD_SIZE * 25
export const OFFSET_Y = BOARD_SIZE * 50

export const NEW_BOARD = new Array(BOARD_SIZE * BOARD_SIZE)
  .fill('')
  .slice(0, BOARD_SIZE * BOARD_SIZE)
  .map(() => ({ id: uuid() }))

export const CARDS = [
  getNewCard({ value: 3, color: 1, suit: 0 }),
  getNewCard({ value: 3, color: 2, suit: 0 }),
  getNewCard({ value: 3, color: 3, suit: 0 }),
  getNewCard({ value: 2, color: 0, suit: 1, direction: 1 }),
  getNewCard({ value: 1, color: 0, suit: 2, direction: 1 }),
  getNewCard({ value: 1, color: 0, suit: 3, direction: 1 }),
  getNewCard({ value: 9, color: 0, suit: 4, direction: 1 }),
]
