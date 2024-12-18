<template>
  <div class="numIntelligence-bg">
    <!-- <div class="search-box">
      <div class="search">
        <input placeholder="请输入搜索内容" v-model="searchText" @keyup.enter="bindChangenput" />
      </div>
    </div> -->
    <div class="table-content">
      <div class="table-left">
        <div class="classify-ul">
          <!-- <div class="right-border"></div> -->
          <div
            class="classify-list"
            v-for="(item, index) in industryList"
            :key="index"
            :class="index == activeLevel&&isThree ? 'active' : ''"
            
          >
            <div class="classify-title" @click.stop="bindChangeList(index)">{{ item }}</div>
            <div class="classify-right" @click.stop="bindChangeList(index)">
              <div class="text">
                {{
                  index == 0
                    ? "53053家"
                    : index == 1
                    ? "909154家"
                    : index == 2
                    ? "719个"
                    : "28598人"
                }}
              </div>
              <div class="shadow">
                {{
                  index == 0
                    ? "53053家"
                    : index == 1
                    ? "909154家"
                    : index == 2
                    ? "719个"
                    : "28598人"
                }}
              </div>
            </div>

            <div class="three-ul" v-if="index == activeLevel&&isThree">
              <div
                class="three-list text-cut"
                v-for="(opt, i) in typeList"
                :key="i"
                :class="opt.type == activeThree? 'active' : ''"
                @click.stop="getMapThree(opt.type, i)"
              >
                <span>{{ opt.type }}</span>
                <span>{{ opt.num }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="table-right">

        <div class="map">
          <!--   v-if="isMap && chartOption.data.length" -->
          <echartMap
            width="100vw"
            height="55.8125rem"
            chartId="map1"
            :chartOption="chartOption"
          
            :zoom="4.5"
            :type="1"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Api from "@/plugins/api";
import echartMap from "../components/echart-map.vue";
import geoJson from "../../../assets/json/national.json";
import { mapState } from "vuex";
export default {
  layout: "intelligence",
  components: {
    echartMap,
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
      industryList: [
        "优质企业名单",
        "全国发明专利",
        "创新技术载体",
        "人才聚集发展",
      ],
      activeTab: 4,
      activeIndex: 0,
      tableData: [],
      page: 1,
      pageSize: 20,
      chartOption: { data: [], geoJson, data2: [] },
      activeLevel: 0,
      secondList: [],
      activeSecond: 0,
      threeList: [],
      activeThree: "",
      isMap: false,
      typeList: [],
      isSecond: false,
      isThree: false,
      searchText: "",
      allType: "",
      allCompanyList: [],
      secondSelect: {},
      selectNum: 0,
    };
  },
  computed: {
    ...mapState(["numTab"]),
  },
  watch: {
    // numTab(newValue, oldValue) {
    // this.allType=newValue.name;
    // this.isSecond=false;
    // this.isThree=false;
    // this.getCompanyList(newValue.name);
    // this.bindChangeList(this.activeLevel,newValue.name)
    // },
    // chartOption(newValue, oldValue) {
    //   console.log(222)
    // },
  },
  mounted() {
    this.getCompanyList();
    window.map=null;
  },

  methods: {
    bindChangeList(index) {
      this.activeLevel = index;
      if (index == 0) {
        this.getCompanyList();
      } else if (index == 1) {
        this.getPatentmap();
      } else if (index == 2) {
        this.getorgmap();
      } else if (index == 3) {
        this.gettalentmap();
      }
      this.isSecond = true;
      this.activeIndex = 0;
    },
    getSecondSelect(data) {
      this.activeIndex = 0;
      if (this.activeLevel == 0) {
        this.getCompanyList(data);
      } else if (this.activeLevel == 1) {
        this.getPatentmap(data);
      } else if (this.activeLevel == 2) {
        this.getorgmap(data);
      } else if (this.activeLevel == 3) {
        this.gettalentmap(data);
      }
      this.isSecond = true;
    },
    getMapThree(val, index) {
      this.activeIndex = index;
      if (this.activeLevel == 0) {
        this.getCompanyList(this.secondSelect, val);
      } else if (this.activeLevel == 1) {
        this.getPatentmap(this.secondSelect, val);
      } else if (this.activeLevel == 2) {
        this.getorgmap(this.secondSelect, val);
      } else if (this.activeLevel == 3) {
        this.gettalentmap(this.secondSelect, val);
      }
    },
    getCompanyList(data, type) {
      if (data) {
        this.secondSelect = data;
        this.activeSecond = data.id;
      }
      this.typeList = [];

      this.$request
        .get(Api.getcompanymap, {
          params: {
            industry: data ? data.name : "",
            keyword: this.searchText,
            type: type ? type : "",
          },
        })
        .then((res) => {
          if (res.code == 0) {
            this.secondList = res.data.industry_lists;
            this.typeList = res.data.types ? res.data.types : [];
            if (res.data.list && res.data.list.length > 0) {
              this.allCompanyList = res.data.list;

              this.selectNum = res.data.list.length;
              this.getMap(type ? type : this.typeList[0].type);
            } else {
              this.allCompanyList = [];
              this.chartOption.data = [];
              this.isMap = true;
            }

           

            if (data) {
              this.activeSecond = data.id;
            } else {
              this.activeSecond = res.data.industry_lists[0].id;
            }
          }
          if (this.isSecond) {
              this.isThree = true;
            }
        });
    },

    getMap(type, classify) {
      this.isMap = false;
      this.activeThree = type;
      // this.chartOption={}
      this.chartOption.data = [];
      this.chartOption.data2 = [];
      this.threeList = [];
      // console.log(type,this.allCompanyList)
      if (classify) {
        this.threeList = this.allCompanyList.filter(
          (item) => item.type == type
        );
      } else {
        this.threeList = this.allCompanyList;
      }
      if (this.threeList && this.threeList.length > 0) {
        this.threeList.forEach((item) => {
          this.chartOption.data.push({
            type: "Feature",
            properties: {
              name: item.company_name,
              address: item.company_name,
              type: this.activeLevel,
            },
            geometry: { type: "Point", coordinates: [item.lng, item.lat] },
          });
        });

        this.isMap = true;
      } else {
        this.isMap = true;
      }
    },

    getPatentmap(data, type) {
      if (data) {
        this.secondSelect = data;
        this.activeSecond = data.id;
      }
      this.typeList = [];
      this.isMap = false;
      this.$request
        .get(Api.getPatentmap, {
          params: {
            industry: data ? data.name : "",
            region: "",
            type: type ? type : "",
          },
        })
        .then((res) => {
          // this.chartOption.data = [];
          if (res.code == 0) {
            this.secondList = res.data.industry_lists;
            this.typeList = res.data.types ? res.data.types : [];

            if (res.data.list && res.data.list.length > 0) {
              this.allCompanyList = res.data.list;
              this.getMap(type ? type : this.typeList[0].type);
              this.selectNum = res.data.list.length;
            } else {
              this.allCompanyList = [];
              this.chartOption.data = [];
              this.isMap = true;
            }
            if (this.isSecond) {
              this.isThree = true;
            }
            if (data) {
              this.activeSecond = data.id;
            } else {
              this.activeSecond = res.data.industry_lists[0].id;
            }
          }
        });
    },
    getorgmap(data, type) {
      if (data) {
        this.secondSelect = data;
        this.activeSecond = data.id;
      }
      this.typeList = [];
      this.isMap = false;
      this.$request
        .get(Api.orgmap, {
          params: {
            industry: data ? data.name : "",
            region: "",
            keyword: this.searchText,
            type: type ? type : "",
          },
        })
        .then((res) => {
          // this.chartOption.data = [];
          if (res.code == 0) {
            this.secondList = res.data.industry_lists;
            // this.typeList=res.data.types;
            this.typeList = res.data.types ? res.data.types : [];
            if (res.data.list && res.data.list.length > 0) {
              this.allCompanyList = res.data.list;
              this.getMap(type ? type : this.typeList[0].type);
              this.selectNum = res.data.list.length;
            } else {
              this.allCompanyList = [];
              this.chartOption.data = [];
              this.isMap = true;
            }
            if (this.isSecond) {
              this.isThree = true;
            }
            this.$forceUpdate();
            if (data) {
              this.activeSecond = data.id;
            } else {
              this.activeSecond = res.data.industry_lists[0].id;
            }
          }
        });
    },
    gettalentmap(data, type) {
      if (data) {
        this.secondSelect = data;
        this.activeSecond = data.id;
      }
      this.typeList = [];
      this.isMap = false;
      this.$request
        .get(Api.talentmap, {
          params: {
            industry: data ? data.name : "",
            region: "",
            keyword: this.searchText,
            type: type ? type : "",
          },
        })
        .then((res) => {
          this.chartOption.data = [];
          if (res.code == 0) {
            this.secondList = res.data.industry_lists;
            this.typeList = res.data.types ? res.data.types : [];
            if (res.data.list && res.data.list.length > 0) {
              this.allCompanyList = res.data.list;
              this.getMap(type ? type : this.typeList[0].type);
              this.selectNum = res.data.list.length;
            } else {
              this.allCompanyList = [];
              this.isMap = true;
            }
            if (data) {
              this.activeSecond = data.id;
            } else {
              this.activeSecond = res.data.industry_lists[0].id;
            }
          }
        });
    },

    bindChangenput(val) {
      this.bindChangeList();
    },
    getIndustryPage(id) {
      this.$request
        .get(Api.industryPage, {
          params: {
            industry_id: 1,
            first_cate_id: id,
            page: this.page,
            pageSize: this.pageSize,
          },
        })
        .then((res) => {
          // if (res.code === 0) {
          this.tableData = res.data.data;
          this.total = res.data.total;
          // }
        });
    },
    gotoDetails(id) {
      this.$request.get(Api.industryGetails, {
        params: { id: id },
      });
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
.search-box {
  padding: 0.75rem 0 1.25rem;
  .search {
    width: 42.5rem;
    height: 3.125rem;
    display: flex;
    align-items: center;
    justify-content: center;

    box-sizing: border-box;
    margin: 0 auto;
    cursor: pointer;
    background: rgba(20, 44, 78, 0.7);
    box-shadow: inset 0px 0px 7px 0px #008bfd;
    border-radius: 2px;
    padding: 0 1rem;
    input {
      display: block;
      width: 100%;
      line-height: 3.125rem;
      background: transparent;
      outline: none;
      border: none;
      color: #fff;
      font-size: 1rem;
    }
  }
}

.table-content {
  height: 55.8125rem;
  margin: 0 auto;
  background: url("../../../assets/images/numIntelligence/bg.png") no-repeat 0 0;
  background-size: 100% 100%;
  padding: 0.625rem;
  box-sizing: border-box;
  // display: flex;
  position: relative;
  .table-left {
    // width: 100vw;
    // padding: 0 0.8125rem;
    // flex-shrink: 0;
    // position: absolute;
    .classify-ul {
      width: 100vw;
      height: 3.125rem;
      position: absolute;
      z-index: 99;
      top: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;

      .classify-list {
        width: 22.5rem;
        height: 3.125rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: url("../../../assets/images/numIntelligence/bottom.png")
          no-repeat 0 0;
        background-size: 100% 100%;
        margin-right: 2rem;
        position: relative;
        cursor: pointer;
        padding-left: 10px;
        box-sizing: border-box;
        .classify-title {
          font-size: 1.25rem;
          color: #fff;
          text-align: center;
        }
        .classify-right {
          // width: 9.2rem;
          flex: 1;
          position: relative;
          text-align: right;
        }
      }
      .classify-list.active {
        background: url("../../../assets/images/numIntelligence/icon43.png")
          no-repeat 0 0;
        background-size: 100% 100%;
      }

      .classify-list.active::before {
        content: "";
        display: block;
        width: 1.6875rem;
        height: 1.6875rem;
        background: url("../../../assets/images/numIntelligence/icon42.png")
          no-repeat 0 0;
        background-size: 100% 100%;
        position: absolute;
        right: -1.5rem;
        top: 50%;
        transform: translateY(-50%) rotate(90deg);
      }

      .text {
        width: 100%;
        line-height: 3.125rem;
        letter-spacing: 0.2rem;
        font-size: 1.625rem;
        text-align: right;
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
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 1;
      }
      .shadow {
        width: 100%;
        line-height: 3.125rem;
        color: #2daeef;
        letter-spacing: 0.2rem;
        text-align: right;
        font-size: 1.625rem;
        font-weight: bold;
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 0;
        text-shadow: 5px 0px 10px #17498b;
      }

      .three-ul {
        width:  22.5rem;
        height: 28rem;
        overflow-y: scroll;
        position: absolute;
        left: 0;
        top: 3.2rem;
        z-index: 9999;

        .three-list {
          line-height: 2rem;
          font-size: 1rem;
          text-align: center;
          color: #fff;
          background:rgba(0,25,52,0.5) url("../../../assets/images/numIntelligence/tab7.png")
            no-repeat 0 0;
          background-size: 100% 100%;
          cursor: pointer;
          position: relative;
        }
        .three-list.active {
          background: rgba(0,25,52,0.5) 
            url("../../../assets/images/numIntelligence/tab8.png") no-repeat 0
            0;
          background-size: 100% 100%;
        }
      }
    }
  }

  .table-right {
    width: 100vw;
    height: 100%;
    padding-left: 0.8125rem;
    box-sizing: border-box;
    position: relative;
    .second-ul {
      width: 11.5625rem;
      position: absolute;
      left: 1.25rem;
      top: 1.25rem;
      z-index: 9999;

      .second-list {
        line-height: 2rem;
        font-size: 1rem;
        text-align: center;
        color: #fff;
        margin-bottom: 0.625rem;
        background: url("../../../assets/images/numIntelligence/tab6.png")
          no-repeat 0 0;
        background-size: 100% 100%;
        cursor: pointer;
        position: relative;
      }
      .second-list.active {
        background: url("../../../assets/images/numIntelligence/tab5.png")
          no-repeat 0 0;
        background-size: 100% 100%;
      }
      .second-list.active::before {
        content: "";
        display: block;
        width: 0;
        height: 0;
        border-left: 0.4rem solid #fff;
        border-top: 0.4rem solid transparent;
        border-bottom: 0.4rem solid transparent;
        position: absolute;
        right: 1rem;
        top: 0.7rem;
      }
    }

    .map {
      width: 100vw;
      height: 47.8125rem;
      margin: 0 auto;
      background: url("../../../assets/images/numIntelligence/bg9.png")
        no-repeat center bottom;
      background-size: 50% auto;
    }
  }
}

.text-cut {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.screen-dialog {
  width: 100%;
}
.pre {
  cursor: pointer;
  color: rgba(37, 127, 248, 1);
  text-decoration: underline;
}
.info {
  width: 23.125rem;
  height: 7.375rem;
  z-index: 999;
  background: url(../../../assets/images/numIntelligence/box.png) no-repeat 0 0;
  background-size: 100% 100%;
  position: fixed;
  right: 1.25rem;
  top: 4.25rem;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.215rem;
  padding: 0 2.5rem;
  box-sizing: border-box;
}
.info .num {
  font-size: 2rem;
  font-family: YouSheBiaoTiHei, YouSheBiaoTiHei;
  font-weight: 400;
}
.three-ul {
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
.screen-dialog .el-table {
  background: rgba(6, 18, 36, 0.2);
  --el-table-border-color: rgba(6, 18, 36, 0.2);
}
.screen-dialog .el-table .el-table__row {
  background: rgba(6, 18, 36, 0.2);
}

.screen-dialog .el-table .el-table__header th {
  background: #0a1f35 !important;
  color: #fff;
  border: 1px solid rgba(6, 18, 36, 0.5);
}

.screen-dialog .el-table__body {
  color: #fff !important;
}
.screen-dialog .el-table__body-wrapper tr:hover > td {
  background-color: rgba(250, 248, 248, 0.226) !important;
}
.screen-dialog .el-table.el-table--fit::before {
  background: rgba(6, 18, 36, 0.5);
}
.screen-dialog .el-table td.el-table__cell {
  border-bottom: 1px solid rgba(30, 134, 255, 0.1);
}

.amap-logo{
       display: none;
       opacity:0 !important;
       }
       .amap-copyright {
           opacity:0;
       }

</style>

