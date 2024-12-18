<template>
  <div style="height: 100%">
    <NavHeader></NavHeader>
    <nuxt />
  </div>
</template>
<script>
import NavHeader from '~/components/NavHeader.vue'
export default {
  name: 'RegisterLayout',
  components: { NavHeader },
}
</script>
<style scoped></style>
