<style lang="scss" scoped>
.controller {
  position: absolute;
  &.highlight {
    border: 1px solid #51d6a9;
    .highlight-mask {
      position: absolute;
      top: 1px;
      left: 1px;
      right: 1px;
      bottom: 1px;
      background-color: rgba(81, 214, 169,.2);
    }
    .shape-point{
      position: absolute;
      width: 8px;
      height: 8px;
      // background-color: #51d6a9;
      border-radius: 2px;
      background: black;

      &.shape-point-tl{
        top: -4px;
        left: -4px;
        cursor: nw-resize;
      }
      &.shape-point-tr{
        top: -4px;
        right: -4px;
        cursor: ne-resize;
      }

      &.shape-point-bl{
        left: -4px;
        bottom: -4px;
        cursor: sw-resize;
      }

      &.shape-point-br{
        right: -4px;
        bottom: -4px;
        cursor: se-resize;
      }
    }
  }
}
</style>
<script>
import Store from '../store'
import dargHelper from '../functional/dargUtil'
export default {
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  mounted() {
    dargHelper(document, {
      dragStart: (e) => {
        const selfEL = this.$el
        if (e.target === selfEL || e.target.closest('.controller')) {
          Store.mutation.setActiveComponent(this.config.id)
          return {
            clientX: e.clientX,
            clientY: e.clientY,
            left: this.config.x.value,
            top: this.config.y.value
          }
        } else {
          if (document.querySelector('.create').contains(e.target)) {
            Store.mutation.setActiveComponent(null)
          }
        }
      },
      dragMove: (_, mouseMoveEvent, dragStartSource) => {
        const { left, top, clientX, clientY } = dragStartSource
        Store.mutation.handleDragMove(this.config, {
          x: CSS.px(
            left + (mouseMoveEvent.clientX - clientX) / Store.state.scale
          ),
          y: CSS.px(
            top + (mouseMoveEvent.clientY - clientY) / Store.state.scale
          )
        })
      }
    })
  },
  methods: {
    handleLight(h) {
      if (Store.mutation.isActiveComponent(this.config.id)) {
        return [
          h('div', {
            class: 'highlight-mask'
          }),
          h('div', {
            class: 'shape-point shape-point-tl'
          }),
          h('div', {
            class: 'shape-point shape-point-tr'
          }),
          h('div', {
            class: 'shape-point shape-point-bl'
          }),
          h('div', {
            class: 'shape-point shape-point-br'
          })
        ]
      }
      return []
    },
    handleMousePoint() {

    }
  },
  render(h) {
    const [first] = this.$slots.default
    return h(
      'div',
      {
        class: {
          controller: true,
          highlight: Store.mutation.isActiveComponent(this.config.id)
        },
        style: {
          left: this.config.x,
          top: this.config.y
        }
      },
      [
        ...this.handleLight(h),
        first
      ]
    )
  }
}
</script>
