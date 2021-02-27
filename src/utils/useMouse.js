import { useRef, useState } from 'react'
import { useWindowEvent } from '.'

export const useMouse = ({
  onMouseDown: _onMouseDown,
  onMouseUp: _onMouseUp,
}) => {
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
      _onMouseUp({ clientX, clientY, element })
    }
  })

  return { cursorState }
}
