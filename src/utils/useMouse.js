import { useRef, useState } from 'react'
import * as utils from './index'
import { useWindowEvent } from '.'

export const useMouse = (_onMouseDown) => {
  const [cursorState, setCursorState] = useState({ mouseY: 0, mouseX: 0 })
  const startRef = useRef({ x: 0, y: 0 })

  useWindowEvent('pointermove', ({ clientY, clientX }) => {
    setCursorState({ mouseX: clientX, mouseY: clientY })
  })

  useWindowEvent('pointerdown', ({ clientX, clientY }) => {
    let element = document.elementFromPoint(clientX, clientY)
    if (element.classList.contains('click')) element = element.parentElement
    startRef.current.x = clientX
    startRef.current.y = clientY
    _onMouseDown({
      clientX,
      clientY,
      element,
    })
    setCursorState({ mouseX: clientX, mouseY: clientY })
  })

  useWindowEvent('pointerup', ({ clientX, clientY }) => {
    let element = document.elementFromPoint(clientX, clientY)
    if (element.classList.contains('click')) element = element.parentElement
    if (
      startRef.current.x - clientX > 10 ||
      startRef.current.y - clientY > 10
    ) {
      _onMouseDown({ clientX, clientY, element })
    }
  })

  return { cursorState }
}

export const useOnClick = (state, setState) => {
  const lastClickRef = useRef(0)

  return ({ element }) => {
    const { list, index } = element.dataset
    if (!list) {
      if (isDoubleClick(lastClickRef.current))
        setState(utils.autoplayCard(state, state.activeCard))

      return setState((state) => ({ ...state, activeCard: null }))
    }

    const clicked = { ...state.cards[list][+index], list, index: +index }

    if (state.activeCard) {
      setState((state) => ({
        ...utils.swapCards(state, clicked, state.activeCard),
        activeCard: null,
      }))
    } else if (clicked.value > -1) {
      lastClickRef.current = new Date()
      setState((state) => ({ ...state, activeCard: clicked }))
    }
  }
}
const isDoubleClick = (date) => +new Date() - +date < 250
