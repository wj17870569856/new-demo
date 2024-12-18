<template>
  <div class="wrap">
    <Functional :show="['购物车', '我的订单', '我的产品']" />
    <div class="content">
      <Breadcrumb :list="breadcrumb" />
      <div class="info">
        <div class="top row-sw">
          <div class="left border pos-r">
            <el-carousel height="451px" ref="goods_albumRef">
              <el-carousel-item v-for="(item,index) in productDetails.goods_album" :key="index">
                <el-image :src="item.img_url_domain" style="width:100%;height:100%" fit="fill"></el-image>
              </el-carousel-item>
            </el-carousel>

            <div
              class="view flex pos-abs"
              v-if="productDetails.goods_album && productDetails.goods_album.length"
            >
              <div
                @mouseenter="$refs['goods_albumRef'].setActiveItem(index)"
                class="img"
                v-for="(item, index) in productDetails.goods_album"
                :key="index"
              >
                <el-image fit="fill" :src="item.img_url_domain" style="width:100%;height:100%"></el-image>
              </div>
            </div>
          </div>
          <div class="right flex1">
            <div class="line1 row-sw col-center">
              <div class="left col-center">
                <h2>{{ productDetails.name }}</h2>
                <!-- <span class="tag">人工交付</span>
                <el-image
                  style="width:21px;height:21px;"
                  :src="require('../../assets/imgs/icon_image.png')"
                ></el-image>
                <span class="tips">DEXC+基础</span>-->
              </div>
              <div class="right">参考价</div>
            </div>
            <div class="desc row-sw">
              <span class="text">{{ productDetails.brief }}</span>
              <span class="price">{{ productDetails.charge_mode }}</span>
            </div>
            <div class="column row-sw">
              <div class="left col-center">
                计费方式：
                <span class="flex">{{ productDetails.charge_mode }}</span>
              </div>
              <div class="right">
                <div class="label">已成交</div>
                <div class="value">{{productDetails.order_num || '0'}} 笔</div>
              </div>
            </div>
            <div class="column row-sw">
              <div class="left col-center">
                交付方式：
                <span>人工交付</span>
              </div>
              <!-- <div class="right">
                <div class="label">用户评分</div>
                <div class="value">9.0</div>
              </div>-->
            </div>

            <div class="btns">
              <button class="btn add" @click="addOrder({ number: count, sku_id: id })">加入购物车</button>
              <button class="btn buy" @click="buyNow">立即购买</button>
            </div>
            <div class="company-info col-center">
              <el-image
                :src="require('../../assets/imgs/icon_company.png')"
                style="width:24px;height:21px;margin-right:5px"
              ></el-image>
              <span>{{  productDetails.company_info.company_name }}</span>

              <el-tooltip
                class="item"
                :content="productDetails.company_info.phone || '该企业未设置电话'"
                placement="right-start"
              >
                <a href="#">立即咨询</a>
              </el-tooltip>
            </div>
          </div>
        </div>
        <div class="detail">
          <div class="tabs flex">
            <div
              @click="tabActive = index"
              class="tab flex1 col-center row-center"
              v-for="(item, index) in tabs"
              :key="index"
              :class="index == tabActive ? 'active' : ''"
            >
              {{
              item }}
            </div>
          </div>
          <div class="info-view">
            <div v-html="productDetails.describe" v-show="tabActive == '0'"></div>
            <div v-show="tabActive == '1'">
              <el-image
                v-for="(item,index) in productDetails.goods_cert_arr
"
                :src="item.img_url"
                :key="index"
              ></el-image>
            </div>
            <div v-show="tabActive == '2'">
              <el-table :data="productDetails.sku_list" border>
                <el-table-column
                  :label="item.attr_name"
                  align="center"
                  v-for="(item,index) in productDetails.sku_attr"
                  :key="'attr'+item.id"
                >
                  <template slot-scope="{row}">{{ row.sku_attr[index].attr_value }}</template>
                </el-table-column>
                <el-table-column label="销售价" align="center" prop="sku_shop_price">
                  <template slot-scope="{row}">{{Number( row.sku_shop_price / 100 ).toFixed(2)}}</template>
                </el-table-column>
                <el-table-column label="成本价" align="center" prop="sku_cost_price">
                  <template slot-scope="{row}">{{Number( row.sku_cost_price / 100 ).toFixed(2)}}</template>
                </el-table-column>
                <el-table-column label="起订量" align="center" prop="min_sale"></el-table-column>
                <el-table-column label="单位" align="center">
                  <template slot-scope="{row}">{{ getAttr(unitList,row.unit) }}</template>
                </el-table-column>
                <el-table-column label="库存状态" align="center">
                  <template slot-scope="{row}">{{ getAttr(stockStatus,row.stock_status) }}</template>
                </el-table-column>
                <el-table-column label="上架状态" align="center">
                  <template slot-scope="{row}">{{ getAttr(OnSaleList,row.is_on_sale) }}</template>
                </el-table-column>
              </el-table>
            </div>
            <div v-show="tabActive == '3'">
              <div class="company-info col-center">
                <el-image
                  :src="require('../../assets/imgs/icon_company.png')"
                  style="width:24px;height:21px;margin-right:10px"
                ></el-image>
                <span>{{  productDetails.company_info.company_name }}</span>
              </div>
              <div class="column col-center">
                <div class="label col-center row-center">主营产品</div>
                <div class="value flex1">{{ productDetails.company_info.main_product }}</div>
              </div>
              <div class="column col-center" v-if="productDetails.company_info">
                <div class="label col-center row-center" >公司地址</div>
                <div class="value flex1 col-center">
                  {{ productDetails.company_info.address }}
                  <el-image
                    :src="require('../../assets/imgs/icon_location.png')"
                    style="width: 16px;height:16px;margin:0  5px 0 40px;"
                  ></el-image>
                  <a
                    :href="'https://uri.amap.com/marker?position='+companyLocationInfo.location+'&name='+productDetails.company_info.address"
                  >地图查看</a>
                </div>
              </div>
              <div class="column col-center">
                <div class="label col-center row-center">联系人</div>
                <div class="value flex1 col-center">
                  {{ productDetails.company_info.contacts }}
                  <el-image
                    :src="require('../../assets/imgs/icon_call.png')"
                    style="width: 16px;height:16px;;margin:0  5px 0 40px;"
                  ></el-image>

                  <el-tooltip
                    class="item"
                    :content="productDetails.company_info.phone  || '该企业未设置电话'"
                    placement="right-start"
                  >
                    <a href="#">联系商家</a>
                  </el-tooltip>
                </div>
              </div>
              <div class="column col-center">
                <div class="label col-center row-center">其他</div>
                <div class="value flex1">
                  <span>成立日期：{{ productDetails.company_info.establishment_date }}</span>
                  <span
                    style="margin-left: 100px;"
                  >注册资本：{{ productDetails.company_info.registered_capital }}万元</span>
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
import config from "@/config";
import Api from "../../plugins/api";
import axios from "axios";
import Breadcrumb from "@/components/Breadcrumb";
export default {
  layout: "hall",
  name: "productionDetail",
  components: {
    Breadcrumb,
  },
  mounted() {
    this.getSKUStateSelect();
    this.getLocation();
  },
  methods: {
    getLocation() {
      var url =
        "https://restapi.amap.com/v3/geocode/geo?key=" +
        config.gaoDeKey +
        "&address=" +
        encodeURIComponent(this.productDetails.company_info.address);
      axios.get(url).then((res) => {
        this.companyLocationInfo = res.data.geocodes[0];
      });
    },
    getAttr(arr, id) {
      const result = arr.find((item) => item.id == id);
      return result ? result.name : "";
    },
    // 获取下拉选
    getSKUStateSelect() {
      return this.$request.get(Api.getSKUStateSelect).then((res) => {
        if (res.code === 0) {
          this.unitList = res.data.unit;
          this.stockStatus = res.data.stock_status;
          this.OnSaleList = res.data.is_on_sale;
        }
      });
    },
    buyNow() {
      const number = {};
      number[this.productDetails.sku_id] = this.count;
      this.$router.push({
        path: "/purchaseorder/settlement",
        query: {
          type: 2,
          sku_id: [this.id],
          number: JSON.stringify(number),
        },
      });
    },
    addOrder(data) {
      this.$request.post(Api.addGoodsCart, data).then((res) => {
        if (res.code === 0) {
          this.$message.success("加购成功");
          this.$request.get(Api.getGoodsCartCount).then((res) => {
            this.$store.commit("setGoodsCartCount", res.data);
          });
        } else {
          this.$message.error(res.msg);
        }
      });
    },
  },
  asyncData({ query }) {
    let url = config.baseUrl + Api.indexProductDetail;

    return axios.all([axios.get(url, { params: { sku_id: query.id } })]).then(
      axios.spread(function (res) {
        return {
          productDetails: res.data.data,
          id: query.id,
        };
      })
    );
  },
  data() {
    return {
      companyLocationInfo: {},
      goodsAlbumIndex: 0,
      unitList: [],
      stockStatus: [],
      OnSaleList: [],
      AllAttrList: [], // 选中的属性
      id: "",
      count: 1,
      tabActive: 0,
      tabs: ["详情介绍", "产品资质", "商品价格", "公司介绍"],
      productDetails: {},
      breadcrumb: [
        {
          name: "交易大厅",
          path: "/productList",
        },
        {
          name: "详情介绍",
        },
      ],
    };
  },
};
</script>

<style scoped lang="less">
.border {
  border: 4px solid #257ff8;
  width: 564px;
}

.company-info {
  margin-top: 24px;
  font-size: 16px;
  color: #8993a5;

  display: flex;
  justify-content: flex-end;

  a {
    margin-left: 10px;
    font-size: 16px;
    color: #257ff8;
  }
}

.btns {
  display: flex;
  margin-top: 100px;
  justify-content: flex-end;

  .btn {
    width: 120px;
    height: 54px;
    border-radius: 4px 4px 4px 4px;
    font-weight: 500;
    font-size: 20px;
    color: #ffffff;
    border: none;
    margin-left: 20px;
    cursor: pointer;
    &.add {
      background: #ff2618;
    }

    &.buy {
      background-color: #257ff8;
    }
  }
}

.info {
  background-color: #fff;
  padding: 30px 30px 30px 15px;
}

.content {
}

.detail {
  margin-top: 60px;
  min-height: 680px;

  .column {
    font-size: 16px;
    color: #0a1833;
    line-height: 19px;
    padding: 20px 0;
    height: 44px;
    border-bottom: 1px solid #eaebf0;
    .value {
      margin-left: 40px;
      a {
        color: #257ff8;
      }
    }
    .label {
      width: 100px;
      color: #43546f;
      height: 100%;
      background: rgba(37, 127, 248, 0.06);
      position: relative;
      &::after {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        content: "";
        width: 3px;
        height: 44px;
        background: #257ff8;
      }
    }
  }

  .company-info {
    justify-content: flex-start;
    margin-top: 0;
    font-weight: bold;
    font-size: 18px;
    color: #0a1833;
    line-height: 21px;
  }

  .info-view {
    padding: 30px;
  }

  .tabs {
    width: 480px;

    .tab {
      width: 120px;
      height: 60px;
      background: #ffffff;
      border-radius: 0px 0px 0px 0px;
      border: 1px solid #8993a5;
      box-sizing: border-box;
      font-size: 18px;
      color: #8993a5;
      cursor: pointer;

      &.active {
        border: 1px solid #257ff8;
        color: #257ff8;
      }
    }
  }
}

.view {
  bottom: 30px;
  left: 16px;
  cursor: pointer;
  z-index: 9999;
  .img {
    width: 97px;
    height: 97px;
    border: 4px solid #ffffff;
    box-sizing: border-box;
    margin-right: 12px;
    &:hover {
    border: 4px solid #257ff8;
  }
  }

}

.column {
  margin-bottom: 20px;

  .right {
    flex-direction: column;

    .label {
      font-size: 18px;
      color: #8993a5;
      line-height: 21px;
      text-align: right;
    }

    .value {
      text-align: right;
      font-size: 18px;
      color: #43546f;
      line-height: 21px;
      margin-top: 6px;

      text-transform: none;
    }
  }

  .left {
    font-size: 18px;
    color: #43546f;

    span {
      display: inline-block;
      height: 40px;
      background: rgba(37, 127, 248, 0.1);
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #257ff8;
      padding: 0 24px;
      font-size: 18px;
      color: #257ff8;
      line-height: 40px;
    }
  }
}

.desc {
  margin-bottom: 24px;

  .text {
    font-size: 18px;
    color: #8993a5;
    line-height: 21px;
    margin-top: 20px;
    flex: 1;
  }

  .price {
    font-weight: 500;
    font-size: 40px;
    color: #ff2618;
    line-height: 47px;
    margin-left: 40px;
    margin-top: 6px;
  }
}

.right {
  margin-left: 40px;

  .right {
    font-size: 18px;
    color: #8993a5;
    line-height: 21px;
  }

  h2 {
    font-weight: 500;
    font-size: 24px;
    color: #0a1833;
    line-height: 28px;
  }

  .tag {
    height: 26px;
    background: rgba(33, 188, 114, 0.1);
    border-radius: 4px 4px 4px 4px;
    border: 1px solid #21bc72;
    padding: 0 11px;
    margin-left: 6px;
    margin-right: 10px;
    display: inline-block;
    line-height: 26px;
    font-size: 12px;
    color: #21bc72;
  }

  .tips {
    margin-left: 4px;
    font-size: 14px;
    color: #8993a5;
    line-height: 16px;
  }
}
</style>