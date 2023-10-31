
export default function dargHelper(target, option) {
  function dragStart(mouseDownEvent) {
    const canDargSource = option.dragStart(mouseDownEvent)
    if (canDargSource) {
      const dragsMove = (mouseMoveEvent) => {
        mouseMoveEvent.preventDefault()
        option?.dragMove(mouseDownEvent, mouseMoveEvent, canDargSource)
      }
      document.addEventListener('mousemove', dragsMove)
      document.addEventListener(
        'mouseup',
        (mouseupEvent) => {
          document.removeEventListener('mousemove', dragsMove)
          option.dragEnd?.(mouseupEvent, canDargSource)
        },
        {
          once: true
        }
      )
    }
  }
  target.addEventListener('mousedown', dragStart)
  return () => {
    target.removeEventListener('mousedown', dragStart)
  }
}
