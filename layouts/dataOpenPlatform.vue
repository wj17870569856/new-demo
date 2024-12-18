<template>
  <div>
    <div class="navHeader">
      <div class="logo" @click="$router.push('/')">
        <el-image style="height:36px" :src="require('../assets/imgs/logo2.png')"></el-image>
      </div>
    
      <div class="tab-item" @click="$router.push(item.path)" :class=" $route.fullPath === item.path?'active':''" v-for="(item,index) in tabs" :key="index">
        <el-image
          style="width:18px;height:18px;"
          :src="require(`../assets/imgs/cgbox${$route.fullPath === item.path?index+1:(index+1)+'-'+(index+1)}.png`)"
        ></el-image>
        <span class="name">{{ item.name }}</span>
      </div>
    </div>
    <nuxt />
  </div>
</template>
  <script>
export default {
  name: "LayoutDefault",
  data() {
    return {
      tabs: [
        {
          name: "产业通用模型",
          path: "/dataOpenPlatform",
        },
        // {
        //   name: "安全测试模型",
        //   path: "/tradingFloor?id=9",
        // },
        {
          name: "现代家居",
          path: "/tradingFloor?id=0",
        },
        {
          name: "石化化工",
          path: "/tradingFloor?id=2",
        },
        {
          name: "铜基新材",
          path: "/tradingFloor?id=5",
        },
        {
          name: "食品产业",
          path: "/tradingFloor?id=6",
        },
        {
          name: "稀土有色",
          path: "/tradingFloor?id=3",
        },
        {
          name: "玩具产业",
          path: "/tradingFloor?id=7",
        },
        {
          name: "生态环保",
          path: "/tradingFloor?id=8",
        },
      ],
    };
  },
};
</script>
<style lang="less" scoped>
.logo {
  margin-left: 30px;
  cursor: pointer;
  margin-right: 50px;
}
.navHeader {
  width: 1920px;
  min-width: 1300px;
  height: 80px;
  position: absolute;
  top: 0;
  display: flex;
  align-items: center;
  z-index: 99999;
  left: 0;
  right: 0;
  background: #fff;
  border-radius: 0px 0px 0px 0px;
  display: flex;
  background-image: url(../assets/imgs/dataOpenPlatform_header_bg.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .tab-item {
    padding: 0 20px;
    display: flex;
    cursor: pointer;
    height: 50px;
    margin-right: 30px;
    align-items: center;
    border-radius: 5px 5px 5px 5px;
    &.active {
background: linear-gradient( 270deg, #E7EEF8 0%, #C1D9F8 100%);


font-weight: bold;
font-size: 18px;
color: #257FF8;
line-height: 21px;

    }
    .name {
      margin-left: 10px;
    }
  }
}
</style>

  