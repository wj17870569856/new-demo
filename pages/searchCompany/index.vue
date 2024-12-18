<template>
  <div>
    <NavSearch
      :is-use-list="true"
      :show-list="false"
      @navSearch="navSearchCompany"
      ref="navSearch"
      :keywordArr="keywordArr"
    ></NavSearch>
    <div class="mian">
      <!--       <div class="sort-bar">
            <div class="sort-row">
             <ul class="sorts">
                <li class="sort blue-btn">综合</li>
               <li class="sort map">地图</li>
                <li class="sort">
                  <el-dropdown>
                    <span class="el-dropdown-link">
                      公司位置<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item icon="el-icon-plus"
                        >华南
                      </el-dropdown-item>
                      <el-dropdown-item icon="el-icon-circle-plus"
                        >华北
                      </el-dropdown-item>
                      <el-dropdown-item icon="el-icon-circle-plus-outline"
                        >华中
                      </el-dropdown-item>
                      <el-dropdown-item icon="el-icon-check"
                        >东北
                      </el-dropdown-item>
                      <el-dropdown-item icon="el-icon-circle-check"
                        >西北
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </li>
                <li class="sort">
                  <el-dropdown>
                    <span class="el-dropdown-link">
                      商品<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item icon="el-icon-plus"
                        >黄金糕
                      </el-dropdown-item>
                      <el-dropdown-item icon="el-icon-circle-plus"
                        >狮子头
                      </el-dropdown-item>
                      <el-dropdown-item icon="el-icon-circle-plus-outline"
                        >螺蛳粉
                      </el-dropdown-item>
                      <el-dropdown-item icon="el-icon-check"
                        >双皮奶
                      </el-dropdown-item>
                      <el-dropdown-item icon="el-icon-circle-check"
                        >蚵仔煎
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </li>
                <li class="sort">
                  <el-dropdown>
                    <span class="el-dropdown-link">
                      公司类型<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item icon="el-icon-plus"
                        >黄金糕
                      </el-dropdown-item>
                      <el-dropdown-item icon="el-icon-circle-plus"
                        >狮子头
                      </el-dropdown-item>
                      <el-dropdown-item icon="el-icon-circle-plus-outline"
                        >螺蛳粉
                      </el-dropdown-item>
                      <el-dropdown-item icon="el-icon-check"
                        >双皮奶
                      </el-dropdown-item>
                      <el-dropdown-item icon="el-icon-circle-check"
                        >蚵仔煎
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </li>
              </ul>
            </div>
          </div> -->
      <div class="company-wrapper">
        <div class="left">
          <ul>
            <li
              v-for="(item, index) in directive"
              :key="index"
              class="company-li"
              @click="gotoDetail(item.id)"
            >
              <img
                :src="item.logo !== '' ? item.logo_url : defaultImg"
                class="company-logo"
              />
              <div class="company-info">
                <div class="title">
                  <span class="tag">
                    <span v-if="item.store_level == 0" class="ziying">
                      自营
                    </span>
                    <!-- <svg-icon v-if="item.store_level == 1" icon-class="lv1" />
                    <svg-icon v-if="item.store_level == 2" icon-class="lv2" />
                    <svg-icon v-if="item.store_level == 3" icon-class="lv3" /> -->
                    <img
                      v-if="item.store_level == 1"
                      :src="lv1"
                      alt="LV1"
                      class="level-img"
                    />
                    <img
                      v-if="item.store_level == 2"
                      :src="lv2"
                      alt="LV2"
                      class="level-img"
                    />
                    <img
                      v-if="item.store_level == 3"
                      :src="lv3"
                      alt="LV3"
                      class="level-img"
                    />
                  </span>
                  <span class="name">{{ item.company_name }}</span>
                  <span class="tag-loca">
                    <svg-icon icon-class="location_icon" />{{
                      item.province_city_district[0] +
                      item.province_city_district[1]
                    }}
                  </span>
                </div>
                <div class="main-sale">主营：{{ item.main_product }}</div>
                <div class="star">
                  <!-- <span class="tag-loca">
                    <svg-icon icon-class="star_full_icon" /> </span
                  >5014人收藏店铺 -->
                </div>
              </div>
              <div
                class="star-it"
                :class="item.is_collect ? 'yellow' : ''"
                @click.stop="likeCom(item)"
              >
                <span v-show="!item.is_collect" class="tag-star">
                  <svg-icon icon-class="star_empty_icon" />
                  <span>收藏</span>
                </span>
                <span v-show="item.is_collect" class="tag-star like">
                  <svg-icon icon-class="star_full_icon" />
                  <span>已收藏</span>
                </span>
              </div>
            </li>
          </ul>
          <!--  分页    -->
          <el-pagination
            :current-page="page"
            :page-size="limit"
            layout="prev, pager, next, jumper"
            :total="total"
            style="margin-top: 20px"
            @size-change="handleSizeChange"
            @current-change="choosePage"
          >
          </el-pagination>
        </div>
        <div class="right">
          <div v-show="false" class="new-msg">
            <div class="sub-title">最新供应信息</div>
            <div class="list">
              <vue-seamless-scroll
                :data="demandData"
                :class-option="virtualListOption"
              >
                <ul class="ul-scroll">
                  <li v-for="(item, i) in demandData" :key="i">
                    <el-tag size="mini" :type="item.tagType"
                      >{{ item.tag }}
                    </el-tag>
                    <span>{{ item.msg }}</span>
                  </li>
                </ul>
              </vue-seamless-scroll>
            </div>
          </div>
          <div class="guess-like">
            <div class="sub-title">猜你喜欢</div>
            <div>
              <ul class="guess-list">
                <li
                  v-for="(guess, i) in guessList"
                  :key="i"
                  @click="gotoProDetails(guess)"
                >
                  <img
                    :src="guess.image_url"
                    alt=""
                    style="width: 48px; height: 48px"
                  />
                  <div style="margin-left: 10px">
                    <p class="name text-ellipsis">{{ guess.name }}</p>
                    <p class="price">
                      <span v-if="guess.sku_shop_price == 0">电议</span>
                      <span v-else
                        >¥{{ guess.sku_shop_price }}/{{ guess.unit_name }}</span
                      >
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import NavSearch from "~/components/NavSearch.vue";
import lv1 from "@/assets/images/level/lv1@2x.png";
import lv2 from "@/assets/images/level/lv2@2x.png";
import lv3 from "@/assets/images/level/lv3@2x.png";
import defaultImg from "@/assets/images/default-img.png";

import Api from "~/plugins/api";
import config from "~/config";
import axios from "axios";

export default {
  name: "DirectSupply",
  // middleware: 'auth',
  components: {
    NavSearch,
  },
  asyncData({ route }) {
    let url = config.baseUrl + Api.getRecommendSearchWordList;
    return axios.all([axios.get(url)]).then(
      axios.spread(function (res) {
        return {
          keywordArr: res.data.data,
        };
      })
    );
  },
  mounted() {
    this.keyword = this.$route.query.keyword;
    this.searchCompanyList();
    this.getIndexData();
  },
  data() {
    return {
      lv1,
      lv2,
      lv3,
      page: 1,
      limit: 20,
      total: 0,
      defaultImg,
      menu: "menu_show",
      transverse: "transverse",
      demandData: [
        {
          tag: "物资",
          tagType: "",
          msg: "因施工需要，需要租用3台2吨的钩机，预计租期：3个，陈先生134****4471",
        },
        {
          tag: "设备",
          tagType: "warning",
          msg: "采购钢材一批，具体型号查看附件",
        },
        {
          tag: "运力",
          tagType: "success",
          msg: "50吨卷板，从广州到浙江，箱式发货，电联136****2257",
        },
        {
          tag: "物资",
          tagType: "",
          msg: "因施工需要，需要租用3台2吨的钩机，预计租期：3个，陈先生134****4471",
        },
        {
          tag: "设备",
          tagType: "warning",
          msg: "采购钢材一批，具体型号查看附件",
        },
        {
          tag: "运力",
          tagType: "success",
          msg: "50吨卷板，从广州到浙江，箱式发货，电联136****2257",
        },
      ],
      directive: [],
      guessList: [],
      keywordArr: [],
    };
  },
  computed: {
    virtualListOption() {
      return {
        step: 0.4, // 数值越大速度滚动越快
        limitMoveNum: 3, // 开始无缝滚动的数据量 this.bbsData.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 1000, // 单步运动停止的时间(默认值1000ms)
      };
    },
  },
  methods: {
    gotoProDetails(pro) {
      window.open(`/productDetails?id=${pro.sku_id}`);
    },
    getIndexData() {
      this.$request.get(Api.shopIndex).then((res) => {
        if (res.code === 0) {
          this.guessList = res.data.goods_list.splice(0, 5);
        }
      });
    },
    /* 分页 */
    choosePage(page) {
      this.page = page;
      this.searchCompanyList();
    },
    /* 条数改变 */
    handleSizeChange(val) {
      this.limit = val;
      this.searchCompanyList();
    },
    /* 刷新资源列表 */
    reload() {
      this.$request
        .get(Api.getDirectiveLists, {
          params: {
            page: this.page,
            limit: this.limit,
          },
        })
        .then((res) => {
          if (res.code === 0) {
            const { data } = { ...res };
            this.total = res.count;
            this.directive = data.map((item) => {
              return { ...item, like: 0 };
            });
          }
        });
    },
    likeCom(item) {
      console.log(item);
      const url =
        item.is_collect === 1
          ? Api.cancelCompanyCollect
          : Api.addCompanyCollect;
      this.$request.get(url, { params: { cid: item.id } }).then((res) => {
        const msg = item.is_collect ? "取消收藏成功" : "收藏成功";
        if (res.code === 0) {
          item.is_collect = !item.is_collect;
          this.$message.success(msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    showListType(value) {
      if (value === 1) {
        this.menu = "menu_show";
        this.transverse = "transverse";
        this.showTransverse = false;
      } else if (value === 2) {
        this.menu = "menu";
        this.transverse = "transverse_show";
        this.showTransverse = true;
      }
    },
    gotoDetail(id) {
      // this.$router.push({ path: '/company', query: { id } })
      const routeUrl = this.$router.resolve({
        path: "/company",
        query: { id },
      });
      window.open(routeUrl.href, "_blank");
    },
    navSearchCompany(keyword) {
      this.keyword = keyword;
      this.searchCompanyList();
    },
    searchCompanyList() {
      if (this.keyword) {
        this.searchNotEmptyCompany();
      } else {
        this.reload();
      }
    },
    searchNotEmptyCompany() {
      this.$request
        .get(Api.searchGetCompanyLists, {
          params: {
            keyword: this.keyword,
            page: this.page,
            pagesize: this.limit,
          },
        })
        .then((res) => {
          if (res.code === 0) {
            this.directive = res.data.data.map((item) => {
              const source = item.source;
              return {
                id: source.id,
                logo: source.logo,
                company_name: source.company_name,
                province_code: source.province_code,
                city_code: source.city_code,
                district_code: source.district_code,
                address: source.address,
                store_type: source.store_type,
                store_level: source.store_level,
                main_product: source.main_product,
                logo_url: source.logo,
                is_collect: source.is_collect,
                province_city_district: source.province_city_district,
              };
            });
            this.total = res.data.total;
          }
        });
    },
  },
};
</script>
<style lang="less" scoped>
.mian {
  width: 1184px;
  margin: 0 auto;
  padding: 8px 0 16px;

  .company-wrapper {
    display: flex;
    justify-content: space-between;
    width: 100%;

    .left {
      width: 884px;
      background: #ffffff;
      border-radius: 0px 0px 2px 2px;

      .company-li {
        padding: 20px 16px;
        position: relative;
        display: flex;

        &:nth-child(even) {
          background-color: rgba(137, 147, 165, 0.06);
        }

        .company-logo {
          width: 80px;
          height: 80px;
        }

        .company-info {
          font-family: Microsoft YaHei, Microsoft YaHei-Regular;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          margin-left: 10px;

          .title {
            font-size: 14px;
            font-weight: 700;
            color: #353535;
            display: flex;
            align-items: center;

            .name {
              margin-right: 40px;
            }

            .tag-loca {
              font-weight: 500;
            }

            .tag {
              // font-size: 26px;
              padding: 0 4px;
              display: flex;
              align-items: center;
            }
          }

          .main-sale {
            font-size: 14px;
            font-weight: 400;
            color: #353535;
            margin: 4px 4px 6px;
          }

          .star {
            font-size: 12px;
            color: #ffb507;
            margin: 0 4px;
          }
        }

        .star-it {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 70px;
          text-align: center;
          height: 24px;
          line-height: 24px;
          background: #ffffff;
          border: 1px solid #d5d5d5;
          border-radius: 4px;
          color: #353535;
          font-size: 12px;
          cursor: pointer;

          &.yellow {
            border: 1px solid #ffb507;
            color: #ffb507;
          }
        }
      }

      :deep(.el-pagination) {
        text-align: center;
        margin-bottom: 20px;
      }
    }

    .right {
      .new-msg {
        width: 284px;
        height: 244px;
        background: #ffffff;
        margin-bottom: 15px;

        .list {
          overflow: hidden;
          height: 200px;

          .ul-scroll {
            li {
              padding: 5px;
              font-size: 14px;
              font-weight: 400;
              color: #353535;
              cursor: pointer;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;

              &:hover {
                color: #2263e8;
              }
            }
          }
        }
      }

      .guess-like {
        width: 284px;
        height: 366px;
        background: #ffffff;
        margin-bottom: 15px;

        .guess-list {
          li {
            padding: 8px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            font-size: 14px;
            color: #353535;

            .name {
              width: 200px;
            }

            .price {
              margin-top: 6px;
              font-size: 14px;
              color: #e84b01;
            }
          }
        }
      }

      .sub-title {
        font-family: Microsoft YaHei, Microsoft YaHei-Regular;
        height: 19px;
        font-size: 14px;
        font-weight: 400;
        text-align: left;
        color: #353535;
        line-height: 18px;
        display: flex;
        align-items: center;
        padding: 9px;
        border: 1px solid #efefef;

        &::before {
          content: "";
          display: block;
          height: 12px;
          border: 2px solid #4186fa;
          margin-right: 5px;
        }
      }
    }
  }
}

.sort-bar {
  background-color: #ffffff;
  margin-bottom: 12px;

  :deep(.el-checkbox__input.is-checked .el-checkbox__inner),
  :deep(.el-checkbox__input.is-indeterminate .el-checkbox__inner) {
    background-color: #2263e8;
    border-color: #2263e8;
  }

  :deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
    color: #2263e8;
  }

  :deep(.el-checkbox__label) {
    padding-left: 4px;
  }

  .sort-row {
    display: flex;
    justify-content: space-between;
    height: 48px;
    padding-right: 20px;

    .sorts {
      font-size: 14px;
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      font-weight: 400;
      text-align: center;

      .sort {
        float: left;
        height: 16px;
        line-height: 16px;
        padding: 16px 32px;
        color: #353535;
      }

      .blue-btn {
        background-color: #2263e8;
        color: #ffffff;
      }

      .price {
        display: flex;
      }
    }

    .list-show {
      height: 16px;
      line-height: 16px;
      padding: 16px 0px;

      svg {
        margin-left: 12px;
      }

      svg:hover {
        cursor: pointer;
      }
    }
  }
}

.level-img {
  width: 32px;
  height: 20px;
}

.ziying {
  display: inline-block;
  width: 40px;
  text-align: center;
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  color: #fff;
  background: linear-gradient(158deg, #2263e8 0%, #35aeff 97%);
  border-radius: 10px;
}
</style>
