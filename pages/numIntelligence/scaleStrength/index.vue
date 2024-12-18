<template>
  <div class="deveop-container numIntelligence-bg">
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
          <div class="content-box margin-bottom">
            <div class="empty-top"></div>
            <div class="container-left-content-title">
              <div class="container-left-content-title-text">
                产业规模实力
              </div>
            </div>
            <div class="content-box-title">
              <div class="content-box-title-text">产值实力</div>
              <div class="content-box-time">数据截止时间：2024-12-7</div>
            </div>
            <div class="content-box-list">
              <div class="location">全国</div>
              <div class="chanzhi-box">
                <div class="chanzhi-box-item1">
                  <div class="chanzhi-item1-left"></div>
                  <div class="chanzhi-item1-right">
                    <div class="text-box">
                      <div class="item1-text1">{{ strength.county[0] }}</div>
                      <div class="item1-text2">亿元</div>
                    </div>
                    <div class="chanzhi-item1-year">2019</div>
                  </div>
                </div>
                <div class="chanzhi-box-item4">
                  <div class="chanzhi-item1-left"></div>
                  <div class="chanzhi-item1-right">
                    <div class="text-box">
                      <div class="item1-text1">{{ strength.county[1] }}</div>
                      <div class="item1-text2">亿元</div>
                    </div>
                    <div class="chanzhi-item1-year">2023年</div>
                  </div>
                </div>
                <div class="chanzhi-box-item2" :class="strength.county[2]>0?'up':''" ></div>
                <div class="chanzhi-box-item3">
                  <div class="content-box-img">
                    <div class="content-box-img-item">
                      <div class="content-box-img-text">
                        {{ strength.county[2] }}%
                      </div>
                      <div class="content-box-img-unit"></div>
                    </div>
                    <div class="content-box-img-desc">平均年增长率</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="content-box-list">
              <div class="location">赣州</div>
              <div class="chanzhi-box">
                <div class="chanzhi-box-item1">
                  <div class="chanzhi-item1-left"></div>
                  <div class="chanzhi-item1-right">
                    <div class="text-box">
                      <div class="item1-text1">{{ strength.city[0] }}</div>
                      <div class="item1-text2">亿元</div>
                    </div>
                    <div class="chanzhi-item1-year">2019年</div>
                  </div>
                </div>
                <div class="chanzhi-box-item4">
                  <div class="chanzhi-item1-left"></div>
                  <div class="chanzhi-item1-right">
                    <div class="text-box">
                      <div class="item1-text1">{{ strength.city[1] }}</div>
                      <div class="item1-text2">亿元</div>
                    </div>
                    <div class="chanzhi-item1-year">2023年</div>
                  </div>
                </div>
                <div class="chanzhi-box-item2 " :class="strength.city[2]>0?'up':''"></div>
                <div class="chanzhi-box-item3">
                  <div class="content-box-img">
                    <div class="content-box-img-item">
                      <div class="content-box-img-text">{{ strength.city[2] }}%</div>
                      <div class="content-box-img-unit"></div>
                    </div>
                    <div class="content-box-img-desc">平均年增长率</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="content-box margin-bottom">
            <div class="content-box-title">
              <div class="content-box-title-text">近5年产值趋势</div>
              <div class="content-box-time">数据截止时间：2024-12-7</div>
            </div>
            <div class="content-box-list" style="height: 23.625rem">
              <echartsLine chartId="myChart" :chartOption="chartOptions" />
            </div>
          </div>
          <!-- <div class="content-left-bottom">
            <div class="content-box">
              <div class="content-box-title">
                <div class="content-box-title-text">规模实力</div>
                <div class="content-box-time">数据截止时间：2024-12-7</div>
              </div>
              <div class="content-box-list">
                <div class="content-box-image">
                  <div class="content-box-image-box">
                    <div class="image-box-item2">
                      <div class="text1">7349</div>
                      <div class="text2">（个）</div>
                      <div class="text3">企业个数</div>
                    </div>
                    <div class="image-box-item2">
                      <div class="text1">4404.4</div>
                      <div class="text2">（亿元）</div>
                      <div class="text3">利润总额</div>
                    </div>
                    <div class="image-box-item2">
                      <div class="text1">7358.6</div>
                      <div class="text2">（亿元）</div>
                      <div class="text3">资产总计</div>
                    </div>
                    <div class="image-box-item2">
                      <div class="text1">96.0</div>
                      <div class="text2">（万人）</div>
                      <div class="text3">用工人数</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> -->
        </div>
      </div>
      <div class="container-middle">
        <div class="middle-tips">
          <div class="text-white">企业数量</div>
          <div class="text-num">
            {{
              industry.name == "现代家居"
                ? 8470
                : industry.name == "生物医药"
                ? 26188
                : industry.name == "有色金属和新材料"
                ? 13318
                : industry.name == "新能源和新能源汽车"
                ? 6881
                : industry.name == "纺织服装"
                ? 13239
                : industry.name == "绿色食品"
                ? 19235
                : industry.name == "电子信息"
                ? 75065
                : 8470
            }}<span class="text-unit">个</span>
          </div>
          <div class="text-white">利润总额</div>
          <div class="text-num">
            {{
              industry.name == "现代家居"
                ? 4404.4
                : industry.name == "生物医药"
                ? 3496.4
                : industry.name == "有色金属和新材料"
                ? 3464.3
                : industry.name == "新能源和新能源汽车"
                ? 11015.8
                : industry.name == "纺织服装"
                ? 641.7
                : industry.name == "绿色食品"
                ? 1737.3
                : industry.name == "电子信息"
                ? 7599.4
                : 4404.4
            }}
            <span class="text-unit">亿元</span>
          </div>
          <div class="text-white">资产总计</div>
          <div class="text-num">
            {{
              industry.name == "现代家居"
                ? 7358.6
                : industry.name == "生物医药"
                ? 49502.8
                : industry.name == "有色金属和新材料"
                ? 52313.3
                : industry.name == "新能源和新能源汽车"
                ? 344477.8
                : industry.name == "纺织服装"
                ? 10815.3
                : industry.name == "绿色食品"
                ? 21639.0
                : industry.name == "电子信息"
                ? 192720.0
                : 7358.6
            }}
            <span class="text-unit">亿元</span>
          </div>
          <div class="text-white">用工人数</div>
          <div class="text-num">
            {{
              industry.name == "现代家居"
                ? 96.0
                : industry.name == "生物医药"
                ? 207.8
                : industry.name == "有色金属和新材料"
                ? 162.5
                : industry.name == "新能源和新能源汽车"
                ? 733.8
                : industry.name == "纺织服装"
                ? 214.6
                : industry.name == "绿色食品"
                ? 169.3
                : industry.name == "电子信息"
                ? 921.3
                : 96.0
            }}
            <span class="text-unit">万人</span>
          </div>
        </div>
        <div class="map">
          <echartMap
            chartId="map2"
            :chartOption="chartOption"
            width="65.3125rem"
            height="47.8125rem"
             :type="0"
            v-if="isMap && chartOption.data.length"
          />
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
        <!-- <div class="container-middle-content">
          <div class="map-content">
            <div class="map-box"></div>
            <div class="map-bg"></div>
          </div>
        </div>
        <div class="container-middle-bottom"></div> -->
      </div>
      <div class="container-right">
        <div class="container-right-content">
          <div class="empty-top"></div>
          <div class="container-right-content-title">
            <div class="container-right-content-title-text">
              企业结构与优质企业发展水平
            </div>
          </div>
          <div class="content-box">
            <div class="content-box-title">
              <div class="content-box-title-text">企业结构</div>
              <div class="content-box-time">数据截止时间：2024-12-7</div>
            </div>
            <div class="content-box-list" style="height: 16.6875rem">
              <div class="content-box-ring" style="height: 16.6875rem">
                <echartsRing
                  chartId="ring"
                  :chartOption="chartOptionRing"
                  v-if="chartOptionRing.length"
                />
              </div>
            </div>
          </div>
          <div class="content-box">
            <div class="content-box-title">
              <div class="content-box-title-text">优质企业名单</div>
              <div class="content-box-time">数据截止时间：2024-12-7</div>
            </div>
            <div
              class="content-box-list scroll"
              style="height: 35.9125rem; overflow-y: auto"
            >
              <div class="line-box" v-if="list.length">
                <div
                  class="line-box-item"
                  v-for="(item, index) in list"
                  :key="index"
                  @click="getMapThree(item.type, i)"
                >
                  <div class="line-box-item-title">{{ item.type }}</div>
                  <div class="line-box-item-content">
                    <div class="line-box-item-bg">
                      <div class="progress-bar">
                        <div
                          class="progress"
                          :style="{
                            width: ((item.num / total) * 100).toFixed(2) + '%',
                          }"
                        ></div>
                      </div>
                    </div>
                    <div class="line-box-item-text">{{ item.num }}家</div>
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
import echartsLine from "../components/echarts-line.vue";
import echartsRing from "../components/echarts-ring.vue";
import Api from "@/plugins/api";
import echartMap from "../components/echart-map.vue";
import typesJson from "../../../assets/json/types.json";

import { mapState } from "vuex";
export default {
  layout: "intelligence",
  components: {
    echartsLine,
    echartMap,
    echartsRing,
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
      list: [],
      activeTab: 0,
      chartOption: { data: [], data2: [] },
      isMap: false,
      total: 0,
      type: "规上企业",
      region: "全国",
      typesJson,
      typesList: [],
      threeList: [],
      chartOptionRing: [],
      industry_lists: [],
      industry: { name: "现代家居" },
      typeName: "现代家居",
      strength: { county: [7346,6755,-2.1], city: [1800,2700,10.7] },
      chartOptions: {
        grid: {
          //方法 1
          left: 0,
          right: 20,
          bottom: 10,
          top: 45,
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: ["2019年", "2020年", "2021年", "2022年", "2023年"],
          axisLabel: {
            color: "#fff",
            fontSize: 10,
          },
          interval: 0,
          startValue: 0, // 从头开始。
          endValue: 7,
          boundaryGap: false,

          splitLine: {
            show: true,
            lineStyle: {
              type: "dashed",
              color: "rgba(255, 255, 255, 0.60)",
            },
          },
        },
        yAxis: {
          type: "value",
          name: "单位：亿元",
          axisLabel: {
            color: "#666",
            fontSize: 12,
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: "dashed",
              color: "rgba(255, 255, 255, 0.60)",
            },
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: "rgba(255, 255, 255, 0.60)",
            },
          },
        },
        series: [
          {
            name: "全国",
            data: [7346.0, 7069.8, 8265.5, 6823.5, 6755.0],
            type: "line",
            smooth: false,
            // symbol: "none",
            itemStyle: {
              color: "#00FFF7",
            },
            areaStyle: {
              // 设置线条下方区域的渐变颜色
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: "#00FFF7" },
                  { offset: 1, color: "transparent" },
                ],
              },
            },
          },
          {
            name: "赣州",
            data: [1800.0, 2000.8, 2300.0, 2515.0, 2700.0],
            type: "line",
            smooth: false,
            // symbol: "none",
            itemStyle: {
              color: "#257FF8",
            },
            areaStyle: {
              // 设置线条下方区域的渐变颜色
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: "#257FF8" },
                  { offset: 1, color: "transparent" },
                ],
              },
            },
          },
        ],
      },
    };
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
          this.getCompanyList(newValue);
          this.getLineData(newValue);
          this.chartOptionRing = [];

          setTimeout(() => {
            this.chartOptionRing = this.typesJson[this.typeName];
          }, 500);
        }
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    this.getCompanyList();
    this.chartOptionRing = this.typesJson["modern"];
  },

  methods: {
    bindTab(url) {
      this.$router.push("/numIntelligence" + url);
    },

    getMapThree(val, index) {
      this.type = val;
      this.getCompanyList(this.industry, val, this.region);
    },
    getLineData(data) {
      this.chartOptions.series[0].data =
        data.name == "现代家居"
          ? [7346, 7069.8, 8265.5, 6823.5, 6755]
          : data.name == "生物医药"
          ? [19510.7, 25053.6, 29583, 26384.5, 25009.1]
          : data.name == "有色金属和新材料"
          ? [53968.9, 54229.8, 70256.6, 73117.5, 76411]
          : data.name == "新能源和新能源汽车"
          ? [148530.9, 150659.4, 167137.1, 183219.7, 199664.3]
          : data.name == "纺织服装"
          ? [15617.8, 13868.6, 15291.6, 12938.5, 11977.2]
          : data.name == "绿色食品"
          ? [19510.7, 19311.9, 21619.6, 20282.2, 21142.5]
          : data.name == "电子信息"
          ? [111872.9, 123808, 147051.9, 154606.6, 152540.6]
          : [7346, 7069.8, 8265.5, 6823.5, 6755];
      this.chartOptions.series[1].data =
        data.name == "现代家居"
          ? [1800, 2000, 2300, 2515, 2700]
          : data.name == "生物医药"
          ? [71.7, 80.1, 99.1, 35.4, 37.2]
          : data.name == "有色金属和新材料"
          ? [606.4, 551.5, 716.1, 76.3, 1230.8]
          : data.name == "新能源和新能源汽车"
          ? [58.6, 66.6, 74.7, 76.3, 138.8]
          : data.name == "纺织服装"
          ? [141.9, 173.6, 201.6, 225, 107.8]
          : data.name == "绿色食品"
          ? [26.9, 29.8, 33.5, 37.1, 39]
          : data.name == "电子信息"
          ? [367, 392.2, 516.1, 788.2, 898.5]
          : [1800, 2000, 2300, 2515, 2700];

      this.strength.county = [
        this.chartOptions.series[0].data[0],
        this.chartOptions.series[0].data[4],
        data.name == "现代家居"
          ? -2.1
          : data.name == "生物医药"
          ? 6.4
          : data.name == "有色金属和新材料"
          ? 9.1
          : data.name == "新能源和新能源汽车"
          ? 7.7
          : data.name == "纺织服装"
          ? -6.4
          : data.name == "绿色食品"
          ? 2
          : data.name == "电子信息"
          ? 8.1
          : -2.1,
      ];
      this.strength.city = [
        this.chartOptions.series[1].data[0],
        this.chartOptions.series[1].data[4],
        data.name == "现代家居"
          ? 10.7
          : data.name == "生物医药"
          ? -15.1
          : data.name == "有色金属和新材料"
          ? 19.4
          : data.name == "新能源和新能源汽车"
          ? 24.1
          : data.name == "纺织服装"
          ? -6.6
          : data.name == "绿色食品"
          ? 9.7
          : data.name == "电子信息"
          ? 25.1
          :  10.7
      ];
    },
    bindChangeRegion(region) {
      this.region = region;
      this.getCompanyList(this.industry, this.type, region);
    },
    getCompanyList(data, type, region) {
      this.threeList =[]
      this.$request
        .get(Api.getcompanymap, {
          params: {
            industry: data ? data.name : "现代家居",
            keyword: this.searchText,
            type: type ? type : "规上企业",
            region: region ? region : "全国",
          },
        })
        .then((res) => {
          if (res.code == 0) {
            this.industry_lists = res.data.industry_lists;
            this.list = res.data.types;
            this.threeList = res.data.list;
            this.total = res.data.list.length;

            if (res.data.list) {
              this.allCompanyList = res.data.list;

              // this.chartOptionRing=res.data.types
              this.getMap(type ? type : this.list[0].type, 0);
            } else {
              this.isMap = true;
              this.allCompanyList = [];

              this.chartOption.data = [];
            }
          }
        });
    },

    getMap(type, classify) {
      this.isMap = false;
      this.chartOption.data = [];

      if (this.threeList && this.threeList.length > 0) {
        this.threeList.forEach((item) => {
          this.chartOption.data.push({
            type: "Feature",
            properties: {
              name: item.company_name,
              address: item.company_name,
              type: 0,
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
  // background-color: #111b34;
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
      .container-left-content {
        width: 25.75rem;
        height: auto;
        position: relative;
        .empty-top {
          height: 2.375rem;
        }
        .container-left-content-title {
          width: 21.375rem;
          height: 3.625rem;
          position: absolute;
          top: 0;
          text-align: center;
          background: url("../../../assets/images/numIntelligence/icon1.png")
            no-repeat center;
          background-size: 100% 100%;
          margin-left: -1.25rem;
          .container-left-content-title-text {
            width: 21rem;
            height: 1.2375rem;
            font-size: 0.875rem;
            color: #ffffff;
            margin-left: 4.375rem;
            padding-top: 0.2rem;
          }
        }
        .content-box {
          margin-left: 1.25rem;
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
              text-align: left;
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
            height: 15rem;
            background: url("../../../assets/images/numIntelligence/bg2.png")
              no-repeat center;
            background-size: 100% 100%;
            position: relative;

            .chanzhi-box {
              width: 25.75rem;
              height: 100%;
              position: relative;
              .chanzhi-box-item1 {
                position: absolute;
                bottom: 1rem;
                left: 1rem;
                display: flex;
                align-items: center;
                .chanzhi-item1-left {
                  width: 2rem;
                  height: 2rem;
                  background: url("../../../assets/images/numIntelligence/icon6.png")
                    no-repeat bottom left;
                  background-size: 100% 100%;
                  margin-right: 6px;
                }
                .chanzhi-item1-right {
                  width: 12.8rem;
                  height: 2.1875rem;
                  background: url("../../../assets/images/numIntelligence/icon4.png")
                    no-repeat bottom;
                  background-size: 100% 24px;
                  display: flex;

                  .text-box {
                    width: 6rem;
                  }
                  .item1-text1 {
                    font-size: 1.25rem;
                    line-height: 1rem;
                    font-weight: 800;
                    background: linear-gradient(
                      90.00000000000006deg,
                      #ffffff 33%,
                      #afacfc 100%
                    );
                    text-shadow: 0.5625rem 0.4375rem 0rem rgba(0, 0, 0, 0.25);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                  }
                  .item1-text2 {
                    font-size: 0.625rem;
                    color: #ffffff;
                    text-shadow: 0.5625rem 0.4375rem 0rem rgba(0, 0, 0, 0.25);
                  }
                  .chanzhi-item1-year {
                    font-size: 10px;
                    color: #757489;
                    margin-top: 1rem;
                  }
                }
              }
              .chanzhi-box-item2 {
                position: absolute;
                bottom: 2rem;
                left: 8rem;
                width: 5.2rem;
                height: 10.5rem;
                background: url("../../../assets/images/numIntelligence/icon5.png")
                  no-repeat center;
                background-size: 100% 100%;
                transform: rotate(30deg);
              }

              .chanzhi-box-item2.up {
                background: url("../../../assets/images/numIntelligence/up.png")
                  no-repeat center;
                background-size: 100% 100%;
              }
              .chanzhi-box-item4 {
                position: absolute;
                top: 1rem;
                right: 0.6rem;
                display: flex;
                .chanzhi-item1-left {
                  width: 2rem;
                  height: 2rem;
                  background: url("../../../assets/images/numIntelligence/icon7.png")
                    no-repeat center;
                  background-size: 100% 100%;
                  margin-right: 6px;
                }
                .chanzhi-item1-right {
                  width: 12.8rem;
                  height: 2.1875rem;
                  background: url("../../../assets/images/numIntelligence/icon3.png")
                    no-repeat bottom;
                  background-size: 100% 24px;
                  display: flex;
                  .text-box {
                    width: 6rem;
                  }
                  .item1-text1 {
                    font-size: 1.25rem;
                    line-height: 1rem;
                    font-weight: 800;
                    background: linear-gradient(
                      90.00000000000006deg,
                      #ffffff 33%,
                      #acfcf6 100%
                    );
                    text-shadow: 0.5625rem 0.4375rem 0rem rgba(0, 0, 0, 0.25);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                  }
                  .item1-text2 {
                    font-size: 0.625rem;
                    color: #ffffff;
                    text-shadow: 0.5625rem 0.4375rem 0rem rgba(0, 0, 0, 0.25);
                  }
                  .chanzhi-item1-year {
                    font-size: 10px;
                    color: #757489;
                    margin-top: 1rem;
                  }
                }
              }
              .chanzhi-box-item3 {
                position: absolute;
                bottom: 3.2rem;
                right: 3.5rem;
                .content-box-img {
                  width: 7.5625rem;
                  height: 5.2rem;
                  background: url("../../../assets/images/numIntelligence/icon9.png")
                    no-repeat center;
                  background-size: 100% 100%;
                  .content-box-img-item {
                    display: flex;
                    justify-content: center;
                    margin: auto;
                    .content-box-img-text {
                      font-size: 3.125rem;
                      color: #26fdf0;
                      font-weight: 600;

                      text-shadow: 0px 0px 8px #67b2ff;
                      margin-top: -1.8rem;
                    }
                    .content-box-img-unit {
                      font-size: 1.25rem;
                      color: #26fdf0;

                      margin-left: 0.625rem;
                      margin-top: 1.875rem;
                    }
                  }
                  .content-box-img-desc {
                    font-size: 0.875rem;
                    color: #ffffff;
                    text-align: center;
                  }
                }
              }
            }
          }
        }
        .content-left-bottom {
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
                padding: 2.5rem 0;
                background: transparent;
                .image-box-item2 {
                  width: 5.8rem;
                  height: 9.1875rem;
                  background: url("../../../assets/images/numIntelligence/bg7.png")
                    no-repeat center;
                  background-size: 100% 100%;
                  text-align: center;
                  .text1 {
                    margin-top: 1.6rem;
                    font-weight: 600;
                    font-size: 1.625rem;
                    line-height: 1.75rem;

                    background-image: linear-gradient(
                      to bottom,
                      #ffffff 0%,
                      #44baff 100%
                    );
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                  }
                  .text2 {
                    font-size: 0.75rem;
                    color: #ffffff;
                    margin-top: 1.2rem;
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
        .location {
          width: 4.375rem;
          height: 1.5rem;
          line-height: 1.5rem;
          position: absolute;
          left: 10px;
          top: 10px;
          background: url("../../../assets/images/numIntelligence/icon46.png")
            no-repeat center;
          background-size: 100% 100%;
          color: #fff;
          text-align: center;
          font-size: 0.875rem;
        }
      }
    }
    .container-middle {
      // width: 57.5625rem;
      // height: 50rem;
      position: relative;
      padding-top: 5.625rem;
      .map {
        width: 65.3125rem;
        height: 47.8125rem;
        margin: 0 auto;
        background: url("../../../assets/images/numIntelligence/bg9.png")
          no-repeat center 80%;
        background-size: 60% auto;
      }
      .middle-tips {
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
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
          border: 1px solid;
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
      .container-middle-content {
        width: 57.5625rem;
        height: 100%;
        .map-content {
          width: 100%;
          height: 80%;
          margin-bottom: 6rem;
          position: relative;
          .map-bg {
            width: 57.5rem;
            height: 18.75rem;
            background: url("../../../assets/images/numIntelligence/bg9.png")
              no-repeat center;
            background-size: 100% 100%;
            position: absolute;
            bottom: 0;
          }
        }
      }
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
              height: 4.375rem;
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
                font-size: 1rem;
                color: #ffffff;
                font-weight: 500;
                margin-top: -0.625rem;
              }
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
          width: 29rem;
          height: 3.625rem;
          text-align: center;
          background: url("../../../assets/images/numIntelligence/icon30.png")
            no-repeat center;
          background-size: 100% 100%;
          position: absolute;
          top: 0;
          right: 0;
          .container-right-content-title-text {
            width: 25rem;
            height: 1.2375rem;
            font-size: 0.875rem;
            color: #ffffff;
            margin-left: -1rem;
            padding-top: 0.5rem;
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
              text-align: left;
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
            .line-box {
              width: 25.75rem;
              height: auto;
              .line-box-item {
                width: 23.75rem;
                height: auto;
                margin: 0.5rem auto;
                .line-box-item-title {
                  width: 23.75rem;
                  height: auto;
                  font-size: 0.75rem;
                  color: rgba(255, 255, 255, 0.72);
                }
                .line-box-item-content {
                  width: 23.75rem;
                  height: auto;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  .line-box-item-bg {
                    width: 20rem;
                    height: 1rem;
                    flex-shrink: 0;
                    background: url("../../../assets/images/numIntelligence/icon35.png")
                      no-repeat center;
                    background-size: 100% 100%;
                    margin-top: 0.2rem;
                    .progress-bar {
                      width: 100%;
                      // background-color: #e0e0e0;
                      border-radius: 4px;
                      overflow: hidden;
                      .progress {
                        width: 50%; /* 进度条的初始宽度，可以根据需要更改 */
                        height: 1rem;
                        background: linear-gradient(
                          180deg,
                          rgba(39, 141, 189, 1) 0%,
                          rgba(100, 172, 204, 1) 100%
                        );
                        border-radius: 4px;
                        transition: width 1s ease-in-out; /* 进度条变化的动画效果 */
                      }
                    }
                  }
                  .line-box-item-text {
                    // flex: 1;
                    width: 50px;
                    flex-shrink: 0;

                    font-size: 0.75rem;
                    color: #c3d3e2;
                    text-align: left;
                    margin-top: 0.2rem;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                    margin-left: 3px;
                  }
                }
              }
            }
            .content-box-image {
              width: 25rem;
              height: auto;
              .content-box-image-box {
                width: 25rem;
                display: flex;
                justify-content: space-around;
                margin-top: 1.375rem;
                padding-bottom: 0.2rem;
                .image-box-item {
                  width: 6.5rem;
                  height: 6rem;
                  background: url("../../../assets/images/numIntelligence/icon10.png")
                    no-repeat center;
                  background-size: 100% 100%;
                  .text2 {
                    width: 95%;
                    text-align: center;

                    font-size: 0.75rem;
                    color: #ffa600;
                    margin-top: 0.625rem;
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

.margin-bottom {
  margin-bottom: 0.8125rem;
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
