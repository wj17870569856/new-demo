<template>
  <div class="page">
    <CompanyHeader
      :company_name="info.company_name"
      :img_url="info.logo_url"
      :store_level="info.store_level"
      ref="companyHeader"
      :company_id="id"
      :store_type="info.store_type"
      @search="searchCompanyPro"
      @clear="clearCompanyPro"
    ></CompanyHeader>

    <div class="company-page">
      <div class="tabs el-tabs el-tabs--top">
        <div class="el-tabs__header is-top">
          <div class="el-tabs__nav-wrap is-top">
            <div class="el-tabs__nav-scroll">
              <div role="tablist" class="el-tabs__nav is-top" style="transform: translateX(-0px)">
                <div
                  class="el-tabs__active-bar is-top"
                  style="width: 28px; transform: translateX(20px)"
                ></div>
                <a class="el-tabs__item is-top" :href="`/company?id=${id}`" alt="公司首页">首页</a>
                <a
                  class="el-tabs__item is-top"
                  :href="`/company/allProduct?id=${id}`"
                  alt="公司全部产品"
                >全部产品</a>
                <a
                  class="el-tabs__item is-top is-active"
                  :href="`/company/brief?id=${id}`"
                  alt="公司介绍"
                >公司介绍</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="tabs">
        <div class="el-tabs__content">
          <div class="el-tab-pane">
            <CompanyIntroduce ref="companyIntro"></CompanyIntroduce>
          </div>
        </div>
      </div>
    </div>
  
  </div>
</template>
  <script>
/* eslint-disable */
import { mapState } from "vuex";
import CompanyHeader from "@/components/CompanyHeader.vue";

import CompanyIntroduce from "@/components/CompanyIntroduce.vue";
import Api from "~/plugins/api";
import config from "@/config";
import axios from "axios";

export default {
  name: "CompanyBrief",
  components: {
    CompanyHeader,
    CompanyIntroduce,
  },
  layout: "company",
  asyncData({ query, params, route }) {
    let url2 = config.baseUrl + Api.shopIndex;
    let url = config.baseUrl + Api.getCompanyInfo;

    return axios
      .all([
        axios.get(url, {
          params: {
            company_id: query.id,
          },
        }),
        axios.get(url2),
      ])
      .then(
        axios.spread(function (res, res2) {
          return {
            config,
            productSortList: res2.data.data.category_list,
            tdk: {
              title: res.data.data.company_name,
            },
            hot_products: res.data.data.hot_products,
            id: query.id,
          };
        })
      );
  },
  data() {
    return {
      tdk: {
        title: "",
      },
      id: 0,
      page: 1,
      limit: 20,
      total: 0,
      info: {},
      count: 1,
      activeName: "first",
      swiperOption1: {
        slidesPerView: 3,
        spaceBetween: 10,
        freeMode: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      },
      swiperOption2: {
        slidesPerView: 5,
        spaceBetween: 10,
        freeMode: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      },
      realistic: "",
      realisticIndex: 0,
      product: [],
      introduce: {},
      isShowPhone: false,
      isShowAdv: false,
      categoryList: [],
      attrList: [],
      formInline: {},
      cate_id: "",
      activeKeyword: [],
      cateName: "",
      loadingData: false,
      productSortList: [],
      config: {},
      hot_products: [],
    };
  },
  computed: {
    ...mapState(["token"]),
  },
  mounted() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
      this.getDetail();
      this.isCollect();
    } else {
      this.$router.push({ path: "/directSupply" });
    }
    //this.getCateList()
    this.$refs.companyIntro.getIntroduce(this.id);
    //收藏
    //this.$refs.companyHeader.like = 1
  },
  methods: {
    // 获取分类列表
    getCateList() {
      this.$request.get(Api.shopIndex).then((res) => {
        console.log(res);
      });
    },
    // 加到购物车
    addOrder(data) {
      this.$request.post(Api.addGoodsCart, data).then((res) => {
        if (res.code === 0) {
          this.$message.success("加购成功");
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    gotoDetails(pro) {
      window.open(`/productDetails?id=${pro.sku_id}`);
    },
    showPhone() {
      if (this.token) {
        this.isShowPhone = true;
      } else {
        this.$message.warning("请登录后查看");
      }
    },
    /* 分页 */
    choosePage(page) {
      this.page = page;
      this.getProductList();
    },
    /* 条数改变 */
    handleSizeChange(val) {
      this.limit = val;
      this.getProductList();
    },
    handleClick(tab, event) {
      if (this.activeName === "first") {
        this.getDetail();
      } else if (this.activeName === "second") {
        this.getProductList();
      } else if (this.activeName === "third") {
        this.$refs.companyIntro.getIntroduce(this.id);
      }
    },
    // 搜索
    searchCompanyPro(keyword, cate_id) {
      if (!keyword) {
        return this.getProductList();
      }
      this.$request
        .get(Api.getShopGoodsLists, {
          params: { keyword, shop_id: this.id, cate_id },
        })
        .then((res) => {
          this.activeName = "second";
          this.attrList = [];
          this.activeKeyword = [];
          this.cateName = "";
          this.total = res.data.data.total;
          this.product = res.data.data.map((item) => {
            const {
              id: goods_id,
              image: image_url,
              main_product,
              min_sale,
              goods_name: name,
              mobile: service_mobile,
              contacts: service_realname,
              shop_id,
              shop_name,
              sku_id,
              sku_shop_price,
              stock_status,
              store_level,
              store_type,
              unit,
              unit_name,
            } = item.source;
            let pro = {
              goods_id,
              image_url,
              main_product,
              min_sale,
              name,
              service_mobile,
              service_realname,
              shop_id,
              shop_name,
              sku_id,
              sku_shop_price,
              stock_status,
              store_level,
              store_type,
              unit,
              unit_name,
              count: min_sale,
            };
            return pro;
          });
        });
    },
    clearCompanyPro() {
      this.page = 1;
      this.cate_id = "";
      this.getProductList();
    },
    //查看是否收藏了
    isCollect() {
      this.$request
        .post(Api.viewIsCollect, { type: 1, id: this.id })
        .then((res) => {
          if (res.code === 0) {
            this.$refs.companyHeader.like = res.data.is_collect ? 1 : 0;
          }
        });
    },
    getDetail() {
      this.$request
        .get(Api.getCompanyInfo, {
          params: {
            company_id: this.id,
          },
        })
        .then((res) => {
          if (res.code === 0) {
            this.info = { ...res.data };
            if (
              this.info?.company_pic_advantage &&
              this.info.company_pic_advantage.length > 0
            ) {
              this.isShowAdv = true;
            }
          }
        });
    },
    getProductList() {
      this.loadingData = true;
      this.$request
        .get(Api.getProductList, {
          params: {
            company_id: this.id,
            page: this.page,
            limit: this.limit,
            cate_id: this.cate_id,
          },
        })
        .then((res) => {
          if (res.code === 0) {
            this.total = res.count;
            if (this.categoryList.length === 0) {
              this.categoryList = res.data.category;
            }
            this.attrList = res.data.attr_lists;
            this.product = res.data.goods_list.map((item) => {
              return { ...item, count: item.min_sale };
            });
            this.loadingData = false;
          } else {
            this.loadingData = false;
          }
        })
        .catch((err) => {
          console.log(err);
          this.loadingData = false;
        });
    },
    clickCate(cate) {
      this.page = 1;
      this.cate_id = cate.id;
      this.cateName = cate.name;
      this.activeKeyword = [];
      this.$request
        .get(Api.getProductList, {
          params: {
            company_id: this.id,
            page: this.page,
            limit: this.limit,
            cate_id: cate.id,
          },
        })
        .then((res) => {
          this.attrList = res.data.attr_lists;
          this.product = res.data.goods_list.map((item) => {
            return { ...item, count: item.min_sale };
          });
          this.total = res.count;
        });
    },
    clickAttr(key, value) {
      // this.formInline[key] = value
      //this.activeKeyword = value
      let tempKey = this.activeKeyword.find((item) => item.indexOf(key) != -1);
      if (tempKey) {
        this.activeKeyword.splice(this.activeKeyword.indexOf(tempKey), 1);
      }
      if (tempKey != key + "-" + value) {
        this.activeKeyword.push(key + "-" + value);
      }
      this.searchAttr();
    },
    searchAttr() {
      this.$request
        .get(Api.getShopGoodsLists, {
          params: {
            keyword: this.$refs.companyHeader.searchKey,
            attr: this.activeKeyword.join("|"),
            shop_id: this.id,
            cate_id: this.cate_id,
          },
        })
        .then((res) => {
          this.activeName = "second";
          this.total = res.data.data.total;
          this.product = res.data.data.map((item) => {
            const {
              id: goods_id,
              image: image_url,
              main_product,
              min_sale,
              goods_name: name,
              mobile: service_mobile,
              contacts: service_realname,
              shop_id,
              shop_name,
              sku_id,
              sku_shop_price,
              stock_status,
              store_level,
              store_type,
              unit,
              unit_name,
            } = item.source;
            let pro = {
              goods_id,
              image_url,
              main_product,
              min_sale,
              name,
              service_mobile,
              service_realname,
              shop_id,
              shop_name,
              sku_id,
              sku_shop_price,
              stock_status,
              store_level,
              store_type,
              unit,
              unit_name,
              count: min_sale,
            };
            return pro;
          });
        });
    },
    search(key) {
      let attr_name = this.formInline[key];
      let cate_id = this.cate_id;
      //this.activeKeyword = attr_name
      // for (const key in this.formInline) {
      //   if (Object.hasOwnProperty.call(this.formInline, key)) {
      //     const attrValue = this.formInline[key];
      //     attr_name += attrValue
      //     attr_name += ' '
      //   }
      // }
      let tempKey = this.activeKeyword.find((item) => item.indexOf(key) != -1);
      if (tempKey) {
        this.activeKeyword.splice(this.activeKeyword.indexOf(tempKey), 1);
      }
      this.activeKeyword.push(key + "-" + attr_name);

      this.searchAttr();
    },
    clearSearch(key) {
      this.formInline[key] = "";
      //this.activeKeyword = ''
      let tempKey = this.activeKeyword.find((item) => item.indexOf(key) != -1);
      if (tempKey) {
        this.activeKeyword.splice(this.activeKeyword.indexOf(tempKey), 1);
      }
      // for (const key in this.formInline) {
      //   if (Object.hasOwnProperty.call(this.formInline, key)) {
      //     this.formInline[key] = ''
      //   }
      // }

      // let attr_name = ''
      // let cat_id = this.sort3 || this.sort2 || this.sort1 || ''
      // for (const key in this.formInline) {
      //   if (Object.hasOwnProperty.call(this.formInline, key)) {
      //     const attrValue = this.formInline[key];
      //     if (attrValue) {
      //       attr_name += attrValue
      //       attr_name += ' '
      //     }
      //   }
      // }
      this.searchAttr();
      //this.getProductList()
      // this.searchCompanyPro(attr_name, cat_id)
    },
    // nextRealistic() {
    //   if (this.realisticIndex < this.info.company_pic.length) {
    //     this.realisticIndex++
    //   } else {
    //     this.realisticIndex = this.info.company_pic.length
    //   }
    // }
    // ,
    // backRealistic() {
    //   if (this.realisticIndex > 0) {
    //     this.realisticIndex--
    //   } else {
    //     this.realisticIndex = 0
    //   }
    // }
  },
};
</script>
  <style lang="less" scoped>
  .page {
    margin-top: 60px;
  }
.company-page {
  padding: 0;
  background-color: #fff;
    min-height: 700px;
    overflow: hidden;
  .tabs {
    background-color: #fafafa;
    margin: 0 auto;
    margin-bottom: 24px;
    :deep(.el-tabs__header) {
      width: 1184px;
      margin: 0 auto;
    }

    :deep(.el-tabs__nav) {
      display: flex;
    }

    :deep(.el-tabs__content) {
      padding: 0;
      background-color: #fff;
    }

    :deep(.el-tab-pane) {
      width: 1218px;
      margin: 0 auto;
    }

    :deep(.el-tabs__nav-wrap::after) {
      display: none;
    }

    :deep(.el-tabs__active-bar) {
      display: none;
    }

    :deep(.el-tabs__item.is-active) {
      background: #2263e8;
      color: #fff;
    }

    :deep(.el-tabs__item) {
      padding: 0 20px;
    }

    .home {
      background: #fbfcfe;
      padding: 20px;
      display: flex;

      .left {
        margin-right: 20px;

        .img-wrapper {
          .big-img {
            width: 426px;
            height: 240px;
            border-radius: 4px;

            .el-image {
              // border: 1px dashed #d5d5d5;
            }
          }

          .small-img {
            width: 426px;
            margin-top: 11px;

            .swiper-button-next {
              right: 0;
              background-image: url("@/assets/images/right_icon@2x.png");
            }

            .swiper-button-prev {
              left: 0;
              background-image: url("@/assets/images/left_icon@2x.png");
            }
          }
        }
      }

      .right {
        font-family: Microsoft YaHei, Microsoft YaHei-Bold;

        .company-name {
          font-size: 20px;
          font-weight: 700;
          color: #353535;
          margin-bottom: 30px;
        }

        .info-item {
          display: flex;
          font-size: 14px;
          margin-bottom: 20px;

          &:last-child {
            margin-bottom: 0;
          }

          .label {
            font-family: Microsoft YaHei, Microsoft YaHei-Regular;
            font-weight: 400;
            text-align: left;
            font-size: 14px;
            color: #959595;
            width: 70px;
            margin-right: 20px;
          }

          .value {
            font-family: Microsoft YaHei, Microsoft YaHei-Regular;
            font-weight: 400;
            text-align: left;
            color: #353535;
            flex: 1;
          }
        }
      }
    }
  }

  .title {
    height: 54px;
    line-height: 54px;
    text-align: center;
    font-size: 20px;
    color: #ffffff;
    letter-spacing: 2.4px;
    background: #fbfcfe;
    border-top: 2px solid #629bfc;
    margin-top: 32px;
  }

  .product-hot {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    background: #fbfcfe;
    padding: 20px 0;

    .hot-item {
      margin-bottom: 30px;
      width: 216px;

      .name,
      .type {
        width: 100%;
        font-size: 14px;
        font-family: Microsoft YaHei, Microsoft YaHei-Regular;
        font-weight: 400;
        text-align: left;
        color: #353535;
        margin-top: 4px;
      }
    }
  }

  .our-strength {
    display: flex;
    // justify-content: flex;
    flex-wrap: wrap;
    background: #fbfcfe;
    padding: 20px 0;

    .strength-item {
      width: 25%;
      text-align: center;

      .strength {
        font-size: 16px;
        font-family: Microsoft YaHei, Microsoft YaHei-Regular;
        font-weight: 400;
        text-align: center;
        color: #353535;
        letter-spacing: 1.92px;
      }
    }
  }

  .all-product {
    background: #fff;
    margin-top: 30px;

    .sort-bar {
      margin: 20px 0;
      height: 36px;
      background: #ffffff;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      font-size: 12px;

      .label {
        color: #000;
        font-weight: 700;
        width: 40px;
      }

      & > div {
        margin: 2px 5px;
      }

      .cate-name {
        cursor: pointer;
      }
    }

    .product-list {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      min-height: 800px;

      .thead,
      .tr {
        display: flex;
        justify-content: space-around;
        align-items: center;

        & > div {
          width: 30%;
          display: flex;
          align-items: center;
        }
      }

      .thead {
        height: 36px;
        background: #e9f0fa;
        border-radius: 2px 2px 0px 0px;

        & > div {
          width: 30%;
          display: flex;
          align-items: center;
          box-sizing: border-box;
        }
      }

      .tr {
        &:nth-child(even) {
          background: #fafafa;
        }

        height: 98px;
        background: #ffffff;
        font-family: Microsoft YaHei, Microsoft YaHei-Bold;

        .pro-title {
          font-size: 14px;
          font-weight: 700;
          color: #353535;
          margin: 10px;
          width: 300px;
        }

        .pro-type {
          font-size: 14px;
          font-weight: 400;
          color: #353535;
          margin: 10px;
          width: 300px;
        }
      }
    }

    :deep(.el-pagination) {
      text-align: center;
      margin-bottom: 20px;
    }
  }

  .company-introduce {
    h2 {
      font-size: 16px;
      font-family: Microsoft YaHei, Microsoft YaHei-Bold;
      font-weight: 700;
      text-align: left;
      color: #353535;
    }

    .photo {
      .img-wrapper {
        position: relative;

        .big-img {
          width: 1130px;
          height: 638px;

          .el-image {
            // border: 1px dashed #d5d5d5;
          }
        }

        .small-img {
          width: 1130px;
          margin-top: 11px;
          position: absolute;
          bottom: 0;
          padding: 15px;
          box-sizing: border-box;
          background-color: #3535359f;

          .swiper-button-next {
            right: 0;
            background-image: url("@/assets/images/right_icon@2x.png");
          }

          .swiper-button-prev {
            left: 0;
            background-image: url("@/assets/images/left_icon@2x.png");
          }

          :deep(.swiper-container) {
            width: 100%;
          }
        }
      }
    }

    .summary {
      font-size: 14px;
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      font-weight: 400;
      text-align: left;
      color: #353535;
      line-height: 24px;
      text-indent: 28px;
      margin: 20px 0;
    }

    .line {
      height: 0px;
      border: 1px solid #e5e5e5;
    }

    .summary-sub {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin: 30px 0;

      .label {
        padding: 0 20px 0 5px;
        margin-right: 40px;
        height: 20px;
        line-height: 20px;
        background: #e5edfc;
        color: #353535;
        font-size: 14px;
        font-family: Microsoft YaHei, Microsoft YaHei-Bold;
        font-weight: 700;
        border-left: 4px solid #4186fa;
      }

      .value {
        width: 1034px;
        font-size: 14px;
        font-family: Microsoft YaHei, Microsoft YaHei-Regular;
        font-weight: 400;
        text-align: left;
        color: #353535;
        line-height: 24px;
      }
    }

    .our-power {
      margin-bottom: 120px;

      .our-title {
        height: 40px;
        line-height: 40px;
        font-size: 24px;
        font-family: Microsoft YaHei, Microsoft YaHei-Bold;
        font-weight: 700;
        text-align: left;
        padding-left: 20px;
        color: #353535;
        border-bottom: 2px solid #e5edfc;
        margin-bottom: 20px;
      }

      .power-wrapper {
        display: flex;

        .power-item {
          margin-right: 20px;
          font-size: 16px;
          font-family: Microsoft YaHei, Microsoft YaHei-Regular;
          font-weight: 400;
          text-align: center;
          color: #353535;
          letter-spacing: 1.92px;
        }
      }
    }
  }
}

.price {
  font-family: Roboto, Roboto-Medium;
  font-size: 24px;
  font-weight: 500;
  text-align: left;
  color: #e84b01;

  .sub {
    font-size: 14px;
    font-weight: 400;
  }
}

.add-btn {
  width: 60px;
  height: 32px;
  line-height: 32px;
  background: #2263e8;
  border-radius: 2px;
  font-size: 14px;
  color: #fff;
  text-align: center;
  margin: 0 8px;
  cursor: pointer;
}

.count-num {
  margin-left: 15px;
  width: 140px;

  :deep(.el-input-number__decrease),
  :deep(.el-input-number__increase) {
    background-color: #d5d5d5;
    color: #000;
  }
}

.text-ellipsis-introduce {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  overflow: hidden;
}

.tag-loca {
  margin-left: 10px;
  font-weight: 500;
  color: #629bfc;
  cursor: pointer;
}

.steel-mill {
  padding: 0;
  font-size: 12px;
  font-family: Microsoft YaHei, Microsoft YaHei-Regular;
  color: #353535;

  :deep(.el-form-item) {
    margin: 0;
  }

  label {
    font-weight: 700;
    display: inline-block;
    // width: 60px;
    padding: 5px;
    text-align: right;
  }

  ul {
    display: flex;
    align-content: flex-start;
    flex-wrap: wrap;

    li {
      float: left;
      font-weight: 400;
      padding: 0 10px;
    }

    li:hover {
      color: #2263e8;
      cursor: pointer;
    }
  }
}

.btn {
  padding: 3px 12px;
  background: #2263e8;
  border-radius: 2px;
  border: 0;
  font-size: 12px;
  font-family: Microsoft YaHei, Microsoft YaHei-Regular;
  font-weight: 400;
  text-align: center;
  color: #ffffff;
  line-height: 18px;
  padding: 0;
}

.btn:hover {
  cursor: pointer;
}

.btn-blue {
  background: #2263e8;
}

.btn-grey {
  background: #959595;
}

.normal-btn {
  background: transparent;
  border: 1px solid #c5c5c5;
  color: #656565;
}
</style>
  