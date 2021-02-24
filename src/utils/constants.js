import { v4 as uuid } from 'uuid'

export const CARD_HEIGHT = 50
export const BOARD_SIZE = 5
export const OFFSET_X = BOARD_SIZE * 25
export const OFFSET_Y = BOARD_SIZE * 50
export const CARD_POSITIONS = { hand: { y: 300 } }

export const NEW_BOARD = new Array(BOARD_SIZE * BOARD_SIZE)
  .fill('')
  .slice(0, BOARD_SIZE * BOARD_SIZE)
  .map(() => ({ id: uuid() }))

export const CARDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  .map((value) => [
    { value, suit: 0, id: uuid() },
    { value, suit: 1, id: uuid() },
    { value, suit: 2, id: uuid() },
    { value, suit: 3, id: uuid() },
  ])
  .flat()
