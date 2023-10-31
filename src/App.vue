<script>
import Layout from './components/layout.vue'
import leftSide from './components/leftSide.vue'
import rightSide from './components/rightSide.vue'
import created from './components/created.vue'
export default {
  components: {
    Layout,
    leftSide,
    rightSide,
    created
  }
}
</script>
<template>
  <Layout>
    <template slot="left">
      <leftSide to="project" />
    </template>
    <created />
    <template slot="right">
      <rightSide />
    </template>
  </Layout>
</template>
<style>
*{
  padding: 0;
  margin: 0;
}
</style>
