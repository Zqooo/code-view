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
      &.shape-point-x {
        width: 12px;
        height: 12px;
        background-color: red;
        bottom: -30px;
        left: 50%;
        transform: translateX(-50%);
        cursor: pointer;
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
          let basicOption = {
            clientX: e.clientX,
            clientY: e.clientY,
            left: this.config.x.value,
            top: this.config.y.value,
            initWidth: this.config.props.width,
            initHeight: this.config.props.height,
          };
          let addOption = {};
          const point = e.target.classList.item(1).replace(/shape-point-/, "");
          const isRotate = /x/.test(point);

          if (isRotate) {
            const rect = this.$el.getBoundingClientRect();
            const origin = {
              x: rect.x + (this.config.props.width * Store.state.scale) / 2,
              y: rect.y + (this.config.props.height * Store.state.scale) / 2,
            };
            addOption = {
              origin,
              action: "rotate",
            };
          } else {
            const position = {
              isTop: /t/.test(point),
              isBottom: /b/.test(point),
              isLeft: /l/.test(point),
              isRight: /r/.test(point),
            };
            addOption = {
              position,
              action: "scale",
            };
          }
          return {
            ...basicOption,
            ...addOption,
          };
        } else {
          context.isPointActive = false;
        }
      },
      dragMove: (_, mouseMoveEvent, dragStartSource) => {
        if (
          context.isPointActive === true &&
          Store.mutation.isActiveComponent(this.config.config.id)
        ) {
          const { action } = dragStartSource;

          const reducer = {
            rotate: () => {
              const { origin } = dragStartSource;
              let level = mouseMoveEvent.clientX - origin.x;
              let vertical = mouseMoveEvent.clientY - origin.y;
              let rotationInRadians = Math.atan2(level, vertical);
              let deg = rotationInRadians * (180 / Math.PI);
              this.config.props.rotate = deg;
            },
            scale: () => {
              const {
                clientX,
                clientY,
                left,
                top,
                initWidth,
                initHeight,
                position,
              } = dragStartSource;
              const { isTop, isBottom, isLeft, isRight } = position;
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
              if (isLeft || isRight) {
                let value = initWidth + level / Store.state.scale;
                this.config.props.width = value <= 0 ? 0 : value;
              }
              if (isTop || isBottom) {
                let value = initHeight + vertical / Store.state.scale;
                this.config.props.height = value <= 0 ? 0 : value;
              }
            },
          };

          if (action) reducer[action]();
        }
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
          h("div", {
            class: "shape-point shape-point-x",
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
          transform: `rotate(${-this.config.props.rotate}deg)`,
        },
      },
      [...this.handleLight(h), first]
    );
  },
};
</script>
