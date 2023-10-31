<template>
  <div>
    {{ $attrs.typeName }}
    <input
      v-for="item in renderOption"
      :key="item.options.propKey"
      v-model="getActiveComponent.props[item.options.propKey]"
      :placeholder="item.options.placeholder"
      type="text"
    >
  </div>
</template>

<script>
import { mapComputed } from '../store'
export default {
  computed: {
    ...mapComputed(['getActiveComponent']),
    renderOption() {
      return this.$attrs.options
    }
  }
}

</script>
