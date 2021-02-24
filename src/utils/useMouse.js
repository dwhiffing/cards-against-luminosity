import { useState } from 'react'
import { useWindowEvent } from '.'

export const useMouse = ({
  onMouseDown: _onMouseDown,
  onMouseUp: _onMouseUp,
}) => {
  const [cursorState, setCursorState] = useState({ mouseY: 0, mouseX: 0 })

  useWindowEvent('pointermove', ({ clientY, clientX }) => {
    setCursorState({ mouseX: clientX, mouseY: clientY })
  })

  useWindowEvent('pointerdown', ({ clientX, clientY }) => {
    let element = document.elementFromPoint(clientX, clientY)
    if (element.classList.contains('click')) element = element.parentElement
    _onMouseDown({ clientX, clientY, element })
    setCursorState({ mouseX: clientX, mouseY: clientY })
  })

  useWindowEvent('pointerup', ({ clientX, clientY }) => {
    _onMouseUp({ clientX, clientY })
  })

  return { cursorState }
}
