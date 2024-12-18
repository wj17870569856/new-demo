<template>
    <div>
        <NavHeader :active="2" ></NavHeader>
        <nuxt />
        <NavFooter :showTop="false"></NavFooter>
    </div>
</template>
<script>
import NavHeader from '~/components/NavHeader2.vue'
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