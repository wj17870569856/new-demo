<template>
  <div class="container numIntelligence-bg">
    <div class="container-main">
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

      <div class="container-left">
        <div class="container-left-content">
          <div class="empty-top"></div>
          <div class="container-left-content-title top">
            <div class="container-left-content-title-text">
              产业技术体系的先进性与完善性
            </div>
          </div>
          <div class="content-box">
            <div class="content-box-title">
              <div class="content-box-title-text">全国授权发明专利</div>
              <div class="content-box-time">数据截止时间：2024-12-7</div>
            </div>
            <div class="content-box-list">
              <div class="content-box-img" v-if="activeType==0">
                <div class="content-box-img-text">
                  {{
                    industry.name == "现代家居"
                      ? 21340
                      : industry.name == "生物医药"
                      ? 82695
                      : industry.name == "有色金属和新材料"
                      ? 72951
                      : industry.name == "新能源和新能源汽车"
                      ? 66482
                      : industry.name == "纺织服装"
                      ? 37516
                      : industry.name == "绿色食品"
                      ? 59526
                      : industry.name == "电子信息"
                      ? 568644
                      : 21340
                  }}
                </div>
                <div class="content-box-img-unit">个</div>
              </div>
              <div class="content-box-company">
                <div class="company-header">
                  <div class="company-header-text">发明名称</div>
                  <div class="company-header-text">专利权人名称</div>
                </div>

                <div class="scroll company-box" v-scrollList="6000">
                  <div
                    class="company-item"
                    v-for="(item, index) in patentList"
                    :key="index"
                  >
                    <div
                      class="company-item-text text-cut"
                      :title="item.patent"
                    >
                      {{ item.patent }}
                    </div>
                    <div class="company-item-text text-cut" :title="item.name">
                      {{ item.name }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="content-middle">
            <div class="container-left-content-title">
              <div class="container-left-content-title-text">
                关键核心技术攻关
              </div>
            </div>
            <div class="content-box">
              <!-- <div class="content-box-title">
                <div class="content-box-title-text">科技技术</div>
                <div class="content-box-time">数据截止时间：2024-12-7</div>
              </div> -->

              <div class="content-box-list2" style="height: 31rem">
                <el-carousel
                  indicator-position="outside "
                  height="380"
                  style="width: 100%; height: 380px; overflow: hidden"
                  class="scroll"
                >
                  <el-carousel-item
                    v-for="(item, index) in Math.ceil(imgArr.length / 2)"
                    :key="item"
                    style="width: 100%; height: 380px"
                  >
                    <div class="img-box margin-bottom" v-if="imgArr[index]">
                      <img
                        :src="
                          require('../../../assets/images/numIntelligence/star' +
                            imgArr[index] +
                            '.png')
                        "
                        class="star"
                        alt=""
                      />
                    </div>
                    <div class="text">{{ imgArrName[index] }}</div>
                    <div class="img-box line" v-if="imgArr[index + 1]">
                      <img
                        :src="
                          require('../../../assets/images/numIntelligence/star' +
                            imgArr[index + 1] +
                            '.png')
                        "
                        class="star"
                        alt=""
                      />
                    </div>
                    <div class="text">{{ imgArrName[index + 1] }}</div>
                  </el-carousel-item>
                </el-carousel>
              </div>
              <!-- <div class="content-box-list2" style="height: 13.3125rem">
               
              </div> -->
              <!-- <div class="content-box-title">
                <div class="content-box-title-text">轻工业一等奖</div>
                <div class="content-box-time">数据截止时间：2024-12-7</div>
              </div>
              <div class="content-box-list2" style="height: 13.3125rem">
                <div class="img-box line">
                  <img
                    src="../../../assets/images/numIntelligence/star1.png"
                    class="star"
                    alt=""
                  />
                </div>
              </div> -->
            </div>
          </div>
        </div>
      </div>
      <div class="container-middle">
        <!-- <div class="container-middle-content"></div> -->
        <div class="middle-tips">
          <div class="text-white">专利总数</div>
          <div class="text-num">
            {{
              industry.name == "现代家居"
                ? 21340
                : industry.name == "生物医药"
                ? 82695
                : industry.name == "有色金属和新材料"
                ? 72951
                : industry.name == "新能源和新能源汽车"
                ? 66482
                : industry.name == "纺织服装"
                ? 37516
                : industry.name == "绿色食品"
                ? 59526
                : industry.name == "电子信息"
                ? 568644
                : 21340
            }}
            <span class="text-unit">个</span>
          </div>
        </div>
        <div class="echarts-img">
          <div class="img" @click="bindChangeRegion('全国')">
            <img
              :src="
                region == '全国'
                  ? require('../../../assets/images/numIntelligence/icon47.png')
                  : require('../../../assets/images/numIntelligence/icon50.png')
              "
              alt=""
            />
          </div>
          <div class="img" @click="bindChangeRegion('江西省')">
            <img
              :src="
                region == '江西省'
                  ? require('../../../assets/images/numIntelligence/icon48.png')
                  : require('../../../assets/images/numIntelligence/icon51.png')
              "
              alt=""
            />
          </div>
          <div class="img" @click="bindChangeRegion('赣州市')">
            <img
              :src="
                region == '赣州市'
                  ? require('../../../assets/images/numIntelligence/icon49.png')
                  : require('../../../assets/images/numIntelligence/icon52.png')
              "
              alt=""
            />
          </div>
        </div>
        <div class="map">
          <echartMap
            chartId="map8"
            :chartOption="chartOption"
            v-if="isMap"
            width="65.3125rem"
            height="47.8125rem"
             :type="0"
          />
        </div>
        <div class="container-middle-bottom">
          <div class="middle-bottom-content">
            <div class="middle-bottom-main">
              <div
                class="bottom-main-item"
                :class="activeType == 0 ? 'active' : ''"
                @click="bindChangeType(0)"
              >
                <div class="main-item-image">
                  <img
                    src="../../../assets/images/numIntelligence/icon32.png"
                    alt=""
                  />
                </div>
                <div class="main-item-text">专利企业</div>
              </div>
              <div
                class="bottom-main-item"
                :class="activeType == 1 ? 'active' : ''"
                @click="bindChangeType(1)"
              >
                <div class="main-item-image">
                  <img
                    src="../../../assets/images/numIntelligence/icon33.png"
                    alt=""
                  />
                </div>
                <div class="main-item-text">创新载体</div>
              </div>
              <!-- <div class="bottom-main-item">
                <div class="main-item-image">
                  <img
                    src="../../../assets/images/numIntelligence/icon34.png"
                    alt=""
                  />
                </div>
                <div class="main-item-text">工业设计中心</div>
              </div> -->
            </div>
            <div class="container-middle-bottom-bg"></div>
          </div>
        </div>
      </div>
      <div class="container-right">
        <div class="container-right-content">
          <div class="empty-top"></div>
          <div class="container-right-content-title">
            <div class="container-right-content-title-text">创新载体建设</div>
          </div>
          <div class="content-box">
            <div class="content-box-title">
              <div class="content-box-title-text">创新载体</div>
              <div class="content-box-time">数据截止时间：2024-12-7</div>
            </div>
            <div class="content-box-list" style="height: 11.875rem">
              <div class="content-box-company">
                <div class="company-header">
                  <div class="company-header-text">分类名称</div>
                  <div class="company-header-text">数量</div>
                </div>
                <div class="company-item">
                  <div class="company-item-text">技术创新中心</div>
                  <div class="company-item-text">
                    {{
                      industry.name == "现代家居"
                        ? 6
                        : industry.name == "生物医药"
                        ? 21
                        : industry.name == "有色金属和新材料"
                        ? 3
                        : industry.name == "新能源和新能源汽车"
                        ? 2
                        : industry.name == "纺织服装"
                        ? 6
                        : industry.name == "绿色食品"
                        ? 8
                        : industry.name == "电子信息"
                        ? 11
                        : 6
                    }}
                  </div>
                </div>
                <div class="company-item">
                  <div class="company-item-text">工业设计中心</div>
                  <div class="company-item-text">
                    {{
                      industry.name == "现代家居"
                        ? 65
                        : industry.name == "生物医药"
                        ? 52
                        : industry.name == "有色金属和新材料"
                        ? 47
                        : industry.name == "新能源和新能源汽车"
                        ? 27
                        : industry.name == "纺织服装"
                        ? 107
                        : industry.name == "绿色食品"
                        ? 63
                        : industry.name == "电子信息"
                        ? 301
                        : 65
                    }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="content-box">
            <div class="content-box-title">
              <div class="content-box-title-text">工业设计中心</div>
              <div class="content-box-time">数据截止时间：2024-12-7</div>
            </div>
            <div class="content-box-list">
              <div
                class="content-box-company sercound scroll"
                v-scrollList="6000"
                style="height: 15.4375rem"
              >
                <div v-if="carrierList.length">
                  <div v-for="(item, index) in carrierList" :key="index * 100">
                    <!-- <div class="company-item">
                      <div class="company-item-text-small">序号</div>
                      <div class="company-item-text-right">
                        {{ index+1 }}
                      </div>
                    </div> -->
                    <!-- <div class="company-item">
                      <div class="company-item-text-small">级别</div>
                      <div class="company-item-text-right">
                        {{ item.lever }}
                      </div>
                    </div> -->
                    <!-- <div class="company-item">
                      <div class="company-item-text-small">名称</div>
                      <div
                        class="company-item-text-right text-cut"
                        :title="item.name"
                      >
                        {{ item.name }}
                      </div>
                    </div> -->
                    <div class="company-item">
                      <div class="company-item-text-small">{{ item.name }}</div>
                      <!-- <div class="company-item-text-right">
                        {{ item.classify }}
                      </div> -->
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="content-box">
            <div class="content-box-title">
              <div class="content-box-title-text">技术创新中心</div>
              <div class="content-box-time">数据截止时间：2024-12-7</div>
            </div>
            <div class="content-box-list" style="height: 20.625rem">
              <div
                class="content-box-image scroll"
                v-scrollList="6000"
                style="height: 20.625rem"
              >
                <div class="content-box-image-box">
                  <div
                    class="image-box-item"
                    v-for="(item, index) in innovateList"
                    :key="index"
                  >
                    <div class="text1"></div>
                    <div class="text2">{{ item.name }}</div>
                  </div>
                  <!-- <div class="image-box-item">
                    <div class="text1"></div>
                    <div class="text2">{{}}
                    </div>
                  </div>
                  <div class="image-box-item">
                    <div class="text1"></div>
                    <div class="text2">赣州市德普特科技有限公司</div>
                  </div>

                  <div class="image-box-item">
                    <div class="text1"></div>
                    <div class="text2">赣州市德普特科技有限公司</div>
                  </div>
                  <div class="image-box-item">
                    <div class="text1"></div>
                    <div class="text2">赣州市德普特科技有限公司</div>
                  </div>
                  <div class="image-box-item">
                    <div class="text1"></div>
                    <div class="text2">赣州市德普特科技有限公司</div>
                  </div> -->
                </div>
                <!-- <div class="content-box-image-box">
                  <div class="image-box-item">
                    <div class="text1"></div>
                    <div class="text2">赣州汇明木业有限公司技术中心</div>
                  </div>
                  <div class="image-box-item">
                    <div class="text1"></div>
                    <div class="text2">江西省赣璞设计有限公司</div>
                  </div>
                  <div class="image-box-item">
                    <div class="text1"></div>
                    <div class="text2">美克数创(赣州)家居智造有限公司</div>
                  </div>
                </div> -->
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
import patentJson from "../../../assets/json/patent.json";
import scrollList from "../components/scrollList.js";
import carrierJson from "../../../assets/json/carrier.json";
import innovateJson from "../../../assets/json/innovate.json";

import Api from "@/plugins/api";
import { mapState } from "vuex";
export default {
  layout: "intelligence",
  components: { echartMap },
  data() {
    return {
      tabList: [
        { label: "规模实力", value: 0, url: "/scaleStrength" },
        { label: "技术创新", value: 1, url: "/technology" },
        { label: "发展生态", value: 2, url: "/developEcology" },
        { label: "产业协作", value: 3, url: "/collaborate" },
        { label: "组织保障", value: 4, url: "/organization" },
      ],
      carrierJson,
      carrierList: [],
      innovateJson,
      innovateList: [],
      list: [],
      activeTab: 1,
      isMap: true,
      imgArr: [16, 17],
      imgArrName: ["科技技术奖", "科技技术奖"],
      chartOption: { data: [] },
      patentJson,
      patentList: [],
      threeList: [],
      industry: {},
      type: "",
      region: "全国",
      activeType: 0,
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
          if (this.activeType == 0) {
            this.getCompanyList(newValue, this.type, this.region);
          } else {
            this.getOrgmap(newValue, this.type, this.region);
          }

          this.patentList = this.patentJson.filter(
            (item) => item.type == newValue.name
          );
          this.carrierList = this.carrierJson.filter(
            (item) => item.type == newValue.name
          );
          this.innovateList = this.innovateJson.filter(
            (item) => item.type == newValue.name
          );
          this.imgArr =
            newValue.name == "现代家居"
              ? [16, 17]
              : newValue.name == "生物医药"
              ? [3]
              : newValue.name == "有色金属和新材料"
              ? [5, 6]
              : newValue.name == "新能源和新能源汽车"
              ? [11, 4]
              : newValue.name == "纺织服装"
              ? [1, 7]
              : newValue.name == "绿色食品"
              ? [2, 12]
              : newValue.name == "电子信息"
              ? [8, 9, 10, 13, 14, 15]
              : [16, 17];

          this.imgArrName =
            newValue.name == "现代家居"
              ? ["科技技术奖", "科技技术奖"]
              : newValue.name == "生物医药"
              ? ["中国名族医药协会科学技术进步一等奖"]
              : newValue.name == "有色金属和新材料"
              ? [
                  "全国有色金属标准化技术委员会技术标准优秀奖",
                  "中国有色金属工业科学技术一等奖",
                ]
              : newValue.name == "新能源和新能源汽车"
              ? ["电力科技创新奖", "国家科学技术进步奖"]
              : newValue.name == "纺织服装"
              ? ["纺织科技进步一等奖", "纺织自然科学一等奖"]
              : newValue.name == "绿色食品"
              ? [
                  "中国轻工业联合会科学技术进步奖一等奖",
                  "中国食品工业协会科学技术奖一等奖",
                ]
              : newValue.name == "电子信息"
              ? [
                  "年度技术创新奖",
                  "中国电子学会科技进步一等奖",
                  "国家科学技术进步一等奖",
                  "5G+工业互联网行业赛二等奖",
                  "赣州经开区电子信息企业协会第一届理事会副会长单位",
                  "中国产业互联网领军企业",
                ]
              : ["科技技术奖", "科技技术奖"];
        }
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    this.getCompanyList();
    this.patentList = this.patentJson.filter((item) => item.type == "现代家居");
    this.carrierList = this.carrierJson.filter(
      (item) => item.type == "现代家居"
    );
    this.innovateList = this.innovateJson.filter(
      (item) => item.type == "现代家居"
    );
  },

  methods: {
    bindChangeType(index) {
      this.activeType = index;
      if (index == 0) {
        this.getCompanyList(this.industry, this.type, this.region);
      } else {
        this.getOrgmap(this.industry, this.type, this.region);
      }
    },
    bindTab(url) {
      this.$router.push("/numIntelligence" + url);
    },
    bindChangeRegion(region) {
      this.region = region;
      if (this.activeType == 0) {
        this.getCompanyList(this.industry, this.type, region);
      } else {
        this.getOrgmap(this.industry, this.type, region);
      }
    },
    getCompanyList(data, type, region) {
      this.threeList = [];
      this.chartOption.data = [];
      this.$request
        .get(Api.getPatentmap, {
          params: {
            industry: data && data.name ? data.name : "现代家居",
            keyword: this.searchText,
            type: type ? type : "",
            region: region ? region : "全国",
          },
        })
        .then((res) => {
          if (res.code == 0) {
            if (res.data.list) {
              this.threeList = res.data.list;
              this.getMap(1);
            } else {
              this.isMap = true;
              this.threeList = [];

              this.chartOption.data = [];
            }
            // this.getOrgmap();
          }
        });
    },
    getOrgmap(data, type, region) {
      this.threeList = [];
      this.$request
        .get(Api.orgmap, {
          params: {
            industry: data && data.name ? data.name : "现代家居",
            keyword: this.searchText,
            type: type ? type : "",
            region: region ? region : "全国",
          },
        })
        .then((res) => {
          if (res.code == 0) {
            if (res.data.list) {
              this.threeList = res.data.list;
              this.getMap(2);
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

      if (this.threeList && this.threeList.length > 0) {
        this.threeList.forEach((item) => {
          this.chartOption.data.push({
            type: "Feature",
            properties: {
              name: item.company_name,
              address: item.company_name,
              type: classify,
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
.container {
  width: 100%;
  // height: 100%;

  background-color: #111b34;
  overflow: hidden;

  .container-main {
    width: 100%;
    height: auto;
    display: flex;
    justify-content: space-between;
    // justify-content: space-around;
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
      margin-left: 20px;
      height: auto;
      .container-left-content {
        width: 25.75rem;
        height: auto;
        position: relative;
        .empty-top {
          height: 2.375rem;
        }
        .container-left-content-title.top {
          position: absolute;
          top: 0;
        }
        .container-left-content-title {
          width: 21.375rem;
          height: 3.625rem;
          margin-left: -20px;
          text-align: center;
          background: url("../../../assets/images/numIntelligence/icon1.png")
            no-repeat center;
          background-size: 100% 100%;
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
            height: 19.375rem;
            background: url("../../../assets/images/numIntelligence/bg2.png")
              no-repeat center;
            background-size: 100% 100%;
            .content-box-img {
              width: 7.5625rem;
              height: 6rem;
              background: url("../../../assets/images/numIntelligence/icon9.png")
                no-repeat center;
              background-size: 100% 100%;
              display: flex;
              justify-content: center;
              margin: auto;
              .content-box-img-text {
                font-size: 3.125rem;
                color: #26fdf0;
                font-family: YouSheBiaoTiHei, YouSheBiaoTiHei;
              }
              .content-box-img-unit {
                font-size: 1.25rem;
                color: #26fdf0;
                font-family: YouSheBiaoTiHei, YouSheBiaoTiHei;
                margin-left: 0.625rem;
                margin-top: 1.875rem;
              }
            }
            .content-box-company {
              width: 25rem;
              height: auto;
              margin: 0.75rem auto 0;
              .company-header {
                width: 25rem;
                height: 2.125rem;
                display: flex;
                justify-content: space-around;
                align-items: center;
                background: url("../../../assets/images/numIntelligence/content1.png")
                  no-repeat center;
                background-size: 100% 100%;
                margin-bottom: 4px;
                .company-header-text {
                  width: 50%;
                  text-align: center;
                  font-size: 1rem;
                  color: #b5c9db;
                  font-weight: 500;
                }
              }
              .company-item {
                width: 25rem;
                height: 3.25rem;
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
              .company-item:nth-child(2n) {
                background: url("../../../assets/images/numIntelligence/content1.png")
                  no-repeat center;
                background-size: 100% 100%;
              }
            }
          }
          .content-box-list2 {
            width: 25.75rem;
            height: 10.8rem;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;

            background: url("../../../assets/images/numIntelligence/bg.png")
              no-repeat center;
            background-size: 100% 100%;
            .img-box {
              width: 18rem;
              height: 11rem;
              margin: 0 auto 8px;
              position: relative;
              background: url("../../../assets/images/numIntelligence/bg7.png")
                no-repeat center;
              background-size: 100% 100%;
              overflow: hidden;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            img.star {
              width: 90%;
              height: 90%;
            }
            img {
              width: 18rem;
              height: 11.9375rem;
            }
            .text {
              color: #fff;
              padding: 4px;
              font-size: 14px;
            }
          }
        }
        .content-middle {
          margin-top: 1rem;
        }
      }
    }
    .container-middle {
      width: 57.5625rem;
      height: auto;
      position: relative;
      .container-middle-tab {
        width: 50rem;
        height: auto;
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin: 0 auto;
        .tab-item {
          width: 8.5625rem;
          height: 2.8125rem;
          line-height: 2.8125rem;
          background: linear-gradient(
            90deg,
            rgba(0, 25, 52, 0) 0%,
            #001934 50%,
            rgba(0, 25, 52, 0) 100%
          );

          border-image: linear-gradient(
              90deg,
              rgba(0, 54, 109, 0),
              rgba(0, 54, 109, 1),
              rgba(0, 54, 109, 0)
            )
            1 1;
          font-size: 1.25rem;
          color: #c3d3e2;
          text-align: center;
        }
        .active {
          .tab-text {
            background: linear-gradient(90deg, #ffffff 0%, #2682e1 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        }
      }
      .middle-tips {
        width: 16rem;
        height: 50px;
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
        z-index: 99;
        .img {
          width: 100%;
          img {
            width: 100%;
          }
        }
      }
      .map {
        width: 57.5625rem;
        height: 50rem;
        margin: 5rem auto 0;
        background: url("../../../assets/images/numIntelligence/bg9.png")
          no-repeat center bottom;
        background-size: 100% auto;
      }
      // .container-middle-content {
      //   width: 57.5625rem;
      //   height: auto;
      // }
      .container-middle-bottom {
        width: 57.5625rem;
        height: auto;
        background-size: 100% 100%;
        position: absolute;
        bottom: 0.625rem;
        .middle-bottom-content {
          width: 57.5625rem;
          height: auto;
          position: relative;
          .middle-bottom-main {
            width: 100%;
            position: absolute;
            bottom: 0;
            display: flex;
            align-content: center;
            justify-content: center;
            .bottom-main-item {
              width: 12.5rem;
              height: 4.8125rem;
              background: url("../../../assets/images/numIntelligence/bg8.png")
                no-repeat center;
              background-size: 100% 100%;
              .main-item-image {
                width: 100%;
                height: auto;
                text-align: center;
                margin-top: -0.625rem;
                img {
                  width: 3.0625rem;
                  height: 3.4375rem;
                }
              }
              .main-item-text {
                width: 100%;
                text-align: center;
                font-size: 1.125rem;
                color: #ffffff;
                font-weight: 500;
                margin-top: -0.625rem;
              }
            }
            .active.bottom-main-item {
              background: url("../../../assets/images/numIntelligence/bg10.png")
                no-repeat center;
              background-size: 100% 100%;
            }
            .bottom-main-item:nth-of-type(2) {
              margin: 0 0.625rem 0 0.625rem;
            }
          }
          .container-middle-bottom-bg {
            width: 57.5625rem;
            height: 40px;
            background: url("../../../assets/images/numIntelligence/middle-bottom.png")
              no-repeat center;
            background-size: 100% 100%;
          }
        }
      }
    }
    .container-right {
      width: 25.75rem;
      height: auto;
      .container-right-content {
        width: 25.75rem;
        height: auto;
        position: relative;
        .empty-top {
          height: 2.375rem;
        }
        .container-right-content-title {
          width: 23.8125rem;
          height: 3.625rem;
          text-align: center;
          position: absolute;
          top: 0;
          right: 0;
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
            padding-top: 0.3rem;
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
              .company-header {
                width: 25rem;
                height: 3.125rem;
                display: flex;
                justify-content: space-around;
                align-items: center;
                margin-bottom: 4px;
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
                width: 25rem;
                height: 3.125rem;
                margin-bottom: 9px;
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
                .company-item-text-small {
                  width: 100%;
                  font-size: 1rem;
                  margin-left: 0.9rem;
                  text-align: center;
                }
                .company-item-text-right {
                  width: 50%;
                  text-align: right;
                  font-size: 1rem;
                  margin-right: 0.9rem;
                }
              }
              .company-item:nth-child(2n-1) {
                background: url("../../../assets/images/numIntelligence/content1.png")
                  no-repeat center;
                background-size: 100% 100%;
              }
            }
            .sercound.content-box-company {
              .company-item {
                width: 25rem;
                height: 3.125rem;
                margin-bottom: 8px;
              }
            }
            .content-box-image {
              width: 25rem;
              height: auto;
              .content-box-image-box {
                width: 25rem;
                display: flex;
                justify-content: space-around;
                flex-wrap: wrap;
                margin-top: 3.625rem;

                padding-bottom: 0.2rem;
                .image-box-item {
                  width: 5.5rem;
                  height: 5rem;
                  margin: 0 10px 30px;
                  background: url("../../../assets/images/numIntelligence/icon31.png")
                    no-repeat center;
                  background-size: 100% 100%;
                  .text1 {
                    min-height: 1rem;
                    font-family: YouSheBiaoTiHei, YouSheBiaoTiHei;
                    font-size: 1.75rem;
                    color: #ffffff;
                    text-align: center;
                  }
                  .text2 {
                    font-family: YouSheBiaoTiHei, YouSheBiaoTiHei;
                    font-size: 0.75rem;
                    color: #ffffff;
                    margin-top: 0.625rem;
                  }
                }
                .image-box-item2 {
                  width: 6.5rem;
                  height: 8.0625rem;
                  background: url("../../../assets/images/numIntelligence/bg7.png")
                    no-repeat center;
                  background-size: 100% 100%;
                  text-align: center;
                  .text1 {
                    margin: 1.625rem 0 1rem 0;
                    font-weight: 600;
                    font-size: 1.5rem;
                    line-height: 1.75rem;

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
                    margin-top: 0.5rem;
                    text-align: center;
                    text-align: center;
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
  }
}
.company-box {
  height: 9.6rem;
  overflow-y: auto;
}
.margin-bottom {
  margin-bottom: 0.8125rem;
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
