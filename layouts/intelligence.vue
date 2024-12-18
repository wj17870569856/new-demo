<template>
    <div>
        <NumHeader ></NumHeader>
        <nuxt />
    </div>
</template>
<script>

import NumHeader from '~/components/NumHeader.vue'
import config from '@/config/index'
export default {
    name: 'LayoutDefault',
    components: { NumHeader },
    data() {
        return {
            config,
        }
    },
 
    
}
</script>
<style scoped>

</style>