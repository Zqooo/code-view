<template>
  <darg @dragEnd="dragEnd">
    <div v-for="item in config" :key="item.id" :dart-id="item.id">
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
          id: 1,
          img: '1',
          name: 'Test'
        }
      ]
    }
  },
  methods: {
    dragEnd(e) {
      const { el, done, id } = e
      const toEl = document.querySelector(`#${this.to}`)
      if (toEl) {
        const { x, y, width, height } = toEl.getBoundingClientRect()
        const { x: dragX, y: dragY } = el.getBoundingClientRect()
        if (dragX > x && dragX < x + width && dragY > y && dragY < y + height) {
          const configItem = this.config.find((item) => item.id.toString() === id.toString())
          Store.mutation.putConfig({
            config: configItem,
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
