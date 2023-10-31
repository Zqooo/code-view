<style lang="scss" scoped>
.create {
  height: 100%;
  position: relative;
  border: 1px solid #ccc;
  box-sizing: border-box;
  overflow: hidden;
  .create-fix {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    .create-panel {
      overflow: hidden;
      background: #ccc;
      transform-origin: left center;
    }
  }
}
</style>
<template>
  <div class="create">
    <div class="create-fix">
      <div id="project" class="create-panel" :style="[scaleStyle,panelStyle]">
        <div v-for="component in configStore.config" :key="component.config.id">
          <Controller :config="component">
            <component
              :is="component.config.name"
              v-bind="component.props"
            />
          </Controller>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import FeaturesComponents from '../features'
import Store, { mapComputed } from '../store'
import Controller from '../helperComponents/controller'
export default {
  components: {
    Controller,
    ...FeaturesComponents
  },
  computed: mapComputed(['scaleStyle', 'configStore', 'panelStyle']),
  mounted() {
    Store.actions.observerResize(this.$el)
  }
}
</script>
