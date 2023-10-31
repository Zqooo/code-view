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
          console.log(Store.state, "state", this.config.config.id);
          return {
            clientX: e.clientX,
            clientY: e.clientY,
            left: this.config.x.value,
            top: this.config.y.value,
          };
        } else if (
          document.querySelector(".create").contains(e.target)&&
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
        if (e.target.classList.contains("shape-point")) {
          context.isPointActive = true;
          return {
            clientX: e.clientX,
            clientY: e.clientY,
            point: e.target.classList.item(1).replace(/shape-point-/, ""),
          };
        } else {
          context.isPointActive = false;
        }
      },
      dragMove: (_, mouseMoveEvent, dragStartSource) => {
        const { point, clientX, clientY } = dragStartSource;
        const isTop = /t/.test(point);
        const isBottom = /b/.test(point);
        const isLeft = /l/.test(point);
        const isRight = /r/.test(point);
      },
      dargEnd() {
        context.isPointActive = false;
      },
      // dragMove:(_,mouseMoveEvent,dragStartSource)=>{
      //   console.log("--222-- dragMove");
      //   mouseMoveEvent.stopPropagation();
      //   mouseMoveEvent.preventDefault()
      // }
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
        ];
      }
      return [];
    },
    handleMousePoint() {},
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
