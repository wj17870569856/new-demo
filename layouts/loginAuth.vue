<template>
  <div>
    <NavHeader></NavHeader>
    <nuxt />
  </div>
</template>
<script>
import NavHeader from '~/components/NavHeader.vue'
export default {
  name: 'LoginAuth',
  components: { NavHeader },
}
</script>
<style scoped></style>
