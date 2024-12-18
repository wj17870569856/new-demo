<template>
  <div>
    <NavSearch
      :is-use-list="true"
      :show-list="false"
      @navSearch="getSearchResultList"
      ref="navSearch"
      :keywordArr="keywordArr"
    ></NavSearch>
    <div class="mian">
      <!--   搜索框   -->
      <!-- <div class="search-form" v-if="productAttrList.length>0">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item :label="attr.name" v-for="(attr, i) in productAttrList"  :key="i">
            <el-input v-model="formInline[attr.name]" :placeholder="`请输入${attr.name}`" size="mini"></el-input>
          </el-form-item>
          <el-form-item>
            <button type="button" class="btn btn-blue" @click="search">
              搜 索
            </button>
          </el-form-item>
          <el-form-item>
            <button type="button" class="btn btn-grey" @click="clearSearch">
              清空
            </button>
          </el-form-item>
        </el-form>
      </div> -->
      <div class="category-sort" v-if="categoryList.length">
        <div class="label">分类：</div>
        <div class="category-item">
          <ul>
            <li
              v-for="category in categoryList"
              :key="category.cate_id"
              @click="searchCategory(category.cate_id, category.cate_name)"
            >
              {{ category.cate_name }}
            </li>
          </ul>
        </div>
      </div>
      <!--  钢材分类  -->
      <div v-if="productAttrList.length" class="steel-sort">
        <!--   属性   -->
        <div class="steel-mill" v-for="(attr, i) in productAttrList" :key="i">
          <div
            style="
              border-bottom: 1px dashed #e5e5e5;
              display: flex;
              align-items: center;
            "
          >
            <label>{{ attr.name }}：</label>
            <div style="display: flex; align-items: center; flex: 1">
              <ul class="attr-ul" style="flex: 1; flex-wrap: wrap">
                <li
                  class="attr-li"
                  :class="
                    activeKeyword.includes(attr.name + '-' + item)
                      ? 'active-blue'
                      : ''
                  "
                  v-for="(item, i) in attr.value"
                  :key="i"
                  @click="clickAttr(item, cate_id, attr.name)"
                >
                  {{ item }}
                </li>
              </ul>
              <el-form
                @submit.native.prevent
                :inline="true"
                :model="formInline"
                class="demo-form-inline"
                style="width: 220px"
              >
                <el-form-item>
                  <el-input
                    v-model="formInline[attr.name]"
                    :placeholder="`请输入${attr.name}`"
                    style="width: 100px"
                    size="mini"
                    @keyup.enter.native.stop="search(attr.name)"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <button
                    type="button"
                    class="btn normal-btn"
                    @click="search(attr.name)"
                  >
                    搜 索
                  </button>
                </el-form-item>
                <el-form-item>
                  <button
                    type="button"
                    class="btn btn-grey"
                    @click="clearSearch(attr.name)"
                  >
                    清空
                  </button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </div>
      <!--  排序  -->
      <div class="sort-bar">
        <div class="sort-row">
          <ul class="sorts">
            <li class="sort blue-btn">综合</li>
            <li class="sort price" @click="priceSort">
              价格
              <div style="display: flex; flex-direction: column">
                <svg-icon
                  style="height: 8px; cursor: pointer"
                  :icon-class="top ? 'top_active' : 'top'"
                  @click.native.stop="changePriceSort('top')"
                ></svg-icon>
                <svg-icon
                  style="height: 8px; cursor: pointer"
                  :icon-class="bottom ? 'bottom_active' : 'bottom'"
                  @click.native.stop="changePriceSort('bottom')"
                ></svg-icon>
              </div>
            </li>
            <!-- <li class="sort">
              <el-checkbox v-model="selfSupport">自营专区</el-checkbox>
            </li>
            <li class="sort">
              <el-checkbox v-model="checked">厂家直供</el-checkbox>
            </li> -->
          </ul>
          <div class="list-show">
            <svg-icon
              :icon-class="menu"
              @click.native="showListType(1)"
            ></svg-icon>
            <svg-icon
              :icon-class="transverse"
              @click.native="showListType(2)"
            ></svg-icon>
          </div>
        </div>
      </div>
      <!--  列表  -->
      <ProductTransverse
        v-if="showTransverse && productList.length > 0"
        :list="productList"
        :config="config"
        @add="addOrder"
      />
      <ProductDertical
        v-if="!showTransverse && productList.length > 0"
        :list="productList"
        :config="config"
        @add="addOrder"
      />
      <div class="no-data" v-if="productList.length === 0">
        <img :src="empty_data" style="width: 120px; height: 120px" fit="fill" />
        <div class="not-found-text">找不到相关产品</div>
        <div class="no-data-text">
          更换搜索条件 或 发布找货需求让更多供应商联系您
        </div>
        <div class="publish-demand" @click="gotoQuickOrder">发布找货需求</div>
      </div>
      <!--  分页  -->
      <div class="page">
        <el-pagination
          :current-page.sync="currentPage"
          :page-size="pagesize"
          layout="prev, pager, next, jumper"
          :total="total"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
      <!--  广告  -->
      <RecommendCompany :company-list="companyList" :config="config" />
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import Api from "@/plugins/api";
import { mapState } from "vuex";
import ProductTransverse from "@/components/ProductTransverse.vue";
import ProductDertical from "~/components/productDertical";
import RecommendCompany from "~/components/RecommendCompany";
import NavSearch from "~/components/NavSearch.vue";
import config from "@/config/index";

import top from "~/assets/images/price/top@2x.png";
import topActive from "~/assets/images/price/top_active@2x.png";
import bottom from "~/assets/images/price/bottom@2x.png";
import bottomActive from "~/assets/images/price/bottom_active@2x.png";
import empty_data from "~/assets/images/quickOrder/empty_data.png";
import axios from "axios";

export default {
  name: "searchResult",
  components: {
    ProductTransverse,
    NavSearch,
    ProductDertical,
    RecommendCompany,
  },
  data() {
    return {
      cate_id: "",
      keyword: "",
      activeKeyword: [],
      categoryList: [], // 搜索结果分类列表
      empty_data,
      steelMillList: [
        {
          id: 1,
          value: "柳钢",
        },
        {
          id: 2,
          value: "鞍钢",
        },
        {
          id: 3,
          value: "唐山",
        },
        {
          id: 4,
          value: "日照",
        },
        {
          id: 5,
          value: "首钢",
        },
        {
          id: 6,
          value: "燕钢",
        },
        {
          id: 7,
          value: "沙钢",
        },
      ],
      materialQualityList: [
        {
          id: 1,
          value: "Q256",
        },
        {
          id: 2,
          value: "DX54D+ZM",
        },
        {
          id: 3,
          value: "HC340/590DPD+ZM",
        },
        {
          id: 4,
          value: "DX51D-80",
        },
        {
          id: 5,
          value: "SPCC",
        },
      ],
      formInline: {},
      checked: false,
      selfSupport: false,
      menu: "menu_show",
      transverse: "transverse",
      currentPage: 1,
      pagesize: 20,
      total: 0,
      showTransverse: false,
      productList: [],
      companyList: [],
      bottom: false,
      top: false,
      topPicture: top,
      topActivePicture: topActive,
      bottomPicture: bottom,
      bottomActivePicture: bottomActive,
      productSortList: [],
      productAttrList: [],
      config: {},
      keywordArr: [],
    };
  },
  async asyncData({ query }) {
    let productList = [];
    let keyword = query.keyword;
    //推荐供应商
    const productListAd = await axios.get(config.baseUrl + Api.getAd, {
      params: { target: "product_List_ad_post_1" },
    });
    let companyList = productListAd.data.data;
    //搜索keyword
    const keywordRes = await axios.get(
      config.baseUrl + Api.getRecommendSearchWordList
    );
    let keywordArr = keywordRes.data.data;
    //产品列表
    if (keyword) {
      const params = {
        keyword: keyword,
        attr: "",
        page: 1,
        pagesize: 20,
      };
      const resProduct = await axios.get(
        config.baseUrl + Api.searchGetGoodsLists,
        { params }
      );
      if (resProduct.data.code === 0) {
        productList = resProduct.data.data.data.map((item) => {
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
            num: min_sale,
          };
          return pro;
        });
      }
    }

    return {
      config,
      companyList: companyList,
      productList: productList,
      keywordArr: keywordArr,
    };
  },
  // watchQuery: ['keyword'],
  async mounted() {
    this.keyword = this.$route.query.keyword;
    this.getSearchResultList(this.keyword);
    //this.getAd()
  },
  methods: {
    // 获取广告图
    async getAd() {
      const productListAd = await this.$request.get(Api.getAd, {
        params: { target: "product_List_ad_post_1" },
      });
      this.companyList = productListAd.data;
    },
    gotoQuickOrder() {
      this.$router.push({ path: "/quickOrder" });
    },
    // 加到购物车
    addOrder(data) {
      this.$request.post(Api.addGoodsCart, data).then((res) => {
        if (res.code === 0) {
          this.$message.success("加购成功");
          this.getGoodsCartCount();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    getGoodsCartCount() {
      this.$request.get(Api.getGoodsCartCount).then((res) => {
        this.$store.commit("setGoodsCartCount", res.data);
      });
    },
    // 获取搜索结果列表
    getSearchResultList(keyword, cate_id, sort) {
      if (keyword) {
        const params = {
          keyword: keyword,
          attr: this.activeKeyword.join("|"),
          page: this.currentPage,
          pagesize: this.pagesize,
        };
        if (cate_id) {
          params.cate_id = cate_id;
        }
        if (sort) {
          params.sort = sort;
        }
        return this.$request
          .get(Api.searchGetGoodsLists, { params })
          .then((res) => {
            if (res.code === 0) {
              if (
                res.data.category &&
                this.categoryList.sort().toString() !==
                  res.data.category.sort().toString()
              ) {
                this.categoryList = [];
                for (const key in res.data.category) {
                  if (Object.hasOwnProperty.call(res.data.category, key)) {
                    const element = res.data.category[key];
                    this.categoryList.push(element);
                  }
                }
              }
              if (res.data.attr_lists) {
                this.productAttrList = res.data.attr_lists;
              } else {
                this.productAttrList = [];
              }
              // this.categoryList = res.data.category
              this.productList = res.data.data.map((item) => {
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
                  num: min_sale,
                };
                return pro;
              });
              this.total = res.data.total;
            }
          });
      }
    },
    clickAttr(item, cate_id, attrName) {
      // for (const key in this.formInline) {
      //   if (Object.hasOwnProperty.call(this.formInline, key)) {
      //     this.formInline[key] = ''
      //   }
      // }
      let tempKey = this.activeKeyword.find(
        (item) => item.indexOf(attrName) != -1
      );
      if (tempKey) {
        this.activeKeyword.splice(this.activeKeyword.indexOf(tempKey), 1);
      }
      if (tempKey != attrName + "-" + attrName) {
        this.activeKeyword.push(attrName + "-" + item);
      }
      // this.formInline[attrName] = item

      this.getSearchResultList(this.$refs.navSearch.keyword, cate_id);
    },
    search(key) {
      let attr_name = this.formInline[key];
      let cate_id = this.cate_id;
      //this.activeKeyword = attr_name
      let tempKey = this.activeKeyword.find((item) => item.indexOf(key) != -1);
      if (tempKey) {
        this.activeKeyword.splice(this.activeKeyword.indexOf(tempKey), 1);
      }
      this.activeKeyword.push(key + "-" + attr_name);
      // for (const key in this.formInline) {
      //   if (Object.hasOwnProperty.call(this.formInline, key)) {
      //     const attrValue = this.formInline[key];
      //     attr_name += attrValue
      //     attr_name += ' '
      //   }
      // }
      this.getSearchResultList(this.$refs.navSearch.keyword, cate_id);
    },
    clearSearch(key) {
      this.formInline[key] = "";
      let tempKey = this.activeKeyword.find((item) => item.indexOf(key) != -1);
      if (tempKey) {
        this.activeKeyword.splice(this.activeKeyword.indexOf(tempKey), 1);
      }
      // for (const key in this.formInline) {
      //   if (Object.hasOwnProperty.call(this.formInline, key)) {
      //     this.formInline[key] = ''
      //   }
      // }
      let cate_id = this.cate_id;
      let attr_name = "";
      for (const key in this.formInline) {
        if (Object.hasOwnProperty.call(this.formInline, key)) {
          const attrValue = this.formInline[key];
          if (attrValue) {
            attr_name += attrValue;
            attr_name += " ";
          }
        }
      }
      this.getSearchResultList(this.$refs.navSearch.keyword, cate_id);
      // this.getSearchResultList(this.$refs.navSearch.keyword)
    },
    handleChange(value) {
      console.log(value);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.getSearchResultList(this.$refs.navSearch.keyword);
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
    searchCategory(cate_id, item) {
      this.cate_id = cate_id;
      this.$refs.navSearch.keyword = item;
      this.getSearchResultList(this.$refs.navSearch.keyword, cate_id);
      this.$router.push({ path: "/searchresult", query: { keyword: item } });
    },
    priceSort() {
      if (this.top) {
        this.changePriceSort("bottom");
      } else {
        this.changePriceSort("top");
      }
    },
    changePriceSort(type) {
      if (type === "top") {
        if (this.top) {
          this.top = false;
        } else {
          this.top = true;
        }
        this.bottom = false;
        this.getSearchResultList(
          this.$refs.navSearch.keyword,
          this.cate_id,
          "asc"
        );
      } else if (type === "bottom") {
        if (this.bottom) {
          this.bottom = false;
        } else {
          this.bottom = true;
        }
        this.top = false;
        this.getSearchResultList(
          this.$refs.navSearch.keyword,
          this.cate_id,
          "desc"
        );
      }
    },
  },
};
</script>

<style lang="less" scoped>
.select-classification {
  margin-bottom: 8px;

  :deep(.el-input--mini .el-input__icon) {
    line-height: 24px;
  }

  .title {
    width: 60px;
    height: 16px;
    font-size: 12px;
    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
    font-weight: 400;
    text-align: left;
    color: #656565;
  }

  :deep(.el-input--mini .el-input__inner) {
    height: 24px;
  }
}

.category-sort {
  display: flex;
  background: #fff;
  margin-bottom: 10px;
  padding: 10px;

  .label {
    color:#000;
    width: 40px;
    font-size: 12px;
    font-weight: 700;
    margin: 5px 0px;
  }

  .category-item {
    flex: 1;

    ul {
      display: flex;
      flex-wrap: wrap;

      li {
        margin: 4px 7px;
        font-size: 12px;
        cursor: pointer;

        &:hover {
          color: #2263e8;
        }
      }
    }
  }
}

.steel-sort {
  background-color: #ffffff;
  margin-bottom: 8px;

  .steel-mill,
  .material-quality {
    padding: 0 12px;
    font-size: 12px;
    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
    color: #353535;

    label {
      font-weight: 700;
    }

    :deep(.el-form-item) {
      margin: 0;
    }

    ul {
      display: flex;
      align-content: flex-start;

      li {
        float: left;
        font-weight: 400;
        padding: 0 20px;
        margin: 5px 0;
      }

      li:hover {
        color: #2263e8;
        cursor: pointer;
      }
    }
  }
}

:deep(.el-pager li) {
  background: transparent;
}

:deep(.el-pagination button) {
  background: transparent;
}

.search-form {
  background-color: #ffffff;
  padding: 12px 12px;
  margin-bottom: 8px;

  :deep(.el-form-item) {
    margin-bottom: 0;
    margin-right: 12px;
  }

  :deep(.el-input__inner) {
    padding: 0 12px;
  }

  :deep(.el-form-item__label) {
    font-size: 12px;
    font-family: Microsoft YaHei, Microsoft YaHei-Bold;
    font-weight: 700;
    text-align: left;
    color: #353535;
  }

  :deep(.el-input--mini .el-input__inner) {
    height: 24px;
  }
}

.btn {
  padding: 0;
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
        cursor: pointer;
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

.page {
  display: flex;
  justify-content: flex-end;
}

.no-data {
  text-align: center;
  background-color: #fff;
  padding: 50px 0;

  .no-data-text {
    font-size: 12px;
    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
    font-weight: 400;
    text-align: center;
    color: #353535;
    line-height: 18px;
  }

  .not-found-text {
    font-size: 16px;
    font-family: Microsoft YaHei, Microsoft YaHei-Bold;
    font-weight: 700;
    text-align: center;
    color: #353535;
    line-height: 18px;
    position: relative;
    top: -50px;
  }

  .publish-demand {
    width: 120px;
    height: 40px;
    display: inline-block;
    line-height: 40px;
    background: #2263e8;
    border-radius: 2px;
    font-size: 14px;
    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
    font-weight: 400;
    color: #ffffff;
    margin: 20px;
    cursor: pointer;
  }
}
</style>

<style scoped>
.mian {
  width: 1184px;
  margin: 0 auto;
  padding: 8px 0 16px;
}
</style>
