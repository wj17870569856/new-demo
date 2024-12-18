<template>
    <div>
        <NavHeader :active="1" ></NavHeader>
        <nuxt />
        <NavFooter></NavFooter>
    </div>
</template>
<script>
import NavHeader from '~/components/NavHeader3.vue'
import NavFooter from '~/components/NavFooter.vue'
import config from '@/config/index'
export default {
    name: 'LayoutDefault',
    components: { NavHeader, NavFooter },
    data() {
        return {
            config,
        }
    },
}
</script>
<style scoped></style>