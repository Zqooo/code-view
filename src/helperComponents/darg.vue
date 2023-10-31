<template>
  <div><slot /></div>
</template>

<script>
import dargHelper from '../functional/dargUtil'
export default {
  mounted() {
    dargHelper(document, {
      dragStart: (e) => {
        const id = e.target.getAttribute('dart-id')
        if (id) {
          const cloneTag = e.target.cloneNode(true)
          cloneTag.style.position = 'absolute'
          cloneTag.style.left = CSS.px(e.clientX)
          cloneTag.style.top = CSS.px(e.clientY)
          document.body.appendChild(cloneTag)
          return {
            id,
            cloneTag,
            clientX: e.clientX,
            clientY: e.clientY
          }
        }
      },
      dragMove: (_, mouseMoveEvent, dragStartSource) => {
        const { clientX, clientY, cloneTag } = dragStartSource
        cloneTag.style.left = CSS.px(mouseMoveEvent.clientX - clientX)
        cloneTag.style.top = CSS.px(mouseMoveEvent.clientY - clientY)
      },
      dragEnd: (mouseupEvent, dragStartSource) => {
        const { id, cloneTag } = dragStartSource
        this.$emit('dragEnd', {
          id,
          el: cloneTag,
          event: mouseupEvent,
          done() {
            document.body.removeChild(cloneTag)
          }
        })
      }
    })
  }
}
</script>
