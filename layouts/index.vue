<template>
  <div>
    <NavHeader></NavHeader>
    <nuxt />
    <NavFooter></NavFooter>
  </div>
</template>
<script>
import NavHeader from '~/components/NavHeader.vue'
import NavFooter from '~/components/NavFooter.vue'
export default {
  name: 'indexPage',
  components: { NavHeader, NavFooter },
}
</script>
<style scoped></style>
