<template>
    <div class="Breadcrumb  col-center">
        <div class="item index" @click="nav('/')">
            <i class="el-icon-arrow-left"></i>
            <span>首页</span>
        </div>
        <div class="item" @click="nav(item.path)" :class="item.path?'link':''" v-for="(item,index) in list" :key="index">
            <i class="el-icon-arrow-right" v-if="index != 0"></i>
            {{ item.name }}
        </div>

    </div>
</template>

<script>
export default {
    name: 'breadcrumbComp',
    methods:{
        nav (path) {
            if(!path) return
            this.$router.push(path)
        }
    },  
    props: {
        list: {
            type: Array,
            default: () => []
        }
    }
}
</script>

<style scoped lang="less">
.Breadcrumb {
    padding: 30px 0 20px 0;
}
.item {
    font-size: 14px;
    color: #0A1833;
    line-height: 22px;
}
.link {
    color: #257FF8; 
    cursor: pointer;
}
.index {
    color: #257FF8;
    cursor: pointer;
    &::after {
        content: '|';
        color: #949CA9;
        margin: 0 13px;
    }
}
</style>