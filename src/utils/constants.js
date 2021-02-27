import { v4 as uuid } from 'uuid'
import { getNewCard } from '../utils/index'

export const CARD_HEIGHT = 50
export const BOARD_SIZE = 5
export const OFFSET_X = BOARD_SIZE * 25
export const OFFSET_Y = BOARD_SIZE * 50

export const NEW_BOARD = new Array(BOARD_SIZE * BOARD_SIZE)
  .fill('')
  .slice(0, BOARD_SIZE * BOARD_SIZE)
  .map(() => ({ id: uuid() }))

export const CARDS = [1]
  .map((value) => [
    getNewCard({ value, color: 0 }),
    getNewCard({ value, color: 1 }),
    getNewCard({ value, color: 2 }),
  ])
  .flat()
