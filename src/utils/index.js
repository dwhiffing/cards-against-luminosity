import * as constants from './constants'
export { useForceUpdate } from './useForceUpdate'
export { useWindowEvent } from './useWindowEvent'
export { useMouse } from './useMouse'

export const swapCards = (state, a, b) => {
  const { list: l1, index: i1, ...s1 } = a
  const { list: l2, index: i2, ...s2 } = b

  return {
    ...state,
    [l1]: state[l1].map((c, i) => (i === +i1 ? s2 : c)),
    [l2]: state[l2].map((c, i) =>
      i === +i2 ? s1 : l1 === l2 && i === +i1 ? s2 : c,
    ),
  }
}

export const getCardPos = ({ index, list }) => {
  const { x: _x = 0, y: _y = 0 } = constants.CARD_POSITIONS[list] || {}
  return {
    x:
      (index % constants.BOARD_SIZE) * constants.CARD_HEIGHT +
      (window.innerWidth / 2 - constants.OFFSET_X + _x),
    y:
      Math.floor(index / constants.BOARD_SIZE) * constants.CARD_HEIGHT +
      (window.innerHeight / 2 - constants.OFFSET_Y + _y),
  }
}
