<template>
  <div>
    <NavHeader></NavHeader>
    <nuxt />
    <NavFooter :showTop="false"></NavFooter>
  </div>
</template>
<script>
import NavHeader from '~/components/NavHeader.vue'
import NavFooter from '~/components/NavFooter.vue'
export default {
  name: 'LayoutDefault',
  components: { NavHeader, NavFooter },
}
</script>
<style scoped></style>
