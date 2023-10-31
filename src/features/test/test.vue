<template>
  <img
    :style="{width: width + 'px', height: height + 'px'}"
    src="https://img0.baidu.com/it/u=1226012578,3631571194&fm=253&fmt=auto&app=120&f=JPEG?w=1200&h=800"
    alt=""
  >
</template>

<script>
export default {
  props: {
    width: {
      type: Number,
      default: 100
    },
    height: {
      type: Number,
      default: 100
    }
  }
}
</script>
