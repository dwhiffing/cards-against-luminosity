import { v4 as uuid } from 'uuid'

export const CARD_HEIGHT = 50
export const BOARD_SIZE = 5
export const OFFSET_X = BOARD_SIZE * 25
export const OFFSET_Y = BOARD_SIZE * 50

export const NEW_BOARD = new Array(BOARD_SIZE * BOARD_SIZE)
  .fill('')
  .slice(0, BOARD_SIZE * BOARD_SIZE)
  .map(() => ({ id: uuid() }))

export const CARDS = [1, 1, 2]
  .map((value) => [
    { value, color: 0, suit: 0, id: uuid() },
    { value, color: 1, suit: 0, id: uuid() },
    { value, color: 2, suit: 0, id: uuid() },
  ])
  .flat()
