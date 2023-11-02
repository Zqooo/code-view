<template>
  <darg @dragEnd="dragEnd">
    <div v-for="(item, index) in config" :key="item.id" :dart-type="index">
      {{ item.img }}
    </div>
  </darg>
</template>
<script>
import darg from '../helperComponents/darg.vue'
import Store from '../store'
export default {
  components: {
    darg
  },
  props: {
    to: {
      require: true,
      type: String
    }
  },
  data() {
    return {
      config: [
        {
          img: '1',
          name: 'Test'
        },
        {
          img: '2',
          name: 'Test'
        }
      ]
    }
  },
  methods: {
    dragEnd(e) {
      const { el, done, type } = e
      const toEl = document.querySelector(`#${this.to}`)
      if (toEl) {
        const { x, y, width, height } = toEl.getBoundingClientRect()
        const { x: dragX, y: dragY } = el.getBoundingClientRect()
        if (dragX > x && dragX < x + width && dragY > y && dragY < y + height) {
          const configItem = this.config[type]
          Store.mutation.putConfig({
            config: {...configItem, id: Date.now()},
            x: dragX - x,
            y: dragY - y
          })
        }
      }
      done()
    }
  }
}
</script>
