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
      background-color: rgba(81, 214, 169, 0.2);
    }
    .shape-point {
      position: absolute;
      width: 12px;
      height: 12px;
      background-color: #51d6a9;
      border-radius: 2px;

      &.shape-point-tl {
        top: -6px;
        left: -6px;
        cursor: nw-resize;
      }
      &.shape-point-tr {
        top: -6px;
        right: -6px;
        cursor: ne-resize;
      }

      &.shape-point-bl {
        left: -6px;
        bottom: -6px;
        cursor: sw-resize;
      }

      &.shape-point-br {
        right: -6px;
        bottom: -6px;
        cursor: se-resize;
      }
      &.shape-point-t {
        width: 24px;
        top: -6px;
        left: 50%;
        transform: translateX(-50%);
        cursor: n-resize;
      }
      &.shape-point-b {
        width: 24px;
        bottom: -6px;
        left: 50%;
        transform: translateX(-50%);
        cursor: s-resize;
      }

      &.shape-point-l {
        height: 24px;
        left: -6px;
        top: 50%;
        transform: translateY(-50%);
        cursor: w-resize;
      }

      &.shape-point-r {
        height: 24px;
        right: -6px;
        top: 50%;
        transform: translateY(-50%);
        cursor: e-resize;
      }
    }
  }
}
</style>
<script>
import Store from "../store";
import dargHelper from "../functional/dargUtil";
export default {
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    const context = {
      isPointActive: false,
    };
    dargHelper(document, {
      dragStart: (e) => {
        const selfEL = this.$el;
        if (
          (e.target === selfEL || selfEL.contains(e.target)) &&
          context.isPointActive === false
        ) {
          Store.mutation.setActiveComponent(this.config.config.id);
          return {
            clientX: e.clientX,
            clientY: e.clientY,
            left: this.config.x.value,
            top: this.config.y.value,
          };
        } else if (
          document.querySelector(".create").contains(e.target) &&
          e.target.closest(".controller") === null
        ) {
          Store.mutation.setActiveComponent(null);
        }
      },
      dragMove: (_, mouseMoveEvent, dragStartSource) => {
        if (
          context.isPointActive === false &&
          Store.mutation.isActiveComponent(this.config.config.id)
        ) {
          const { left, top, clientX, clientY } = dragStartSource;
          Store.mutation.handleDragMove(this.config, {
            x: CSS.px(
              left + (mouseMoveEvent.clientX - clientX) / Store.state.scale
            ),
            y: CSS.px(
              top + (mouseMoveEvent.clientY - clientY) / Store.state.scale
            ),
          });
        }
      },
    });

    dargHelper(document, {
      dragStart: (e) => {
        const selfEL = this.$el;
        if (
          e.target.classList.contains("shape-point") &&
          selfEL.contains(e.target)
        ) {
          context.isPointActive = true;
          return {
            clientX: e.clientX,
            clientY: e.clientY,
            left: this.config.x.value,
            top: this.config.y.value,
            initWidth: this.config.props.width,
            initHeight: this.config.props.height,
            point: e.target.classList.item(1).replace(/shape-point-/, ""),
          };
        } else {
          context.isPointActive = false;
        }
      },
      dragMove: (_, mouseMoveEvent, dragStartSource) => {
        const { point, clientX, clientY, left, top, initWidth, initHeight } =
          dragStartSource;
        const isTop = /t/.test(point);
        const isBottom = /b/.test(point);
        const isLeft = /l/.test(point);
        const isRight = /r/.test(point);
        let level = mouseMoveEvent.clientX - clientX;
        let vertical = mouseMoveEvent.clientY - clientY;
        if (isLeft) {
          Store.mutation.handleDragMove(this.config, {
            x: CSS.px(left + level / Store.state.scale),
          });
          level = ~level;
        }
        if (isTop) {
          Store.mutation.handleDragMove(this.config, {
            y: CSS.px(top + vertical / Store.state.scale),
          });
          vertical = ~vertical;
        }
        if (isLeft || isRight)
          this.config.props.width = initWidth + level / Store.state.scale;
        if (isTop || isBottom)
          this.config.props.height = initHeight + vertical / Store.state.scale;
      },
      dragEnd() {
        context.isPointActive = false;
      },
    });
  },
  methods: {
    handleLight(h) {
      if (Store.mutation.isActiveComponent(this.config.config.id)) {
        return [
          h("div", {
            class: "highlight-mask",
          }),
          h("div", {
            class: "shape-point shape-point-tl",
          }),
          h("div", {
            class: "shape-point shape-point-tr",
          }),
          h("div", {
            class: "shape-point shape-point-bl",
          }),
          h("div", {
            class: "shape-point shape-point-br",
          }),
          h("div", {
            class: "shape-point shape-point-t",
          }),
          h("div", {
            class: "shape-point shape-point-b",
          }),
          h("div", {
            class: "shape-point shape-point-l",
          }),
          h("div", {
            class: "shape-point shape-point-r",
          }),
        ];
      }
      return [];
    },
  },
  render(h) {
    const [first] = this.$slots.default;
    return h(
      "div",
      {
        class: {
          controller: true,
          highlight: Store.mutation.isActiveComponent(this.config.config.id),
        },
        style: {
          left: this.config.x,
          top: this.config.y,
        },
      },
      [...this.handleLight(h), first]
    );
  },
};
</script>
