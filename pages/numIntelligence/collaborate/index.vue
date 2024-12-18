<template>
  <div class="numIntelligence-bg">
    <div class="classify">
      <div
        :class="index == activeTab ? 'active' : ''"
        class="classify-item"
        v-for="(item, index) in tabList"
        :key="index"
        @click="bindTab(item.url)"
      >
        {{ item.label }}
      </div>
    </div>

    <div class="content">
      <div class="flex-between">
        <div class="collaborate-right">
          <div class="collaborate-title">
            <div>产业图谱</div>
          </div>

          <img
            src="../../../assets/images/numIntelligence/industry1.png"
            alt=""
            class="margin-bottom-sm tab"
            v-if="industry.name == '现代家居'"
          />
          <img
            src="../../../assets/images/numIntelligence/industry2.png"
            alt=""
            class="margin-bottom-sm tab"
            v-if="industry.name == '生物医药'"
          />
          <img
            src="../../../assets/images/numIntelligence/industry3.png"
            alt=""
            class="margin-bottom-sm tab"
            v-if="industry.name == '有色金属和新材料'"
          />
          <img
            src="../../../assets/images/numIntelligence/industry4.png"
            alt=""
            class="margin-bottom-sm tab"
            v-if="industry.name == '新能源和新能源汽车'"
          />
          <img
            src="../../../assets/images/numIntelligence/industry5.png"
            alt=""
            class="margin-bottom-sm tab"
            v-if="industry.name == '纺织服装'"
          />
          <img
            src="../../../assets/images/numIntelligence/industry6.png"
            alt=""
            class="margin-bottom-sm tab"
            v-if="industry.name == '绿色食品'"
          />
          <img
            src="../../../assets/images/numIntelligence/industry7.png"
            alt=""
            class="margin-bottom-sm tab"
            v-if="industry.name == '电子信息'"
          />

          <div class="flex-around">
            <div class="item-around">
              <div class="title">上游</div>
              <div class="item-list scroll" v-scrollList="6000">
                <div
                  class="item-tag"
                  v-for="(item, index) in industryJson[typeName].up"
                  :key="index"
                >
                  {{ item }}
                </div>
              </div>
            </div>
            <div class="item-around">
              <div class="title">中游</div>
              <div class="item-list scroll" v-scrollList="6000">
                <div
                  class="item-tag"
                  v-for="(item, index) in industryJson[typeName].center"
                  :key="index"
                >
                  {{ item }}
                </div>
              </div>
            </div>
            <div class="item-around">
              <div class="title">下游</div>
              <div class="item-list scroll" v-scrollList="6000">
                <div
                  class="item-tag"
                  v-for="(item, index) in industryJson[typeName].down"
                  :key="index"
                >
                  {{ item }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="collaborate-left">
          <div class="collaborate-title">
            <div>供需协同</div>
          </div>
          <div class="collaborate-flex">
            <el-form :inline="true" :model="form" class="demo-form-inline">
              <el-form-item label="求购商品：">
                <el-input
                  class="input"
                  v-model="form.name"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
              <el-form-item label="等级：">
                <el-select
                  v-model="form.region"
                  placeholder="活动区域"
                  class="cus-select"
                >
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="意向价格：">
                <el-input
                  class="input"
                  v-model="form.price"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
              <el-form-item label="产地：">
                <el-input
                  class="input"
                  v-model="form.address"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">搜索</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="collaborate-ul">
            <div class="flex">
              <div class="list active">全部</div>
              <div class="list">时间</div>
              <div class="list">价格</div>
            </div>

            <div class="text">
              共 <span class="num">{{ supplyList.length }}</span> 件相关商品
            </div>
          </div>
          <div
            class="scroll"
            v-scrollList="6000"
            style="height: 42.8rem; margin-bottom: 10px"
          >
            <div
              class="scroll-list"
              v-for="(item, index) in supplyList"
              :key="index"
            >
              <div class="flex-bettow">
                <div class="title flex">
                  {{ item.name }}
                  <div class="tag">求购中</div>
                </div>
                <div class="text-red">意向价格：{{ item.price }}</div>
              </div>
              <div class="flex">
                <div class="label">时间</div>
                <div class="text-red">{{ item.time }}</div>
              </div>
              <div class="flex">
                <div class="label">规格</div>
                <div>{{ item.unit }}</div>
              </div>
              <div class="flex">
                <div class="label">交货地</div>
                <div>{{ item.level }}</div>
              </div>
              <div class="nav">我要供货</div>
            </div>
          </div>

          <!-- <div class="collaborate-bottom"> -->
            <!-- <div class="collaborate-title">
              <div>创新协同</div>
            </div>

            <div class="text-align:center">
              <el-empty></el-empty>
            </div> -->
          <!-- </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Api from "@/plugins/api";
import EchartsPie from "../components/echarts-pie.vue";
import all from "../../../assets/json/modern/all.json";
import study from "../../../assets/json/modern/study.json";
import industryJson from "../../../assets/json/industry.json";
import supplyJson from "../../../assets/json/supply.json";
import scrollList from "../components/scrollList.js";
import { mapState } from "vuex";
export default {
  layout: "intelligence",
  components: {
    EchartsPie,
  },
  data() {
    return {
      jsonInfo: all,
      studyList: study,
      industryJson,
      supplyJson,
      tabList: [
        { label: "规模实力", value: 0, url: "/scaleStrength" },
        { label: "技术创新", value: 1, url: "/technology" },
        { label: "发展生态", value: 2, url: "/developEcology" },
        { label: "产业协作", value: 3, url: "/collaborate" },
        { label: "组织保障", value: 4, url: "/organization" },
      ],
      industry: { name: "现代家居" },
      activeTab: 3,
      tableData: [],
      industryList: [],
      supplyList: [],
      page: 1,
      pageSize: 20,
      form: { name: "", region: "", price: "", address: "" },
      typeName: "modern",
      chartOption: {
        label: true,
        center: ["50%", "45%"],
        radius: ["30%", "53%"],
        data: [
          {
            name: "省份1",
            value: 10,
          },
          {
            name: "省份2",
            value: 10,
          },
          {
            name: "省份3",
            value: 10,
          },
          {
            name: "省份4",
            value: 10,
          },
        ],
      },
      chartOption2: {
        label: false,
        center: ["50%", "30%"],
        radius: [0, 50],
        data: [
          {
            name: "省级技术创新示范企 15%",
            value: 30,
          },
          {
            name: "历史国家级技术创新示范企业 15%",
            value: 50,
          },
          {
            name: "历史省级技术创新示范企业 15%",
            value: 30,
          },
          {
            name: "省级工程技术研究中心 15%",
            value: 50,
          },
        ],
      },
    };
  },
  directives: {
    scrollList: scrollList,
  },
  computed: {
    ...mapState(["numTab"]),
  },
  watch: {
    numTab: {
      handler(newValue, oldValue) {
        if (newValue.name) {
          this.industry = newValue;
          this.typeName =
            newValue.name == "现代家居"
              ? "modern"
              : newValue.name == "有色金属和新材料"
              ? "material"
              : newValue.name == "电子信息"
              ? "electronic"
              : newValue.name == "新能源和新能源汽车"
              ? "energy"
              : newValue.name == "纺织服装"
              ? "spinning"
              : newValue.name == "生物医药"
              ? "organism"
              : newValue.name == "绿色食品"
              ? "green"
              : "modern";
          let name = newValue.name ? newValue.name : "现代家居";
          this.supplyList = this.supplyJson.filter((item) => item.type == name);
        }
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    this.setRem(); // 初始化
    window.onresize = function () {
      this.setRem();
    };
    this.supplyList = this.supplyJson.filter((item) => item.type == "现代家居");
  },

  methods: {
    bindTab(url) {
      this.$router.push("/numIntelligence" + url);
    },
    onSubmit() {},
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
};
</script>

<style lang="less" scoped>
.numIntelligence-bg {
  width: 100vw;
  height: calc(100vh - 5.725rem);
  background: #030913;
}
.classify {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 0 1.25rem;
  margin: 0 auto;
  cursor: pointer;
  .classify-item {
    width: 8.5625rem;
    line-height: 2.8125rem;
    text-align: center;
    color: #c3d3e2;
    font-size: 1.25rem;
    background: linear-gradient(
      90deg,
      rgba(0, 25, 52, 0) 0%,
      #001934 50%,
      rgba(0, 25, 52, 0) 100%
    );
    margin-right: 1rem;
  }
  .classify-item.active {
    background: #030913 url("../../../assets/images/numIntelligence/tab3.png")
      no-repeat 0 0;
    background-size: 100% 100%;
  }
}
.content {
  width: 99%;
  height: 55.8125rem;
  margin: 0 auto;
  background: url("../../../assets/images/numIntelligence/bg.png") no-repeat 0 0;
  background-size: 100% 100%;
  padding: 0.625rem;
  box-sizing: border-box;
  text-align: center;
  .collaborate-title {
    font-size: 1.25rem;
    color: #fff;
    padding-left: 5.625rem;
    line-height: 2rem;
    background: url(../../../assets/images/numIntelligence/tab4.png) no-repeat 0
      0;
    background-size: 100% 100%;
    margin-bottom: 0.625rem;
    text-align: left;
    box-sizing: border-box;
    div {
      display: inline-block;
      padding: 0 1rem;
      background: url(../../../assets/images/numIntelligence/tab9.png) no-repeat 0
      0;
    background-size: 100% 100%;
      line-height: 2rem;
      color: #fff;
    }
  }
}
.triangle {
  font-weight: 500;
  font-size: 1.125rem;
  color: #ffffff;
  line-height: 1.3125rem;
  position: relative;
  padding-left: 2rem;
  text-align: left;
}
.triangle::before {
  content: "";
  display: block;
  width: 0;
  height: 0;
  border-left: 0.7rem solid #257ff8;
  border-top: 0.7rem solid transparent;
  border-bottom: 0.7rem solid transparent;
  position: absolute;
  left: 0;
}
.flex-between {
  display: flex;
  // align-items: center;
  justify-content: space-between;
}
.flex-around {
  display: flex;
  justify-content: space-around;
  .item-around {
    flex: 1;
    .title {
      font-family: YouSheBiaoTiYuan, YouSheBiaoTiYuan;
      font-weight: 400;
      font-size: 2rem;
      color: #0763ee;
      line-height: 3.125rem;
    }
    .item-list {
      height: 20.625rem;

      margin: 0 1rem;
      background: rgba(7, 99, 238, 0.1);
      border-radius: 0px 0px 0px 0px;
      border: 2px solid rgba(7, 99, 238, 0.5);
      padding: 1rem;
      box-sizing: border-box;
      .item-tag {
        line-height: 4.1875rem;
        height: 4.1875rem;
        font-weight: 500;
        font-size: 1.5rem;
        color: #ffffff;
        text-align: center;
        background: url(../../../assets/images/numIntelligence/icon54.png)
          no-repeat 0 0;
        background-size: 100% 100%;
        margin-bottom: 12px;
      }
    }
  }
}
.collaborate-left {
  width: 57%;
  // width: 68.75rem;
  height: 26.375rem;
  padding-top: 1.25rem;

  .collaborate-flex {
    display: flex;
    padding: 0 0.625rem;
    // margin-bottom: 2.5rem;
    .felx-left {
      height: 22.125rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-right: 1.875rem;
    }
    .enterprise {
      width: 6.25rem;
      height: 5.875rem;
      position: relative;
      background: url(../../../assets/images/numIntelligence/icon37.png)
        no-repeat 0 bottom;
      background-size: 100% auto;
      &::before {
        content: "";
        display: block;
        width: 100%;
        height: 100%;
        position: absolute;
        background: url(../../../assets/images/numIntelligence/icon36.png)
          no-repeat center top;
        background-size: 3.75rem auto;
      }
      .enterprise-box {
        position: absolute;
        z-index: 1;
        width: 6.25rem;
        height: 5.875rem;
        top: 0;
        left: 0;
        .enterprise-num {
          font-weight: 600;
          font-size: 1.75rem;
          color: #ffffff;
          line-height: 2.0625rem;
          margin-bottom: 1rem;
          text-shadow: 0px 0px 8px #0073ff;
        }
        .enterprise-text {
          color: #fff;
          font-size: 1rem;
          text-align: center;
        }
      }
    }
    .flex-center {
      width: 26.0625rem;
      height: 20.625rem;
      background: url(../../../assets/images/numIntelligence/bg11.png) no-repeat
        center center;
      background-size: 17.625rem 17.625rem;
      margin-right: 2rem;
      .echarts {
        width: 100%;
        height: 100%;
      }
    }
    .flex-right {
      flex: 1;
      height: 20.625rem;

      .echarts {
        width: 100%;
        height: 100%;
      }
    }
  }
  .collaborate-bottom {
    // display: flex;
    // justify-content: space-between;
    .collaborate-title {
      flex: 1;
    }
    .table-cus {
      // width: 33.75rem;
      flex: 1;

      padding: 0 0.625rem;
      box-sizing: border-box;

      .scroll {
        height: 15rem;
        overflow-y: auto;
      }
      .table-flex {
        display: flex;
        align-items: center;
        color: #b5c9db;
        line-height: 3.125rem;
        margin-bottom: 0.625rem;
        padding: 0 1.25rem;
        background: url(../../../assets/images/numIntelligence/content1.png)
          no-repeat 0 bottom;
        background-size: 100% 100%;
        div {
          flex: 1;
          flex-shrink: 0;
          text-align: left;
        }
      }
      .table-flex:nth-child(2n) {
        background: url(../../../assets/images/numIntelligence/content2.png)
          no-repeat 0 bottom;
        background-size: 100% 100%;
      }
    }
  }
}
.collaborate-right {
  // width: 48.75rem;
  // flex: 1;
  width: 40%;
  padding-top: 1.25rem;
  img.tab {
    width: 100%;
  }
  .bottom-img {
    // flex: 1;
    width: 10.375rem;
    margin-right: 2rem;
    color: #fff;
    text-align: center;
    font-size: 1.25rem;
    img {
      width: 100%;
      margin-bottom: 1rem;
    }
  }
}

.text-cut {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.margin-bottom {
  margin-bottom: 1.25rem;
}
.margin-bottom-sm {
  margin-bottom: 0.5rem;
}
.margin-bottom-xxl {
  margin-bottom: 5.625rem !important;
}

.text-two {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.text-cut {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.scroll {
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background-color: #303b4a;
  }

  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    background-color: #263648;
  }
}
.flex {
  display: flex;
}
.flex-bettow {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.amap-info-window {
  width: 300px;
  line-height: 35px;
  background: #fff;
  color: aqua;
  text-align: center;
}
.collaborate-ul {
  padding-right: 8px;
  height: 2.375rem;
  background: #0f2c50;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  .list {
    width: 4.375rem;
    line-height: 2.375rem;

    text-align: center;
    color: #fff;
    font-size: 0.875rem;
    &.active {
      background: url(../../../assets/images/numIntelligence/icon46.png)
        no-repeat 0 0;
      background-size: 100% 100%;
    }
  }
  .text {
    color: #43546f !important;
    .num {
      color: #257ff8;
      padding: 0 5px;
    }
  }
}
.scroll-list {
  height: 6.875rem;
  padding: 0.2rem 0.9375rem;
  font-weight: 400;
  font-size: 0.875rem;
  color: #99afcc;
  line-height: 1.8;
  position: relative;
  box-sizing: border-box;
  background: #164063;
  margin-top: 10px;
  .title {
    font-weight: bold;
    font-size: 1.125rem;
    color: #fff;
    display: flex;
    align-items: center;
  }
  .tag {
    width: 3.125rem;
    line-height: 1.375rem;
    height: 1.375rem;
    background: url(../../../assets/images/numIntelligence/icon54.png) no-repeat
      0 0;
    background-size: 100% 100%;
    color: #26fdf0;
    font-size: 12px;
    text-align: center;
    margin-left: 6px;
  }
  .text-red {
    color: #ff2618 !important;
  }
  .nav {
    width: 5rem;
    height: 2.25rem;
    line-height: 2.25rem;
    background: url(../../../assets/images/numIntelligence/icon55.png) no-repeat
      0 0;
    background-size: 100% 100%;
    color: #257ff8;
    font-size: 0.875rem;
    position: absolute;
    right: 1rem;
    bottom: 10px;
  }
  .label {
    width: 5rem;
    text-align: left;
  }
}
</style>

<style>
.cus-select .el-input__inner {
  width: 9.375rem;
  height: 2.25rem;
  background: #021523 !important;
  border: 1px solid #2ca6ff;
}
.input .el-input__inner {
  width: 9.375rem;
  height: 2.25rem;
  background: #021523 !important;
  border: 1px solid #2ca6ff;
}
</style>
