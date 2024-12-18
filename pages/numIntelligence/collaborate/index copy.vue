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
        <div class="collaborate-left">
          <div class="collaborate-title"> <div>数据统计分析</div> </div>
          <div class="collaborate-flex">
            <div class="felx-left">
              <div class="enterprise">
                <div class="enterprise-box">
                  <div class="enterprise-num">352</div>
                  <div class="enterprise-text">高校合作</div>
                </div>
              </div>
              <div class="enterprise">
                <div class="enterprise-box">
                  <div class="enterprise-num">158</div>
                  <div class="enterprise-text">创新示范企业</div>
                </div>
              </div>
              <div class="enterprise">
                <div class="enterprise-box">
                  <div class="enterprise-num">465</div>
                  <div class="enterprise-text">技术研究 （研发中心）</div>
                </div>
              </div>
            </div>
            <div class="flex-center">
              <div class="triangle">高校区域分布</div>
              <div class="echarts">
                <EchartsPie
                  chartId="pie1"
                  :chartOption="chartOption"
                  style="width: 100%; height: 100%"
                />
              </div>
            </div>
            <div class="flex-right">
              <div class="triangle">技术研究（研发）中心和创新示范企业</div>
              <div class="echarts">
                <EchartsPie
                  chartId="pie2"
                  :chartOption="chartOption2"
                  style="width: 100%; height: 100%"
                />
              </div>
            </div>
          </div>

          <div class="collaborate-bottom">
            <!-- <div></div> -->
            <div class="table-cus " >
              <div class="collaborate-title margin-bottom">
                <div>技术研究（研发）中心</div>
                
              </div>
              <div class="table-flex">
                <div class="table-item">创新示范企业</div>
                <div class="table-item">标签名称</div>
              </div>
              <div class="scroll" v-scrollList="6000">
              <div class="table-flex"  v-for="(item, index) in studyList"
              :key="index">
                <div class="table-item text-cut" :title="item.name">{{ item.name }}</div>
                <div class="table-item text-cut" :title="item.name">{{item.label}}</div>
              </div>
            </div>
            </div>

            <div class="table-cus">
              <div class="collaborate-title margin-bottom"><div>创新示范企业</div> </div>
              <div class="table-flex">
                <div class="table-item">创新示范企业</div>
                <div class="table-item">标签名称</div>
              </div>
              <div class="table-flex"  v-for="(item, index) in jsonInfo.demonstrationList"
              :key="index">
                <div class="table-item text-cut" :title="item.name">{{ item.name }}</div>
                <div class="table-item text-cut" :title="item.label">{{item.label}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="collaborate-right">
          <div class="collaborate-title"><div>产业图谱</div></div>
          <img
            src="../../../assets/images/numIntelligence/industry.png"
            alt=""
            class="margin-bottom-sm tab"
          />
          <div class="collaborate-title margin-bottom-xxl"><div>高校合作</div> </div>

          <div class="flex-around">
            <div class="bottom-img">
              <img
                src="../../../assets/images/numIntelligence/icon38.png"
                alt=""
              />
              <div class="bottom-text">赣南师范大学家居现代产业学院</div>
            </div>
            <div class="bottom-img">
              <img
                src="../../../assets/images/numIntelligence/icon39.png"
                alt=""
              />
              <div class="bottom-text">赣南科技学院</div>
            </div>
            <!-- <div class="bottom-img">
              <img
                src="../../../assets/images/numIntelligence/icon40.png"
                alt=""
              />
              <div class="bottom-text">武汉纺织大学</div>
            </div>
            <div class="bottom-img">
              <img
                src="../../../assets/images/numIntelligence/icon41.png"
                alt=""
              />
              <div class="bottom-text">苏州大学</div>
            </div> -->
          </div>
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
import scrollList from "../components/scrollList.js";
export default {
  layout: "intelligence",
  components: {
    EchartsPie,
  },
  data() {
    return {
      jsonInfo:all,
      studyList:study,
      tabList: [
        { label: "规模实力", value: 0, url: "/scaleStrength" },
        { label: "技术创新", value: 1, url: "/technology" },
        { label: "发展生态", value: 2, url: "/developEcology" },
        { label: "产业协作", value: 3, url: "/collaborate" },
        { label: "组织保障", value: 4, url: "/organization" },
      ],

      activeTab: 3,
      tableData: [],
      industryList: [],
      page: 1,
      pageSize: 20,

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
  mounted() {
    this.setRem(); // 初始化

    window.onresize = function () {
      this.setRem();
    };
  },
  methods: {
    bindTab(url) {
      this.$router.push("/numIntelligence" + url);
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
};
</script>

<style lang="less" scoped>
.numIntelligence-bg {
  width: 100vw;
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
    div{
      display: inline-block;
      // padding: 0 10px;
      background: rgba(5, 13, 26, .6);
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
.flex-around{
  display: flex;
  justify-content: space-around;
}
.collaborate-left {
  width: 57%;
  // width: 68.75rem;
  height: 26.375rem;
  padding-top: 1.25rem;

  .collaborate-flex {
    display: flex;
    padding: 0 0.625rem;
    margin-bottom: 2.5rem;
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
    display: flex;
    justify-content: space-between;
    .table-cus {
      // width: 33.75rem;
      flex: 1;
   
    
      padding: 0 0.625rem;
      box-sizing: border-box;
     
      .scroll{
        height:15rem;
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
    width:10.375rem;
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
  margin-bottom: 5.625rem!important;
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

.amap-info-window{
  width: 300px;
  line-height: 35px;
  background: #fff;
  color: aqua;
  text-align: center;;
}
</style>
