<template>
  <div class="msg-card">
    <div class="card-title">
      <div>{{ title }}</div>
      <div v-if="more" class="more" @click="clickMore">
        更多 <i class="el-icon-arrow-right"></i>
      </div>
    </div>
    <div class="card-body">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CardList',
  props: {
    title: {
      type: String,
      default: '标题',
    },
    more: {
      type: Boolean,
      default: true,
    },
    path: {
      type: String,
      default: '标题',
    },
  },
  methods: {
    clickMore() {
      this.$emit('clickMore')
    },
  },
}
</script>
<style lang="less" scoped>
.msg-card {
  // min-height: 244px;
  background: #ffffff;
  border: 1px solid #efefef;
  margin-bottom: 20px;
  .card-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 10px 10px 15px;
    border-bottom: 1px solid #efefef;
    font-size: 14px;
    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
    font-weight: 400;
    color: #353535;
    position: relative;
    &::before {
      content: '';
      display: block;
      width: 4px;
      height: 14px;
      background: #4186fa;
      position: absolute;
      left: 5px;
      top: 50%;
      transform: translateY(-7px);
    }
    .more {
      font-size: 12px;
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      font-weight: 400;
      color: #353535;
      cursor: pointer;
    }
  }
  .card-body {
    padding: 10px;
  }
}
</style>
