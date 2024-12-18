<template>
  <div class="supply wrap">
    <Functional :show="['购物车','我的订单','我的产品']" />
    <div class="content">
      <div class="search-bar row-sw">
        <span class="label-title">交易大厅</span>
        <el-input clearable placeholder="请输入内容" v-model="keyword" style="width: 590px;height:40px">
          <i class="el-icon-search" :size="21" slot="prefix"></i>
          <el-button
            @click="reload"
            slot="append"
            type="primary"
            style="width: 89px;height:40px;background: #257FF8;color:#fff;border-radius:0"
          >搜索</el-button>
        </el-input>

        <button
          class="product btn col-center row-center"
          @click="$router.push('/storeManagement/productStore')"
        >
          <el-image
            style="width:22px;height:22px;margin-right:6px"
            :src="require('../../assets/imgs/icon_product2.png')"
          ></el-image>
          <span class="col-center">我的产品</span>
        </button>
      </div>
      <div class="category">
        <div class="line border col-center leave1">
          <div class="item">商品名称：</div>

          <div
            class="item col-center"
            :class="active1 == '' ? 'active' : ''"
            @click="setActive('', 1)"
          >全部</div>

          <div
            class="item"
            :class="active1 == item.id ? 'active' : ''"
            v-for="item in category"
            :key="item.id"
            @click="setActive(item.id, 1)"
          >{{ item.name }}</div>
          <el-button class="fix" type="text" @click="resetActive">全部重置</el-button>
        </div>

        <div class="line border col-center">
          <div class="item">商品分类：</div>

          <div
            class="item col-center"
            :class="active2 == '' ? 'active' : ''"
            @click="setActive('', 2)"
          >全部</div>

          <div
            class="item"
            :class="active2 == item.id ? 'active' : ''"
            v-for="item in getCateGoryLeave2List"
            :key="item.id"
            @click="setActive(item.id, 2,item)"
          >{{ item.name }}</div>

          <!-- <el-button
            class="fix"
            type="text"
            @click="showMoreByLevel2 = !showMoreByLevel2"
          >{{showMoreByLevel2?'折叠':'更多'}}</el-button> -->
        </div>

        <div class="line col-center">
          <div class="item">应用场景：</div>

          <div
            class="item col-center"
            :class="active3 == '' ? 'active' : ''"
            @click="setActive('', 3)"
          >全部</div>

          <div
            class="item"
            :class="active3 == item.id ? 'active' : ''"
            v-for="item in getCateGoryLeave3List"
            :key="item.id"
            @click="setActive(item.id, 3)"
          >{{ item.name }}</div>

          <!-- <el-button
            class="fix"
            type="text"
            @click="showMoreByLevel3 = !showMoreByLevel3"
          >{{showMoreByLevel3?'折叠':'更多'}}</el-button> -->
        </div>
      </div>
      <div class="list flex" v-if="dataList.length > 0">
        <div
          class="item"
          v-for="item in dataList"
          :key="item.id"
          @click="$router.push('/productDetails?id='+item.sku_id)"
        >
          <div class="box">
            <div class="header row-sw">
              <el-image :src="item.image_url" style="width:70px;height:70px"></el-image>
              <div class="info flex1">
                <div class="name row-sw">
                  <span class="text">{{ item.name }}</span>
                  <!-- <span class="status">{{item.charge_mode }}</span> -->
                </div>
                <div class="brief col-center">
                  <el-image
                    style="width:16px;height:16px;margin-right:4px"
                    :src="require('../../assets/imgs/icon_image.png')"
                  ></el-image>
                  <span>人工交付</span>
                </div>
                <div class="tags flex">
                  <span class="tag col-center">{{ item.goods_categorys[0] }}</span>
                  <span class="tag col-center">{{ item.goods_categorys[1] }}</span>
                  <span class="tag col-center">{{ item.goods_categorys[2] }}</span>
                </div>
              </div>
            </div>
            <div class="company col-center">
              <el-image
                style="width:14px;height:14px;margin-right:5px"
                :src="require('../../assets/imgs/icon_company.png')"
              ></el-image>
              <span>{{ item.shop_name }}</span>
            </div>
            <div class="desc line2-ellipsis">{{ item.brief }}</div>
          </div>

          <div class="item-footer">
            <div class="tips">应用场景：{{ item.jf_info }}</div>
            <span class="status">
              <img src="../../assets/imgs/mony.png">
              <span>{{item.charge_mode }}</span>
            </span>
          </div>
        </div>
      </div>
      <div class="col-center row-center" style="min-height: 450px;" v-if="dataList.length == '0'">
        <el-empty :image-size="200"></el-empty>
      </div>
      <el-pagination
        style="text-align: right; margin: 20px 0"
        small
        :total="total"
        :pager-count="5"
        :current-page="page"
        :page-size="limit"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import config from "@/config";
import axios from "axios";
import Api from "../../plugins/api";
export default {
  name: "productionPage",
  layout: "hall",

  methods: {
    resetActive() {
      this.active1 = "";
      this.active2 = "";
      this.active3 = "";
      this.reload();
    },
    setActive(id, index,item) {
      this["active" + index] = id;

      if(index == '1') {
        this.active2 = "";
        this.active3 = "";
      }else if(index == '2') {
        this.active3 == ""
      }
      if(id&&index == '2') {
        this.active1 = item.parent_id || ''
      }
      this.$nextTick(() => {
        this.getProductList();
      });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getProductList();
    },
    getCateId() {
      const { active1, active2, active3 } = this;
      var cat1_id = "";
      var cat2_id = "";
      var cat3_id = "";
      if (active3) {
        cat3_id = active3;
      }
      if (active2) {
        cat2_id = active2;
      }
      if (active1) {
        cat1_id = active1;
      }
      return {
        cat1_id,
        cat2_id,
        cat3_id,
      };
    },
    reload() {
      this.page = 1;
      this.getProductList();
    },
    getProductList() {
      this.$request
        .get(Api.indexProductList, {
          params: {
            keyword: this.keyword,
            page: this.page,
            limit: this.limit,
            ...this.getCateId(),
          },
        })
        .then((res) => {
          this.total = res.count;
          this.dataList = res.data.lists;
        });
    },
  },
  asyncData({ query }) {
    return axios
      .all([
        axios.get(config.baseUrl + Api.indexProductList, {
          params: { page: 1, limit: 9 },
        }),
        axios.get(config.baseUrl + Api.getGoodsCategoryTree, {}),
      ])
      .then(
        axios.spread(function (res, res2) {
          return {
            dataList: res.data.data.lists,
            total: res.data.count,
            category: res2.data.data,
          };
        })
      );
  },
  computed: {
    getCateGoryLeave3List() {
      //获取二级分类
      const { getCateGoryLeave2List, active2, showMoreByLevel3 } = this;
      var list = [];
      var result = [];
      getCateGoryLeave2List.forEach((element) => {
        //2级
        if (element.children && element.children.length) {
          //3级
          list.push(...element.children);
        }
      });

      if (!active2) { //2级为全部时3级只显示全部
        result = [];
      } else {
        result = list.filter((item) => {
          return active2 == item.parent_id;
        });
      }
      // if (!showMoreByLevel3) {
      //   result = result.slice(0, 10);
      // }

      return result;
    },
    getCateGoryLeave2List() {
      //获取二级分类
      const { category, active1, showMoreByLevel2 } = this;
      var list = [];
      var result = [];
      category.forEach((element) => {
        //1级
        if (element.children && element.children.length) {
          //2级
          list.push(...element.children);
        }
      });

      if (!active1) {
        result = [];
      } else {
        result = list.filter((item) => item.parent_id == active1);
      }

      // if (!showMoreByLevel2) {
      //   result = result.slice(0, 10);
      // }

      return result;
    },
  },
  data() {
    return {
      page: 1,
      limit: 9,
      dataList: [],
      total: 0,
      category: [],
      active1: "",
      active2: [],
      active3: [],
      keyword: "",
      showMoreByLevel2: false,
      showMoreByLevel3: false,
    };
  },
};
</script>

<style scoped lang="less">
.product.btn {
  width: 112px;
  height: 40px;
  background: #ffffff;
  border-radius: 6px 6px 6px 6px;
  border: 1px solid #21bc72;
  font-size: 16px;
  color: #21bc72;
  line-height: 19px;
  padding: 0;
  cursor: pointer;
}
.list {
  margin-top: 30px;
  min-height: 60vh;
  flex-wrap: wrap;

  .item {
    width: 420px;
    height: 230px;
    background: #ffffff;
    border-radius: 6px 6px 6px 6px;
    margin-bottom: 24px;
    cursor: pointer;
    box-sizing: border-box;
    margin-right: 20px;
    &:nth-of-type(3n) {
      margin-right: 0;
    }
    .item-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .status {
        border-radius: 15px 0px 0px 15px;
        background: linear-gradient(90deg, #257FF8 0%, #0361E9 100%);
        display: flex;
        align-items: center;
        padding: 4px 7px;
        img {
          width: 18px;
        }
        span {
          font-size: 16px;
          color: #ffffff;
          margin-left: 3px;
        }
      }
    }
    .tips {
      line-height: 47px;
      padding-left: 20px;
      box-sizing: border-box;
      font-size: 12px;
      color: #43546f;
    }
    .box {
      padding: 20px;
      border-bottom: 1px solid #eeeeee;
    }

    .company {
      margin-top: 13px;
      font-size: 12px;
      color: #b6bcc7;
      line-height: 14px;
      margin-bottom: 9px;
    }

    .desc {
      font-size: 12px;
      color: #8993a5;
      line-height: 14px;
    }

    .info {
      margin-left: 10px;

      .tags {
        .tag {
          padding: 0 6px;
          height: 20px;
          border-radius: 4px 4px 4px 4px;
          margin-right: 6px;
          font-size: 12px;
          &:nth-of-type(1) {
            color: #21bc72;
            border: 1px solid #21bc72;
          }
          &:nth-of-type(2) {
            color: #257ff8;
            border: 1px solid #257ff8;
          }
          &:nth-of-type(3) {
            color: #8966a0;
            border: 1px solid #8966a0;
          }
        }
      }

      .brief {
        margin-top: 5px;
        font-size: 12px;
        color: #8993a5;
        line-height: 14px;
        margin-bottom: 6px;
      }

      .text {
        font-weight: 500;
        font-size: 16px;
        color: #0a1833;
      }

    }
  }
}

.category {
  width: 100%;
  background: #ffffff;
  border-radius: 6px 6px 6px 6px;
  border: 1px solid #c3d3e2;
  box-sizing: border-box;
  padding: 10px;

  .line {
    width: 100%;
    padding: 12px 60px 12px 0;
    background: #ffffff;
    flex-wrap: wrap;
    position: relative;
    box-sizing: border-box;
    font-size: 14px;
    color: #0a1833;
    .fix {
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
    }
    .item {
      padding: 3px 6px;
      margin-right: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;

      &.active {
        height: 27px;
        background: #257ff8;
        border-radius: 4px 4px 4px 4px;
        color: #fff;
      }
    }

    &.border {
      box-shadow: inset 0px -1px 0px 0px rgba(204, 204, 204, 0.25);
      border-radius: 0px 0px 0px 0px;
    }
  }
}

.publish.btn {
  color: #257ff8;
  border: 1px solid #257ff8;
}

.search-bar {
  padding: 48px 200px 68px;

  .el-icon-search {
    font-size: 21px;
    display: flex;
    align-items: center;
    height: 100%;
    line-height: 100%;
    margin-left: 4px;
  }
  .label-title {
    font-weight: bold;
    font-size: 30px;
    color: #257ff8;
    line-height: 35px;
    letter-spacing: 1px;
  }
  .search {
    width: 89px;
  }
}
</style>