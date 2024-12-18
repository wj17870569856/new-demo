<template>
  <div class="deveop-container numIntelligence-bg">
    <div class="container-main">
      <div class="classify">
        <div :class="index == activeTab ? 'active' : ''" class="classify-item" v-for="(item, index) in tabList" :key="index" @click="bindTab(item.url)">
          {{ item.label }}
        </div>
      </div>
      <div class="container-left">
        <div class="container-left-content">
          <div class="content-box">
            <div class="content-box-title">
              <div class="content-box-title-text">人才要素集聚发展</div>
            </div>
            <div class="content-box-list" style="height: 40.625rem">
              <div class="content-box-company">
                <div class="company-header">
                  <div class="company-header-text">姓名</div>
                  <div class="company-header-text">工作单位</div>
                  <div class="company-header-text">人才层次</div>
                </div>
                <div class="scroll" style="height: 37.5rem; overflow-y: auto" v-scrollList="6000">
                  <div class="company-item" v-for="(item, index) in talent" :key="index" @click="bindChangeTalent(item)">
                    <div class="company-item-text" :title="item.name">
                      {{ item.talent_name }}
                    </div>
                    <div class="company-item-text text-two" :title="item.company_name">
                      {{ item.company_name }}
                    </div>
                    <div class="company-item-text">{{ item.rank }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="content-middle">
            <div class="content-box">
              <div class="content-box-title">
                <div class="content-box-title-text">人才机构分布</div>
              </div>
              <div class="echarts">
                <EchartsPie chartId="pie1" :chartOption="chartOptionPie" />
              </div>
              <!-- <div class="content-box-list">
                <div class="content-box-image">
                  <div class="content-box-image-box">
                    <div class="image-box-item2">
                      <div class="text1">100</div>
                      <div class="text2">（亿元）</div>
                      <div class="text3">投资引导资金</div>
                    </div>
                    <div class="image-box-item2">
                      <div class="text1">150</div>
                      <div class="text2">（亿元）</div>
                      <div class="text3">现代产业引导基金</div>
                    </div>
                    <div class="image-box-item2">
                      <div class="text1">170</div>
                      <div class="text2">（个）</div>
                      <div class="text3">金融产品</div>
                    </div>
                    <div class="image-box-item2">
                      <div class="text1">300</div>
                      <div class="text2">（亿元）</div>
                      <div class="text3">累计放贷</div>
                    </div>
                  </div>
                </div>
              </div> -->
            </div>
          </div>
        </div>
      </div>
      <div class="container-middle">
        <div class="middle-tips">
          <div class="text-white">人才总数</div>
          <!-- 189673 -->
          <div class="text-num"> {{ industry.name == "现代家居"
                      ? 5289
                      : industry.name == "生物医药"
                      ? 2956
                      : industry.name == "有色金属和新材料"
                      ? 4986
                      : industry.name == "新能源和新能源汽车"
                      ? 3956
                      : industry.name == "纺织服装"
                      ? 3675
                      : industry.name == "绿色食品"
                      ? 3684
                      : industry.name == "电子信息"
                      ? 4052
                      : 5289
                  }} <span class="text-unit">个</span></div>
        </div>
        <div class="map">
          <echartMap width="65.3125rem" height="47.8125rem" chartId="map10" :chartOption="chartOption" v-if="isMap" :type="0" />
        </div>
        <div class="echarts-img">
          <div class="img" @click="bindChangeRegion('全国')">
            <img :src="
                region == '全国'
                  ? require('../../../assets/images/numIntelligence/icon47.png')
                  : require('../../../assets/images/numIntelligence/icon50.png')
              " alt="" />
          </div>
          <div class="img" @click="bindChangeRegion('江西省')">
            <img :src="
                region == '江西省'
                  ? require('../../../assets/images/numIntelligence/icon48.png')
                  : require('../../../assets/images/numIntelligence/icon51.png')
              " alt="" />
          </div>
          <div class="img" @click="bindChangeRegion('赣州市')">
            <img :src="
                region == '赣州市'
                  ? require('../../../assets/images/numIntelligence/icon49.png')
                  : require('../../../assets/images/numIntelligence/icon52.png')
              " alt="" />
          </div>
        </div>
      </div>
      <div class="container-right">
        <div class="container-right-content">
          <div class="content-box">
            <div class="content-box-title">
              <div class="content-box-title-text">促进组织</div>
            </div>
            <div class="content-box-list right-top" style="height: 11rem">
              <div class="content-box-company scroll" style="height: 11rem" v-scrollList="5">
                <div class="company-item" style="height: 3.125rem" v-for="(item, index) in promoteList" :key="index">
                  <div class="company-item-text-right">{{ item.name }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="content-box">
            <div class="content-box-title">
              <div class="content-box-title-text">公共服务平台建设</div>
            </div>
            <div class="content-box-list" style="height: 16.4375rem">
              <div class="content-box-company serve">
                <div class="company-header">
                  <div class="company-header-text">类别</div>
                  <div class="company-header-text">国家级</div>
                  <div class="company-header-text">省级</div>
                  <div class="company-header-text">合计</div>
                </div>

                <div class="scroll" style="height: 13.5rem; overflow-y: auto">
                  <div class="company-item" v-for="(item, index) in serviceList" :key="index">
                    <div class="company-item-text text-cut">
                      {{ item.classify }}
                    </div>
                    <div class="company-item-text">{{ item.country }}</div>
                    <div class="company-item-text text-cut">
                      {{ item.province }}
                    </div>
                    <div class="company-item-text">{{ item.total }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="content-box">
            <div class="content-box-title">
              <div class="content-box-title-text">产业要素配套齐全</div>
            </div>
            <div class="content-box-list" style="height: 23.9375rem">
              <div class="content-box-company all">
                <div class="company-header">
                  <div class="company-header-text name">活动名称</div>
                  <div class="company-header-text href">操作</div>
                </div>
                <div class="company-item right-bottom" v-for="(item, index) in facilitiesList" :key="index">
                  <div class="company-item-text name text-cut" :title="item.name">
                    {{ item.name }}
                  </div>

                  <div class="company-item-text href" @click="bindNewWindow(item.url)">
                    点击进入
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import echartMap from "../components/echart-map.vue";
import EchartsPie from "../components/echarts-pie.vue";
import geoJson from "../../../assets/json/ganzhoushi.json";
// import talent from "../../../assets/json/modern/talent.json";
import talentPie from "../../../assets/json/talent.json";
import all from "../../../assets/json/modern/all.json";
import facilitiesJson from "../../../assets/json/facilities.json";
import promoteJson from "../../../assets/json/promote.json";
import serviceJson from "../../../assets/json/service.json";

import Vue from "vue";
import scrollList from "../components/scrollList.js";
import Api from "@/plugins/api";
import { mapState } from "vuex";
export default {
  layout: "intelligence",
  components: {
    echartMap,
    EchartsPie,
  },
  data() {
    return {
      tabList: [
        { label: "规模实力", value: 0, url: "/scaleStrength" },
        { label: "技术创新", value: 1, url: "/technology" },
        { label: "发展生态", value: 2, url: "/developEcology" },
        { label: "产业协作", value: 3, url: "/collaborate" },
        { label: "组织保障", value: 4, url: "/organization" },
      ],
      serviceJson,
      talentPie,
      facilitiesJson,
      promoteJson,
      list: [],
      facilitiesList: [],
      promoteList: [],
      serviceList: [],
      activeTab: 2,
      chartOption: { data: [] },
      isMap: true,
      talent: [],
      jsonInfo: all,
      threeList: [],
      chartOptionPie: {
        label: true,
        center: ["50%", "45%"],
        radius: ["30%", "53%"],
        data: [],
      },
      industry: {},
      type: "",
      region: '全国',
      typeName: "",
    };
  },
  mounted() {
    // Vue.directive("scrollList", scrollList);
    this.getCompanyList();
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
        if (newValue.id) {
          this.industry = newValue
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
          this.chartOptionPie.data = this.talentPie[this.typeName];
          this.serviceList = this.serviceJson[this.typeName];
          let name = newValue.name ? newValue.name : "现代家居";

          this.facilitiesList = this.facilitiesJson.filter(
            (item) => item.type == name
          );
          this.promoteList = this.promoteJson.filter((item) => item.type == name);
          this.getCompanyList(newValue);
        }


      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    bindTab(url) {
      this.$router.push("/numIntelligence" + url);
    },
    bindNewWindow(url) {
      window.open(url, "_blank");
    },
    bindChangeRegion(region) {
      this.region = region;
      this.getCompanyList(this.industry, this.type, region)
    },
    bindChangeTalent(item) {
      // this.getCompanyList(this.industry,this.type,region)
      this.threeList = [item]
      this.getMap(0);
    },
    getCompanyList(data, type, region) {
      this.threeList = [];
      this.talent = []
      this.$request
        .get(Api.talentmap, {
          params: {
            industry: data ? data.name : "现代家居",
            keyword: this.searchText,
            type: type ? type : "",
            region: region ? region : "全国",
          },
        })
        .then((res) => {
          if (res.code == 0) {
            if (res.data.list) {
              // this.talent=res.data.list;
              this.threeList = res.data.list;
              res.data.list.forEach(item => {
                if (item.talents && item.talents.length) {
                  item.talents.forEach(element => {
                    this.talent.push({ ...item, ...element })
                  })

                }

              })

              this.getMap(0);
            } else {
              this.isMap = true;
              this.threeList = [];

              this.chartOption.data = [];
            }
          }
        });
    },

    getMap(classify) {
      this.isMap = false;
      this.chartOption.data = [];

      if (this.threeList && this.threeList.length > 0) {
        this.threeList.forEach((item) => {
          this.chartOption.data.push({
            type: "Feature",
            properties: {
              name: item.company_name,
              address: item.company_name,
              type: 3,
            },
            geometry: { type: "Point", coordinates: [item.lng, item.lat] },
          });
        });

        this.isMap = true;
      } else {
        this.isMap = true;
      }
    },
  },
};
</script>

<style scoped lang="less">
.numIntelligence-bg {
  width: 100vw;
  height: calc(100vh - 5.725rem);
  background: #111b34;
}
.deveop-container {
  // width: 100%;
  // height: 100%;
  border-radius: 0px 0px 0px 0px;
  background-color: #111b34;
  overflow: hidden;
  .container-main {
    width: 100%;
    height: auto;
    display: flex;
    justify-content: space-between;
    padding-top: 0.625rem;
    position: relative;
    .classify {
      width: 46.5625rem;
      height: 2.8125rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: 1rem;
      z-index: 99;
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
        background: #030913
          url("../../../assets/images/numIntelligence/tab3.png") no-repeat 0 0;
        background-size: 100% 100%;
      }
    }

    .container-left {
      width: 25.75rem;
      height: auto;
      margin-left: 1.25rem;
      .container-left-content {
        width: 25.75rem;
        height: auto;
        .container-left-content-title {
          width: 21.375rem;
          height: 3rem;
          text-align: center;
          background: url("../../../assets/images/numIntelligence/icon1.png")
            no-repeat center;
          .container-left-content-title-text {
            width: 19.375rem;
            height: 1.2375rem;
            font-size: 0.875rem;
            color: #ffffff;
            margin-left: 4.375rem;
            padding-top: 0.2rem;
          }
        }
        .content-box {
          .content-box-title {
            width: 25.6875rem;
            height: 2.4375rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: url("../../../assets/images/numIntelligence/icon2.png")
              no-repeat center;
            background-size: 100% 100%;
            .content-box-title-text {
              font-weight: 500;
              font-size: 1rem;
              line-height: 1rem;
              text-shadow: 0px 0px 4px #2682e1;
              background-image: linear-gradient(
                to bottom,
                #ffffff 0%,
                #218eff 100%
              );
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              padding-left: 1.375rem;
            }
            .content-box-time {
              font-size: 0.625rem;
              color: #c3d3e2;
              margin-right: 2.5rem;
            }
          }
          .content-box-list {
            width: 25.75rem;
            height: 31.4375rem;
            background: url("../../../assets/images/numIntelligence/bg2.png")
              no-repeat center;
            background-size: 100% 100%;
            .content-box-company {
              width: 25rem;
              height: auto;
              margin: auto;
              padding-bottom: 0.25rem;
              margin-top: 0.625rem;
              .company-header {
                width: 25rem;
                height: 2.4rem;
                display: flex;
                justify-content: space-around;
                align-items: center;
                background: url("../../../assets/images/numIntelligence/content1.png")
                  no-repeat center;
                background-size: 100% 100%;
                .company-header-text {
                  width: 50%;
                  text-align: center;
                  font-size: 1rem;
                  color: #b5c9db;
                  font-weight: 500;
                }
              }
              .company-item {
                cursor: pointer;
                width: 25rem;
                height: 2.875rem;
                margin-top: 4px;
                font-weight: 400;
                font-size: 1rem;
                color: #ffffff;
                background: url("../../../assets/images/numIntelligence/content2.png")
                  no-repeat center;
                background-size: 100% 100%;
                display: flex;
                align-items: center;
                justify-content: space-around;
                .company-item-text {
                  width: 50%;
                  text-align: center;
                  font-size: 1rem;
                }
              }
              .company-item:nth-child(2n-1) {
                background: url("../../../assets/images/numIntelligence/content1.png")
                  no-repeat center;
                background-size: 100% 100%;
              }
            }
          }
          .content-box-list2 {
            width: 25.75rem;
            height: auto;
            border-radius: 0rem 0rem 0rem 0rem;
            background: url("../../../assets/images/numIntelligence/bg.png")
              no-repeat center;
            background-size: 100% 100%;
            margin-top: 0.7rem;
          }
        }
        .content-middle {
          margin-top: 0.5rem;
          .content-box-list {
            width: 25.75rem;
            height: auto;
            background: url("../../../assets/images/numIntelligence/bg.png")
              no-repeat center;
            background-size: 100% 100%;
            margin-bottom: 0.625rem;
            padding: 0.2rem 0;
            .content-box-image {
              width: 25rem;
              height: auto;
              .content-box-image-box {
                width: 25rem;
                display: flex;
                justify-content: space-around;
                padding: 1rem 0;
                .image-box-item2 {
                  width: 5.8rem;
                  height: 11.625rem;
                  background: url("../../../assets/images/numIntelligence/bg7.png")
                    no-repeat center;
                  background-size: 100% 100%;
                  text-align: center;
                  .text1 {
                    margin-top: 2.6rem;
                    font-weight: 600;
                    font-size: 1.5rem;
                    line-height: 1.75rem;
                    font-style: normal;
                    text-transform: none;
                    background: linear-gradient(
                      90deg,
                      #ffffff 0%,
                      #44baff 100%
                    );
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                  }
                  .text2 {
                    font-size: 0.75rem;
                    color: #ffffff;
                    margin-top: 2.2rem;
                  }
                  .text3 {
                    font-size: 0.75rem;
                    color: #ffffff;
                    margin-top: 0.5rem;
                  }
                }
              }
            }
          }
        }
      }
    }
    .container-middle {
      //   width: 57.5625rem;
      flex: 1;
      height: auto;
      position: relative;
      .middle-tips {
        width: 16rem;
        height: 50px;
        text-align: center;
        display: flex;
        align-items: center;
        position: absolute;
        left: 50%;
        top: 2rem;
        transform: translateX(-50%);
        color: #fff;
        z-index: 999;
        padding-top: 1rem;
        .text-white {
          font-family: "YouSheBiaoTiHei", "YouSheBiaoTiHei";
          font-weight: 400;
          font-size: 1.25rem;
          color: #ffffff;
          margin-right: 1.3rem;
          margin-left: 1rem;
        }
        .text-num {
          font-weight: bold;
          font-size: 2rem;
          color: #07ebfa;
          display: flex;
          align-items: center;
        }
        .text-unit {
          font-weight: 400;
          font-size: 1rem;
          color: #949ca9;
        }
      }
      .echarts-img {
        width: 7.25rem;
        height: 18rem;
        position: absolute;
        right: 2.5rem;
        bottom: 10.875rem;
        background: url("../../../assets/images/numIntelligence/city.png")
          no-repeat center center;
        background-size: 100% 100%;
        .img {
          width: 100%;
          img {
            width: 100%;
          }
        }
      }
      .map {
        width: 53.125rem;
        height: 50rem;
        margin: 5rem auto 0;
        background: url("../../../assets/images/numIntelligence/bg9.png")
          no-repeat center bottom;
        background-size: 100% auto;
      }
    }
    .container-right {
      width: 25.75rem;
      height: auto;
      margin-right: 0.625rem;
      .container-right-content {
        width: 25.75rem;
        height: auto;
        .container-right-content-title {
          width: 21.375rem;
          height: 3rem;
          text-align: center;
          background: url("../../../assets/images/numIntelligence/icon30.png")
            no-repeat center;
          background-size: 100% 100%;
          float: right;
          .container-right-content-title-text {
            width: 19.375rem;
            height: 1.2375rem;
            font-size: 0.875rem;
            color: #ffffff;
            margin-left: -0.5rem;
            padding-top: 0.2rem;
          }
        }
        .content-box {
          .content-box-title {
            width: 25.6875rem;
            height: 2.4375rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: url("../../../assets/images/numIntelligence/icon2.png")
              no-repeat center;
            background-size: 100% 100%;
            .content-box-title-text {
              font-weight: 500;
              font-size: 1rem;
              line-height: 1rem;
              text-shadow: 0px 0px 4px #2682e1;
              background-image: linear-gradient(
                to bottom,
                #ffffff 0%,
                #218eff 100%
              );
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              padding-left: 1.375rem;
            }
            .content-box-time {
              font-size: 0.625rem;
              color: #c3d3e2;
              margin-right: 2.5rem;
            }
          }

          .content-box-list {
            width: 25.75rem;
            height: auto;
            background: url("../../../assets/images/numIntelligence/bg.png")
              no-repeat center;
            background-size: 100% 100%;
            margin-bottom: 0.625rem;
            padding: 0.2rem 0;
            .content-box-company {
              width: 25rem;
              height: auto;
              margin: auto;
              margin-top: 0.625rem;
              .company-header {
                width: 25rem;
                height: 3.125rem;
                display: flex;
                justify-content: space-around;
                align-items: center;
                background: url("../../../assets/images/numIntelligence/content1.png")
                  no-repeat center;
                background-size: 100% 100%;
                .company-header-text {
                  text-align: center;
                  font-size: 1rem;
                  color: #b5c9db;
                  font-weight: 500;
                }
                .company-header-text.name {
                  flex: 1;
                }
                .company-header-text.href {
                  width: 6.25rem;
                  flex-shrink: 0;
                }
              }
              .right-bottom.company-item {
                .company-item-text {
                  height: 3.125rem;
                  line-height: 3.125rem;
                }
                .company-item-text.name {
                  flex: 1;
                }
                .company-item-text.href {
                  width: 6.25rem;
                  flex-shrink: 0;
                  color: #257ff8;
                  text-decoration: underline;
                  cursor: pointer;
                }
              }
              .company-item {
                cursor: pointer;
                flex: 1;
                height: 3.125rem;
                line-height: 3.125rem;
                margin-bottom: 4px;
                font-weight: 400;
                font-size: 1rem;
                color: #ffffff;
                background: url("../../../assets/images/numIntelligence/content2.png")
                  no-repeat center;
                background-size: 100% 100%;
                display: flex;
                align-items: center;
                justify-content: space-around;
                .company-item-text {
                  width: 50%;
                  text-align: center;
                  font-size: 1rem;
                }

                .company-item-text-right {
                  width: 100%;
                  text-align: center;
                  font-size: 1rem;
                  margin-right: 0.9rem;
                }
              }
            }
            .serve {
              .company-item:nth-child(2n) {
                background: url("../../../assets/images/numIntelligence/content1.png")
                  no-repeat center;
                background-size: 100% 100%;
              }
            }
            .all {
              .company-item:nth-child(2n-1) {
                background: url("../../../assets/images/numIntelligence/content1.png")
                  no-repeat center;
                background-size: 100% 100%;
              }
            }
          }
          .right-top.content-box-list {
            .company-item:nth-child(2n-1) {
              background: url("../../../assets/images/numIntelligence/content2.png")
                no-repeat center;
              background-size: 100% 100%;
            }
            .company-item:nth-child(2n) {
              background: url("../../../assets/images/numIntelligence/content1.png")
                no-repeat center;
              background-size: 100% 100%;
            }
          }
        }
      }
    }
  }
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
</style>


<style>
.amap-logo {
  display: none;
  opacity: 0 !important;
}
.amap-copyright {
  opacity: 0;
}
</style>
