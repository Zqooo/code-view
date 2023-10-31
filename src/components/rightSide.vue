<template>
  <div>
    <div v-if="getFeaturesProps">
      <div v-for="props in getFeaturesProps" :key="props.type">
        <component :is="props.componentName" v-bind="props" />
      </div>
    </div>
  </div>
</template>
<script>
import { mapComputed } from '../store'
import FeaturesPropsMapping from '../features/indexMapping'
import configWidget from '../configWidget'
export default {
  components: configWidget,
  computed: {
    ...mapComputed(['getActiveComponent']),
    getFeaturesProps() {
      const activeComponent = this.getActiveComponent
      if (activeComponent) {
        return FeaturesPropsMapping[activeComponent.config.name].mapping
      }
      return null
    }
  }
}
</script>
