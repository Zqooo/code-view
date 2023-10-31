import Vue from 'vue'
import FeaturesPropsMapping from './features/indexMapping'
export const panelConfig = {
  width: 1920,
  height: 1080,
  gap:20
}

function builderPropsMapping(mappingProps) {
  const props = {}
  const walk = (mappingProps) => {
    for (const value of mappingProps) {
      if ('typeName' in value) {
        walk(value.options)
      } else if (value.renderProps) {
        props[value.options.propKey] = value.options.value
      }
    }
  }
  walk(mappingProps)
  return props
}

function createStore() {
  const state = Vue.observable({
    config: [],
    scale: 1,
    activeComponentId: null
  })
  const computed = {
    getActiveComponent() {
      if (state.activeComponentId === null) {
        return null
      }
      return state.config.find((item) => item.id === state.activeComponentId)
    },
    panelStyle() {
      return {
        width: CSS.px(panelConfig.width),
        height: CSS.px(panelConfig.height)
      }
    },
    scaleStyle() {
      return {
        transform: `scale(${state.scale})`
      }
    },
    configStore() {
      return state
    }
  }
  const mutation = {
    isActiveComponent(componentId) {
      return state.activeComponentId === componentId
    },
    setActiveComponent(activeComponentId) {
      state.activeComponentId = activeComponentId
    },
    putConfig(config) {
      const mappingProps = FeaturesPropsMapping[config.config.name]
      state.config.push({
        props: builderPropsMapping(mappingProps.mapping),
        config: config.config,
        x: CSS.px(config.x / state.scale),
        y: CSS.px(config.y / state.scale)
      })
    },
    resize(el) {
      const { width: createContainerWidth } = el.getBoundingClientRect()
      state.scale = (createContainerWidth - panelConfig.gap * 2) / panelConfig.width
    },
    handleDragMove(component, event) {
      component.x = event.x
      component.y = event.y
    }
  }
  const actions = {
    observerResize(el) {
      Vue.nextTick(() => mutation.resize(el))
      window.addEventListener('resize', () => mutation.resize(el))
    }
  }

  return {
    state,
    computed,
    mutation,
    actions
  }
}
const store = createStore()

export function mapComputed(computedNames) {
  return computedNames.reduce((obj, name) => {
    obj[name] = store.computed[name]
    return obj
  }, {})
}
export default store
