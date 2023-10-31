<template>
  <div class="layout">
    <div class="left"><slot name="left" /></div>
    <div class="middle">
      <slot />
    </div>
    <div class="right">
      <slot name="right" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.layout {
  display: flex;
  height: 100vh;
  .left,.right {
    width: 300px;
  }
  .middle {
    flex: 1;
  }
}
</style>
