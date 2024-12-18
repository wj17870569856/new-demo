<template>
    <div class="empty-data-wrapper">
        <img :src="emptyData" class="empty-data" fit="fill">
        <span>暂无数据</span>
    </div>
</template>
<script>
import emptyData from "@/assets/images/empty-data.png";
export default {
    name: 'emptyData',
    data() {
        return {
            emptyData
        }
    },
}
</script>
<style scoped lang="less">
.empty-data-wrapper {
    width: 160px;
    height: 160px;
    margin: 20px auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
    font-weight: 400;
    color: #353535;
}

.empty-data {
    width: 120px;
    height: 120px;
    margin-bottom: 20px;
}
</style>