<template>
  <div style="background: #fff; box-shadow: 0px 4px 8px 0px rgba(23, 36, 63, 0.1)">
    <div class="nav-search">
      <div class="top">
        <div class="search">
          <div>
            <client-only placeholder="Loading...">
              <el-input @keyup.native.enter="search" v-model="keyword" clearable class="input input-with-select"
                placeholder="搜索竹木">

                <div slot="prepend" class="white-select">
                  <el-select v-model="type" placeholder="请选择" :popper-append-to-body="false">
                    <el-option label="商品" value="1"></el-option>
                    <el-option label="店铺" value="2"></el-option>
                  </el-select>
                </div>
                <template slot="append">
                  <div @click="search">
                    <svg-icon icon-class="search_icon" />
                  </div>
                </template>
              </el-input>
            </client-only>
            <div class="keyword">
              <a style="color: #999" v-for="(keyword, i) in keywordArr" :key="i" :alt="keyword"
                :href="config.link_domain + `/searchresult?keyword=${keyword}`" target="_blank">{{ keyword }}</a>
            </div>
          </div>
        </div>
        <div class="btn-group">

          <a class="shop-cart el-button el-button--default new-style" @click="gotoPurchaseOrder">
            <svg-icon icon-class="cart_new_icon" />
            <span>采购单</span>
            <span class="count">{{ GoodsCartCount || 0 }}</span>
          </a>
          <!--          </client-only>-->
        </div>
      </div>
      <div class="bottom">
        <div class="container" style="width: 1200px;">
          <div class="tabs">
            <div class="tab is-active" @mouseover="isUseList && (isShowList = true)"
              @mouseleave="ShowRightSort(0, [], -1)">
              <svg-icon icon-class="product_icon_new" class-name="product_icon" />
              <span style="display: inline-block; width: 65%; padding-left: 10px" @click="gotoList(-2)">产品中心</span>
              <div class="list">
                <ul v-show="isShowList">
                  <li v-for="(sort, i) in productSortList" :key="i" :class="activeLi == i ? 'active' : ''"
                    @mouseover="ShowRightSort(1, sort, i)">
                    <div style="display: flex; align-items: center;justify-content: space-between;">
                      <div>
                        <span>{{ sort.name }}</span>
                      </div>

                      <span>
                        <svg-icon :svgStyle="'transform: scale(.8)'" icon-class="allow-right-banner" />
                      </span>
                    </div>
                    <div>
                      <div v-html="sort.keyword" class="subtitle-style" :style="{ opacity: sort.keyword ? 1 : 0 }"></div>
                    </div>


                  </li>
                </ul>
                <div v-for="(sort, i) in productSortList" :key="i">
                  <div v-show="activeLi == i" class="right-sort">
                    <div class="left">
                      <div v-for="(sort2, j) in sort.children" :key="j" class="item">
                        <div class="sort2-name">{{ sort2.name }}</div>
                        <div class="sort3-name">
                          <span v-for="(sort3, k) in sort2.children" :key="k">
                            <nuxt-link :alt="sort3.name" :to="{
                              name: 'productList',
                              query: {
                                sort1: sort.id,
                                sort2: sort2.id || '',
                                sort3: sort3.id || '',
                              },
                            }" >
                              {{ sort3.name }}
                            </nuxt-link>

                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="right">
                      <div v-for="(ad, k) in categoryRightAdList" :key="k" class="ad-card" @click="gotoCompany(ad)">
                        <el-image style="
                            width: 120px;
                            height: 77px;
                            background-color: #fff;
                          " :src="ad.cover" fit="contain"></el-image>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style="display: flex; flex: 1">
              <a class="tab fs" style="color: #03842e" v-for="(nav, i) in tabNavMenuList" :key="i" :class="nav.url &&
                  $route.path != '/' &&
                  nav.url.includes($route.path) &&
                  nav.url.split('?')[1] === 'cate_id=' + $route.query.cate_id
                  ? 'tab-active'
                  : ''
                " :alt="nav.name" :href="nav.url" >
                {{ nav.name }}
              </a>
            </div>


          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import { mapState } from "vuex";
import logoSrc from "../assets/images/logo.png";
import Api from "@/plugins/api";
import config from "~/config";

export default {
  name: "NavSearch",
  props: {
    ShowList: {
      type: Boolean,
      default: true,
    },
    isUseList: {
      type: Boolean,
      default: true,
    },
    keywordArr: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      keywordList: ["源竹", "竹条", "竹丝条", "集装箱底版", "竹加工设备"],
      categoryRightAdList: [],
      keyword: "",
      isShowRightSort: false,
      fastBuyHoverBtn: false,
      logoSrc,
      activeLi: -1,
      cartCount: 0,
      RightSortList: [],
      isShowList: false,
      type: "1",
      config: config,
    };
  },

  computed: {
    ...mapState([
      "GoodsCartCount",
      "token",
      "productSortList",
      "tabNavMenuList",
    ]),
  },
  created() {
    this.isShowList = this.ShowList;
  },
  mounted() {
    if (
      this.$route.path === "/searchresult" ||
      this.$route.path === "/searchCompany"
    ) {
      if (this.$route.query.keyword) {
        this.keyword = this.$route.query.keyword;
      }
      if (this.$route.query.type) {
        this.type = this.$route.query.type;
      }
    }
    this.getAd();
    if (this.token) {
      this.getGoodsCartCount();
    }
  },
  methods: {
    search() {
      if (this.type === "1") {
        if (this.$route.path !== "/searchresult") {
          this.$router.push({
            path: "/searchresult",
            query: {
              keyword: this.keyword,
              type: this.type,
            },
          });
        } else {
          this.$emit("navSearch", this.keyword);
        }
      } else if (this.type === "2") {
        if (this.$route.path !== "/searchCompany") {
          this.$router.push({
            path: "/searchCompany",
            query: {
              keyword: this.keyword,
              type: this.type,
            },
          });
        } else {
          this.$emit("navSearch", this.keyword);
        }
      }
    },
    clickKeyword(keyword) {
      this.keyword = keyword;
      this.search();
      this.$router.push({
        path: "/searchresult",
        query: { keyword, type: this.type },
      });
    },
    getRecommendSearchWordList() {
      this.$request.get(Api.getRecommendSearchWordList).then((res) => {
        if (res.code === 0) {
          this.keywordList = res.data;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    getSiteNavMenuList() {
      this.$request
        .get(Api.getSiteNavMenuList, { params: { type: 1 } })
        .then((res) => {
          if (res.code === 0) {
            this.navMenuList = res.data;
          }
        });
    },
    getGoodsCartCount() {
      this.$request.get(Api.getGoodsCartCount).then((res) => {
        this.$store.commit("setGoodsCartCount", res.data);
      });
    },
    async getAd() {
      const res = await this.$request.get(Api.getAd, {
        params: { target: "category_right_ad_post_1" },
      });
      this.categoryRightAdList = res.data;
    },
    gotoCompany(ad) {
      if (ad.company_id !== "") {
        window.open(`/company?id=${ad.company_id}`);
      }
    },
    // 去采购单页面
    gotoPurchaseOrder() {
      if (!this.token) {
        this.$router.push({ path: "/login" });
        return;
      }
      this.$router.push({ path: "/purchaseorder" });
    },
    gotoSelf() {
      this.$router.push({ path: "/productList", query: { sort1: -1 } });
    },
    gotoPages(nav) {
      window.open(nav.url);
    },
    gotoHome() {
      this.$router.push("/");
    },
    ShowRightSort(isShow, sort, i) {
      this.activeLi = i;
      if (!this.isUseList) {
        return;
      }
      if (i === -1) {
        this.isShowList = false;
      }
    },
    fastBuyHover(type) {
      if (type) {
        this.fastBuyHoverBtn = true;
      } else {
        this.fastBuyHoverBtn = false;
      }
    },
    addCount(num) {
      this.cartCount += num;
    },
    gotoList(id1, id2, id3) {
      if (this.isUseList) {
        this.isShowList = false;
      }

      // const routeUrl = this.$router.resolve({
      //   path: "/productList",
      //   query: {
      //     sort1: id1,
      //     sort2: id2,
      //     sort3: id3,
      //   },
      // });
      // window.open(routeUrl.href, "_blank");

      this.$router.push({ path: "/productList", query: { sort1: id1, sort2: id2, sort3: id3 } });

    },
    getIndexData() {
      this.$request.get(Api.shopIndex).then((res) => {
        if (res.code === 0) {
          this.productSortList = res.data.category_list;
        }
      });
    },
    gotoQuickOrder() {
      const url = this.$route.path;
      this.$router.push({ path: "/quickOrder", query: { from: url } });
    },
    selectSearchType() { },
  },
};
</script>
<style lang="less" scoped>
.nav-search {
  width: 1200px;
  margin: 0 auto;

  .top {
    padding: 30px 0;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    .logo {
      padding-top: 12px;
      width: 148px;
      height: 56px;
    }

    .search {
      margin: 4px 0 4px 10px;

      & :deep(.el-select .el-input) {
        width: 75px;
        font-size: 14px;
        font-family: Microsoft YaHei, Microsoft YaHei-Regular;
        font-weight: 400;
        color: #353535;
      }

      & :deep(.input-with-select .el-input-group__prepend) {
        background-color: #fff;
        border-radius: 30px;
        padding: 0;
        padding-left: 4px;
        border: none;
      }

      & :deep(.el-select-dropdown__item.selected) {
        color: #2263e8;
      }

      & :deep(.el-select .el-select-dropdown) {
        transform: translateX(-5px);
      }

      .input {
        width: 672px;
        height: 40px;
        background: rgba(122, 122, 122, 0.12);
        // border: 1px solid #03842e;
        border-radius: 30px;

        & :deep(.el-input-group__append) {
          background-color: #03842e;
          width: 68px;
          border: none;
          border-radius: 30px;
          color: #fff;
          padding: 0;
          text-align: center;
          cursor: pointer;
          right: 4px;
        }

        & :deep(.el-input__inner) {
          border: 30px;
          border: none;
          background-color: rgba(122, 122, 122, 0.12);
        }
      }

      .white-select {
        & :deep(.el-select) {
          margin: 0;
        }

        & :deep(.el-input__inner) {
          border-top-left-radius: 50px;
          border-bottom-left-radius: 50px;
          border: 1px solid #03842e;
          background-color: #fff;
          height: 35px;
          padding: 0 15px;
          line-height: 35px;
        }

        & :deep(.el-icon-arrow-up) {
          line-height: 35px;

          &::before {
            content: "\e78f";
          }
        }
      }

      .keyword {
        font-size: 14px;
        font-weight: 400;
        text-align: left;
        color: #999999;
        margin: 4px;

        a {
          padding-right: 8px;
        }

        a:hover {
          color: #03842e !important;
          cursor: pointer;
        }
      }
    }

    .btn-group {
      padding-top: 10px;
      padding-right: 14px;

      .el-button {
        width: 95px;
        height: 32px;
        line-height: 33px;
        background: #ffffff;
        border-radius: 4px;
        font-size: 12px;
        text-align: center;
        padding: 0;
      }

      .el-button:last-child {
        // padding: 12.5px 5px;

        &:hover {
          border: 1px solid #2263e8;
        }
      }

      .fast-buy {
        color: #e84b01;
        border: 1px solid #e84b01;
      }

      .fast-buy:hover {
        background-color: #e84b01;
        color: #fff;
      }

      .shop-cart {
        color: #353535;

        .count {
          position: relative;
          bottom: 2px;
          right: 0;
          display: inline-block;
          padding: 0 5px;
          min-width: 18px;
          height: 16px;
          line-height: 16px;
          border-radius: 16px;
          background: #e84b01;
          color: #fff;
          font-size: 14px;
          font-family: Arial;
        }
      }

      .new-style {
        border: 1px solid #03842e;
        color: #03842e;
      }
    }
  }

  .bottom {
    .container {
      .tabs {
        display: flex;
        font-size: 16px;
        flex: 1;

        a {
          text-decoration: none;
        }

        .tab {
          cursor: pointer;
          padding: 9px 0;
          font-size: 18px;

          &.fs {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          &.tab-active {
            color: #03842e !important;
            border-bottom: 3px solid #03842e;
          }

          &:hover {
            color: #fff !important;
            background-color: #03842e;
            font-weight: 500;
          }

          &:first-child {
            width: 200px;
            padding: 9px 10px;
          }

          &.is-active {
            border-radius: 4px 4px 0px 0px;
            background-color: #03842e;
            color: #fff;
          }
        }
      }

      .list {
        position: relative;

        ul {
          width: 200px;
          height: 525px;
          background: rgba(0, 53, 43, 0.8);
          color: #fff;
          font-size: 18px;
          position: absolute;
          z-index: 999;
          left: -10px;
          top: 9px;
          overflow-y: auto;

          &::-webkit-scrollbar {
            width: 8px;
            background: #eee;
            border-radius: 4px;
          }

          &::-webkit-scrollbar-button {
            display: none;
          }

          &::-webkit-scrollbar-thumb {
            background: #ccc;
            border-radius: 4px;
          }

          li {
            padding: 12px 14px 11.5px;
            cursor: pointer;

          }

          li.active {
            color: #fff;
            background: #03842e;
          }
        }

        .right-sort {
          position: absolute;
          top: 9px;
          left: 190px;
          z-index: 9999;
          background-color: #fff;
          padding: 10px;
          height: 500px;
          box-sizing: border-box;
          width: 1126px;
          opacity: unset;
          display: flex;
          box-shadow: 0px 2px 12px 0px rgba(23, 36, 63, 0.1);

          .left {
            width: 660px;
            padding: 2px;
            overflow-y: auto;

            &::-webkit-scrollbar {
              width: 8px;
              background: #eee;
              border-radius: 4px;
            }

            &::-webkit-scrollbar-button {
              display: none;
            }

            &::-webkit-scrollbar-thumb {
              background: #ccc;
              border-radius: 4px;
            }

            .item {
              display: flex;
              justify-content: flex-start;
              align-items: flex-start;

              .sort2-name {
                font-size: 18px;
                font-weight: 700;
                color: #353535;
                width: 110px;
                padding: 6px 8px 5px;
              }

              .sort3-name {
                font-size: 18px;
                font-weight: 400;
                color: #000;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                flex-wrap: wrap;
                padding: 6px 8px 5px;
                flex: 1;

                // height: 18px;
                &>span {
                  margin: 0 0 8px;
                  padding: 0 8px;
                  text-align: left;

                  &:hover {
                    color: #2263e8;
                  }
                }
              }
            }
          }

          .right {
            flex: 1;
            color: #000;
            border-left: 1px solid #efefef;
            padding: 12px;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;

            .ad-card {
              width: 120px;
              height: 77px;
              background: #efefef;
              margin: 4px 0;
            }
          }
        }
      }
    }
  }
}

.subtitle-style {
  font-size: 14px;
  color: #b6b5b5;
  min-height: 16.5px;
  margin-top: 13px;
  width: 172px;

  ::v-deep a {
    color: #ccc
  }

  a {
    color: #ccc;
  }

  // overflow: hidden;
  // white-space: nowrap;
  // text-overflow: ellipsis;
  a:hover,
  span:hover,
  div:hover {
    color: #fff !important;
  }

  :hover {
    color: #fff !important;
  }
}

:deep(.product_icon) {
  font-size: 20px !important;
}
</style>
