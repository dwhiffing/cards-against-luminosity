import omit from 'lodash/omit'
import { useEffect, useState, useRef } from 'react'
import { swapCards } from './swapCards'

export { useOnClick, useMouse } from './useMouse'
export { scoreCards } from './scoreCards'
export { moveCard } from './moveCard'
export { swapCards } from './swapCards'
export { getCanAfford, doPurchase } from './doPurchase'
export { doCounters } from './doCounters'
export { draw } from './draw'

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
  if (state.cards.board.every((c) => !!c.value)) return state
  const index = state.cards.board.findIndex((c) => !c.value)
  if (!card) return state
  return swapCards(state, { list: 'board', index }, card)
}

export const writeToStorage = async (queryKey, data) => {
  let storageData = await localStorage.getItem('__incremental_data')

  storageData = {
    ...JSON.parse(storageData || '{}'),
    [queryKey]: data,
  }
  await localStorage.setItem('__incremental_data', JSON.stringify(storageData))
}

export const readFromStorage = async () => {
  const storageData = await localStorage.getItem('__incremental_data')
  let result = {}

  if (storageData !== null) {
    const queriesWithData = JSON.parse(storageData)

    for (const queryKey in queriesWithData) {
      const data = queriesWithData[queryKey]
      result[queryKey] = data
    }
  }
  return result
}

export const removeFromStorage = async (key) => {
  let storageData = await localStorage.getItem('__incremental_data')
  await localStorage.setItem(
    '__incremental_data',
    JSON.stringify(omit(JSON.parse(storageData || '{}'), [key])),
  )
}
