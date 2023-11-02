<style lang="scss" scoped>
.create {
  height: 100%;
  position: relative;
  box-sizing: border-box;
  overflow: hidden;

  background-color: #18181c;
  // padding: 0 20px;
  background-image: linear-gradient(#18181c 14px, transparent 0),
    linear-gradient(90deg, transparent 14px, #86909c 0);
  background-size: 15px 15px;

  .create-fix {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    box-sizing: border-box;
    .create-panel {
      overflow: hidden;
      background-color: #232324;
      transform-origin: left center;
      border-radius: 10px;
    }
  }
}
</style>
<template>
  <div class="create">
    <SketchRule
      :key="configStore.scale"
      :scale="configStore.scale"
      :width="922"
      :height="850"
    />
    <div :style="createStyle">
      <div class="create-fix">
        <div
          id="project"
          class="create-panel"
          :style="[scaleStyle, panelStyle]"
        >
          <div
            v-for="component in configStore.config"
            :key="component.config.id"
          >
            <Controller :config="component">
              <component :is="component.config.name" v-bind="component.props" />
            </Controller>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import FeaturesComponents from "../features";
import Store, { mapComputed, panelConfig } from "../store";
import Controller from "../helperComponents/controller";
import SketchRule from "vue-sketch-ruler";
export default {
  components: {
    ...FeaturesComponents,
    Controller,
    SketchRule,
  },
  computed: {
    ...mapComputed(["scaleStyle", "configStore", "panelStyle"]),
    createStyle() {
      return {
        overflow: "auto",
        height: "100%",
        padding: ` 0 ${panelConfig.gap}px`,
      };
    },
  },
  mounted() {
    Store.actions.observerResize(this.$el);
  },
};
</script>
