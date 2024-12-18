<template>
  <div class="common-title">
    <div class="title">
      <svg-icon icon-class="title_icon" /><span>{{ title }}</span>
    </div>
    <div v-show="showMore" class="more" @click="MoreHandle">
      <span>更多</span>
      <svg-icon icon-class="more_icon" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'CommonTitle',
  props: {
    showMore: {
      type: Boolean,
      defalut: true,
    },
    title: {
      type: String,
      defalut: '标题',
    },
  },
  data() {
    return {}
  },
  methods: {
    MoreHandle() {
      if (this.showMore) {
        this.$emit('ClickMore')
      }
    },
  },
}
</script>
<style lang="less" scoped>
// 通用标题样式块
.common-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: Microsoft YaHei, Microsoft YaHei-Bold;
  padding: 10px 0;
  .title {
    font-size: 18px;
    font-weight: 700;
    color: #353535;
  }
  .more {
    font-size: 12px;
    color: #353535;
    height: 20px;
    width: 100px;
    line-height: 20px;
    text-align: right;
    &:hover {
      color: #2263e8;
      cursor: pointer;
    }
  }
}
</style>
