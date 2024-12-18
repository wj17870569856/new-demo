<template>
  <div class="screen-header">
    <div class="screen-title" @click="$router.push('/numIntelligence/ecology')">
      产业数据平台
    </div>
    <div class="screen-shadow">产业数据平台</div>
    <div class="screen-box">
      <div class="left">
        <template v-for="(item, index) in list">
          <div
            class="screen-tab text-cut"
            :class="activeTab == item.id ? 'active' : ''"
            v-if="index < 3"
            @click="bindTab(item.id)"
          >
            {{ item.name }}
          </div>
        </template>
      </div>
      <div class="right">
        <template v-for="(item, index) in list">
          <div
            class="screen-tab text-cut"
            :class="activeTab == item.id ? 'active' : ''"
            v-if="index >= 3"
            @click="bindTab(item.id)"
          >
            {{ item.name }}
          </div>
        </template>
      </div>
    </div>
    <div class="screen-left">
      <!--      <div class="time">00:00</div>-->
      <!--      <div class="date">2024-12-7 星期三</div>-->
      <!--      <div class="cloud">-->
      <!--        多云9~21℃-->
      <!--        <img src="../assets/images/numIntelligence/cloud.png" alt="" />-->
      <!--      </div>-->
      <div class="flex-center" @click="$router.push('/')">
        <img
          src="@/assets/images/icon_back.png"
          style="cursor: pointer; width: 46px; height: 46px"
        />
        <span>返回</span>
      </div>
    </div>
  </div>
</template>

<script>
import Api from "@/plugins/api";
import postcssPluginPx2rem from "postcss-plugin-px2rem";

const px2remOptions = {
  rootValue: 16, //换算基数
  unitPrecision: 5,
  propList: ["*"],
  mediaQuery: false, //（布尔值）允许在媒体查询中转换px
  minPixelValue: 0, //设置要替换的最小像素值 默认 0
};

export default {
  name: "NumHeader",
  postcss: function (webpack) {
    return [postcssPluginPx2rem(px2remOptions)];
  },
  data() {
    return {
      tabHeaderList: [
        // { label: "现代家居", value: "0" },
        // { label: "有色金属和新材料", value: "1" },
        // { label: "电子信息", value: "2" },
        // { label: "新能源和新能源汽车", value: "3" },
        // { label: "纺织服装", value: "4" },
        // { label: "绿色食品", value: "5" },
        // { label: "生物医药", value: "6" },
      ],
      list: [],
      activeTab: 0,
    };
  },

  methods: {
    bindTab(val) {
      this.activeTab = val;
      let obj=this.list.filter(item=>item.id==val)
      this.$store.commit('updateNumTab', obj[0]);
      console.log(333,this.$route.path)
      if(this.$route.path=='/numIntelligence/ecology'){
        this.$router.push("/numIntelligence/scaleStrength");
      }

    },
    setRem() {
      // 以1920分辨率为基准，将视口分为120份，每一份为16px，即1rem=16px
      const screenWidth = 1920;
      const scale = screenWidth / 16;
      const htmlWidth =
        document.documentElement.clientWidth || document.body.clientWidth;
      const htmlDom = document.getElementsByTagName("html")[0];
      // 设置根元素字体大小
      htmlDom.style.fontSize = htmlWidth / scale + "px";
    },
  },
  mounted() {
    this.setRem(); // 初始化
    window.onresize = () => {
      this.setRem();
    };

    this.$request
      .get(Api.getOptionsNew, {
        params: {},
      })
      .then((res) => {
        if (res.code === 0) {
        this.list = res.data;
        this.activeTab = res.data[0]?.id;
        }
      });
  },
};
</script>

<style scoped lang="less">
.screen-header {
  width: 100vw;
  height: 5.625rem;
  background: #111b34 url("../assets/images/numIntelligence/header.png")
    no-repeat 0 0;
  background-size: 100% 100%;
  position: relative;
  padding-top: 3.125rem;
  box-sizing: border-box;
}

.screen-title {
  cursor: pointer;
  letter-spacing: 0.2rem;
  font-size: 2.75rem;
  text-align: center;
  font-weight: bold;
  background-image: linear-gradient(
    to top,
    #e4f2ff 0%,
    #2daeef 62%,
    #e4f2ff 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
  z-index: 1;
}

.screen-shadow {
  cursor: pointer;
  color: #2daeef;
  letter-spacing: 0.2rem;
  font-size: 2.75rem;
  font-weight: bold;
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
  z-index: 0;
  text-shadow: 5px 0px 10px #17498b;
}

.screen-tab {
  width: 9.0625rem;
  height: 2.125rem;
  background: url("../assets/images/numIntelligence/tab2.png") no-repeat 0 0;
  background-size: 100% 100%;
  text-align: center;
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  padding: 0 3px;
  box-sizing: border-box;
  margin-right: 5px;
  cursor: pointer;
}
.screen-tab.active {
  background: url("../assets/images/numIntelligence/tab1.png") no-repeat 0 0;
  background-size: 100% 100%;
}
.screen-box {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.screen-box > div.left {
  width: 28.125rem;
  padding-left: 9.5rem;
}
.screen-box > div {
  width: 37.75rem;
  display: flex;
  align-items: center;
  /* justify-content: space-between; */
}
.screen-left {
  width: 8.125rem;
  height: 5.625rem;
  position: absolute;
  left: 1.25rem;
  top: 0.5rem;
  display: flex;
  align-items: center;
}
.screen-left .time {
  font-weight: 400;
  font-size: 1.375rem;
  color: #ffffff;
  line-height: 1.625rem;
  text-shadow: 0px 0px 6px #dde7f3;
}
.screen-left .date {
  font-weight: 400;
  font-size: 0.875rem;
  color: #c3d3e2;
}
.screen-left .cloud {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 400;
  font-size: 0.875rem;
  color: #ffffff;
}
.screen-left .cloud img {
  width: 1.5rem;
}

.text-cut {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.flex-center {
  width: 100px;
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 12px;
}
</style>
