import { useEffect, useState, useRef } from 'react'
import { swapCards } from './swapCards'

export { useOnClick, useMouse } from './useMouse'
export { scoreCards } from './scoreCards'
export { moveCard } from './moveCard'
export { swapCards } from './swapCards'
export { getCanAfford, doPurchase } from './doPurchase'
export { doCounters } from './doCounters'

export const useForceUpdate = () => {
  const [, setValue] = useState(0)
  return () => setValue((value) => ++value)
}

export const useWindowEvent = (event, callback) => {
  useEffect(() => {
    window.addEventListener(event, callback)
    return () => window.removeEventListener(event, callback)
  }, [event, callback])
}

export function useInterval(callback, delay) {
  const savedCallback = useRef()

  useEffect(() => {
    savedCallback.current = callback
  })

  useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    let id = setInterval(tick, delay)
    return () => clearInterval(id)
  }, [delay])
}

export const getDirections = (n = 0) => {
  let value = n
  return new Array(8).fill('').map((_, i) => (value >> i) & 0x1)
}

export const autoplayCard = (state, card) => {
  const index = state.cards.board.findIndex((c) => !c.value)
  return swapCards(state, { list: 'board', index }, card)
}
