<!-- 大宗商品订单  -->
<template>
  <div>
    <div v-if="!viewDetails" class="bulkOrder-page">
      <div class="title">订单列表</div>
      <div class="search-form">
        <el-form ref="searchForm" :model="searchForm" class="search-form-inline">
          <el-form-item label prop="order_sn" style="width:220px">
            <el-input v-model="searchForm.order_sn" placeholder="订单号"></el-input>
          </el-form-item>
          <el-form-item label prop="goods_name" style="width:220px">
            <el-input v-model="searchForm.goods_name" placeholder="商品名称"></el-input>
          </el-form-item>
          <el-form-item label prop="is_payed" style="width:220px">
            <el-select v-model="searchForm.is_payed" clearable placeholder="是否支付完成">
              <el-option label="已支付" :value="1"></el-option>
              <el-option label="未支付" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item >
            <el-button type="text" @click="onSubmit">搜索</el-button>
            <el-button type="text" @click="reset('searchForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-tabs v-model="searchForm.offline_status" @tab-click="handleClick">
        <el-tab-pane label="全部" name="-1"></el-tab-pane>
        <el-tab-pane
          v-for="(tab, i) in tabList"
          :label="tab.name"
          :name="tab.offline_status + ''"
          :key="i"
        ></el-tab-pane>
      </el-tabs>
      <div class="table-header">
        <div style="width:450px">商品</div>
        <div style="width:60px">数量</div>
        <div style="width:80px">单价</div>
        <div style="width:80px">货物金额</div>
        <div style="width:80px">总金额</div>
        <div style="width:100px">已支付金额</div>
        <div style="width:110px">操作</div>
      </div>
      <div v-if="total !== 0">
        <div v-for="(order, i) in tableData" :key="i" style="margin-bottom:20px;width: 1030px;">
          <el-table
            :data="order.showMore?order.order_goods:order.order_goods_show"
            style="width: 980px"
            header-row-class-name="table-header-style"
            :header-cell-style="handerMethod"
            :span-method="(obj) => { return arraySpanMethod(obj, order.order_goods.length) }"
          >
            <el-table-column prop="date" width="440">
              <template slot="header">
                <div class="order-title">
                  <span class="shop_name">店铺:{{ order.shop_name }}</span>
                  <span>订单号:{{ order.order_sn }}</span>
                </div>
              </template>
              <template slot-scope="scope">
                <div class="pro-desc">
                  <img :src="scope.row.image" style="width: 80px;height: 80px;" />
                  <div class="pro-name">
                    <p>{{ scope.row.goods_name }}</p>
                    <p
                      :title="scope.row.attr_name"
                      class="text-ellipsis-2"
                    >{{ scope.row.attr_name }}</p>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="number" align="center" width="80">
              <template slot="header" v-if="order.offline_status == 1">
                <div class="order-status">
                  <span class="status-text">{{ minusTime(order.auto_buyer_confirm_time) }}</span>
                </div>
              </template>
              <template slot="header" v-if="order.offline_status == 3">
                <div class="order-status">
                  <span class="status-text">{{ waitReceiveTime(order.auto_confirm_take_time) }}</span>
                </div>
              </template>
              <template slot-scope="scope">
                <div class="price-style">{{ scope.row.number }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="shop_price" align="center" width="80">
              <template slot-scope="scope">
                <div
                  v-if="order.offline_status < 1"
                  class="price-style"
                >{{ scope.row.shop_price == 0 ? '电议' : '￥' + scope.row.shop_price + '/' + scope.row.unit_name }}</div>
                <div
                  v-else
                  class="price-style"
                >{{ '￥' + scope.row.shop_price+ '/' + scope.row.unit_name }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="actual_price" align="center">
              <template slot-scope="scope">
                <div
                  v-if="order.offline_status < 1"
                  class="price-style"
                >{{ scope.row.actual_price == 0 ? '待定' : '￥' + scope.row.actual_price }}</div>
                <div v-else class="price-style">{{ '￥' + scope.row.actual_price }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="total_price" align="center">
              <template>
                <div class="price-style-bloder">
                  <!-- <span v-if="order.offline_status>=1">￥{{order.order_amount_actual == 0 ? order.order_amount : order.order_amount_actual}}</span>
                  <span v-else>{{ getOrderTotalPrice(order.order_goods, order.offline_status) }}</span>-->
                  <span>￥{{ order.buyer_amount }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="payed_amount" align="center" width="100">
              <template>
                <div
                  class="table-btn-info price-style-bloder"
                  v-if="(order.offline_status === 2 && order.payed_amount * 1 < order.order_amount * 1) ||
                                (order.offline_status === 3 && order.payed_amount * 1 < order.order_amount_actual * 1) ||
                                (order.offline_status === 4 && order.payed_amount * 1 < order.order_amount_actual * 1)"
                  @click="gotoPayVoucher(order.id, order.order_sn, order.order_amount_actual, order.order_amount, order.offline_status)"
                >上传支付凭证</div>
                <div class="price-style-bloder">￥{{ order.payed_amount }}</div>
              </template>
            </el-table-column>
            <el-table-column width="110" fixed="right" align="center">
              <template slot="header">
                <div class="order-status">
                  <span>
                    状态:
                    <span class="status-text">{{ order.offline_status_name }}</span>
                  </span>
                </div>
              </template>
              <template>
                <div
                  class="table-btn"
                  @click="confirmBuyBtn(order.id)"
                  v-if="order.offline_status === 1"
                >确认购买</div>
                <div class="text-btn confirm" @click="gotoDetails(order.id)">查看详情</div>
              </template>
            </el-table-column>
          </el-table>
          <div
            class="show-more"
            @click="order.showMore = !order.showMore"
            v-if="order.order_goods.length>4"
          >
            <span v-if="!order.showMore">显示其他{{order.order_goods.length - 4}}个产品</span>
            <span v-else>收起</span>
          </div>
        </div>
      </div>
      <emptyData v-else></emptyData>

      <!-- 分页 -->
      <el-pagination
        style="text-align: right; margin: 20px 0"
        small
        layout="prev, pager, next, jumper"
        :total="total"
        :page-count="10"
        :pager-count="5"
        :current-page="page"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <bulkOrderDetails
      type="buyer"
      v-else
      :orderId="orderId"
      @back="backList"
      @getOrderStatusCount="getOrderStatusCount"
    ></bulkOrderDetails>
    <ReturnedDialog @reload="getOrderList" :visible.sync="returnedDialogVisible" :info="selected" />
  </div>
</template>
<script>
/* eslint-disable */
import ReturnedDialog from "@/pages/returned/ReturnedDialog";
import { mapState } from "vuex";
import Api from "@/plugins/api";
import bulkOrderDetails from "./bulkOrderDetails.vue";
import emptyData from "@/components/emptyData.vue";

import defaultImg from "@/assets/images/default-img.png";

export default {
  name: "bulkOrder",
  layout: "personalCenter",
  middleware: "auth",
  components: {
    bulkOrderDetails,
    emptyData,
    ReturnedDialog,
  },
  data() {
    return {
      returnedDialogVisible: false,
      defaultImg,
      orderId: "",
      viewDetails: false,
      searchForm: {
        is_payed: "",
        goods_name: "",
        order_sn: "",
        offline_status: "-1",
        page: 1,
        limit: 10,
      },

      tableData: [],
      page: 1,
      total: 0,
      orderId: "",
      tabList: [],
      selected: {},
    };
  },
  directives: {
    splitTime(el, binding) {
      if (binding && binding.value) {
        let str = "";
        const arr = binding.value.split(" ");
        str = `<p>${arr[0]}</p><p>${arr[1]}</p>`;
        console.log(str);
        el.innerHTML = str;
      }
    },
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  mounted() {
    if (this.$route.query.order_id) {
      this.gotoDetails(this.$route.query.order_id);
    } else {
      this.getOrderList();
    }
  },
  methods: {
    showReturnedDialog(selected) {
      this.selected = selected;
      this.returnedDialogVisible = true;
    },
    gotoDetails(id) {
      this.$router.replace({ query: { order_id: id } });
      this.orderId = id;
      this.viewDetails = true;
    },
    backList() {
      this.$router.replace({ query: {} });
      this.viewDetails = false;
      this.getOrderList();
    },
    minusTime(time) {
      if (time) {
        return (
          "请在 " +
          this.$moment(time * 1000).format("yyyy年MM月DD日 HH:mm") +
          " 前确认订单"
        );
      } else {
        return "";
      }
    },
    waitReceiveTime(time) {
      if (time) {
        return (
          "请在 " +
          this.$moment(time * 1000).format("yyyy年MM月DD日 HH:mm") +
          " 前确认收货"
        );
      } else {
        return "";
      }
    },
    dateFormatter(t, formatter = "yyyy-MM-DD HH:mm:ss") {
      t = t * 1000;
      return this.$moment(t).format(formatter);
    },
    handerMethod({ row, column, rowIndex, columnIndex }) {
      row[0].colSpan = 1;
      row[1].colSpan = 5;
      if (columnIndex === 2) {
        return { display: "none" };
      }
      if (columnIndex === 3) {
        return { display: "none" };
      }
      if (columnIndex === 4) {
        return { display: "none" };
      }
      if (columnIndex === 5) {
        return { display: "none" };
      }
    },
    arraySpanMethod(obj, length) {
      const { rowIndex, columnIndex } = obj;
      if (columnIndex >= 4) {
        if (rowIndex === 0) {
          return {
            rowspan: length,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    },
    getOrderTotalPrice(goods, status) {
      const price = goods.map((item) => Number(item.actual_price));
      if (status < 1 && price.includes(0)) {
        return "待定";
      } else {
        return (
          "￥" +
          (
            price.reduce((total, cur) => {
              return Number(total) + Number(cur);
            }, 0) * 1
          ).toFixed(2)
        );
      }
    },
    getOrderStatusCount() {
      this.$request.get(Api.getOrderStatusCount).then((res) => {
        this.tabList = [];
        res.data.forEach((item, i) => {
          let countStr = item.total > 0 ? "（" + item.total + "）" : "";
          switch (item.offline_status) {
            case 0:
              this.tabList.push({
                ...item,
                name: "待卖家确认" + countStr,
              });
              break;
            case 1:
              this.tabList.push({
                ...item,
                name: "待买家确认" + countStr,
              });
              break;
            case 4:
              this.tabList.push({
                ...item,
                name: "已完成" + countStr,
              });
              break;
            default:
              break;
          }
        });
      });
    },
    // 上传支付凭证
    gotoPayVoucher(
      order_id,
      order_sn,
      order_amount_actual,
      order_amount,
      offline_status
    ) {
      if (offline_status <= 2) {
        // 完成发货前，支付金额显示预估金额
        this.$router.push({
          path: "/payVoucher",
          query: {
            order_id: order_id,
            order_sn: order_sn,
            goods_amount: order_amount,
          },
        });
      }
      if (offline_status > 2) {
        // 完成发货后，支付金额显示实际金额
        this.$router.push({
          path: "/payVoucher",
          query: {
            order_id: order_id,
            order_sn: order_sn,
            goods_amount: order_amount_actual,
          },
        });
      }
    },
    // 获取订单列表
    getOrderList() {
      const params = JSON.parse(JSON.stringify(this.searchForm));
      if (params.offline_status == -1) {
        delete params.offline_status;
      }
      this.tableData = [];
      const that = this;
      this.$request.get(Api.getOrderList, { params }).then((res) => {
        this.tableData = res.data.map((item) => {
          if (item.order_goods.length > 4) {
            return {
              ...item,
              order_goods_show: item.order_goods.slice(0, 4),
              showMore: false,
            };
          } else {
            return {
              ...item,
              order_goods_show: item.order_goods,
              showMore: false,
            };
          }
        });
        this.total = res.count;
        this.getOrderStatusCount();
      });
    },
    // 取消订单
    cancelOrder(id) {
      this.$request.post(Api.cancelOrder, { order_id: id }).then((res) => {
        if (res.code === 0) {
          this.$message.success("取消订单成功");
          this.getOrderList();
        }
      });
    },
    // 确认收货
    confirmReceive(id) {
      this.$request.post(Api.confirmShipping, { order_id: id }).then((res) => {
        if (res.code === 0) {
          this.$message.success("确认收货成功");
          this.getOrderList();
        }
      });
    },
    confirmBuyBtn(id) {
      this.orderId = id;
      this.viewDetails = true;
    },
    // 确认订单
    confirmOrder(id) {
      this.$request.get(Api.confirmOrder, { order_id: id }).then((res) => {
        if (res.code === 0) {
          this.$message.success("确认收货成功");
          this.getOrderList();
        }
      });
    },
    onSubmit() {
      this.searchForm.page = 1;
      this.getOrderList();
    },
    reset(formName) {
      this.$refs[formName].resetFields();
      this.searchForm.is_payed = "";
      this.searchForm.page = 1;
      this.getOrderList();
    },
    handleCurrentChange(val) {
      this.searchForm.page = val;
      this.getOrderList();
    },
    handleClick(tab) {
      this.searchForm.page = 1;
      this.searchForm.offline_status = tab.name;
      this.getOrderList();
    },
  },
};
</script>
<style lang="less" scoped>
:deep(.el-tabs__nav-wrap::after) {
  background-color: #fff;
}
:deep(.el-tabs__active-bar) {
  color: #257ff8;
  height: 3px;
}
.bulkOrder-page {
  background-color: #fff;
  padding: 20px;
  box-sizing: border-box;
  min-height: 750px;
  .title {
    font-weight: bold;
    font-size: 18px;
    color: #0a1833;
    line-height: 21px;
    margin-bottom: 20px;
  }

  .search-form {
    height: 66px;
    display: flex;
    align-items: center;
    background: rgba(137, 147, 165, 0.06);
    border-radius: 2px;
    padding: 15px;
    box-sizing: border-box;

    .search-form-inline {
      display: flex;

      :deep(.el-form-item) {
        margin: 0 5px;
        width: 120px;

        &.time {
          width: 350px;
          display: flex;

          .line {
            text-align: center;
          }

          .el-form-item__label {
            width: 120px !important;
          }

          .el-form-item__content {
            margin: 0 !important;
          }
        }

        &.search-form-btn {
          width: 150px;
          display: flex;
          justify-content: space-around;
          align-items: center;

          .el-form-item__content {
            display: flex;
            justify-content: space-around;
            align-items: center;

            .el-button {
              padding: 0;
              width: 52px;
              height: 26px;
              line-height: 26px;
              text-align: center;
              background: #2277e8;
              border-radius: 2px;
              color: #fff;
            }

            .reset-btn {
              background: #959595;
            }
          }
        }

        .el-input__inner {
          border: 1px solid #d5d5d5;
          border-radius: 2px;
          height: 32px;
          line-height: 32px;
        }
      }
    }
  }

  .btn-group {
    display: flex;

    .btn {
      width: 80px;
      height: 28px;
      line-height: 28px;
      text-align: center;
      background: #ffffff;
      border: 1px solid #d5d5d5;
      border-radius: 2px;
      margin-bottom: 10px;
      margin-right: 10px;
      font-size: 12px;
      color: #353535;
      cursor: pointer;
      padding: 0;
    }

    .pub-btn {
      background: #2277e8;
      color: #ffffff;
    }
  }

  .product-name-p {
    font-size: 14px;
    color: #353535;
    text-align: left;
    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
    font-weight: 400;
  }

  .product-attr-p {
    font-size: 12px;
    color: #353535;
    text-align: left;
    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
    font-weight: 400;
  }
}
:deep(.el-table th.el-table__cell.is-leaf) {
  border: 0 !important;
  width: 980px;
  height: 50px;
  background: rgba(137, 147, 165, 0.06);
  box-shadow: 0px 1px 0px 0px #eaebf0;
  border-radius: 0px 0px 0px 0px;
}
:deep(.el-table .el-table__cell) {
  padding: 20px 0;
}

:deep(.el-table .cell) {
  padding-left: 5px !important;
  padding-right: 2px !important;
}

:deep(.table-header-style th) {
  background: rgba(137, 147, 165, 0.06);

  th {
    background: transparent;
  }
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 36px;
  border-radius: 2px;
  margin-bottom: 10px;

  div {
    width: 70px;

    text-align: center;
    font-size: 14px;
    color: #43546f;
    line-height: 16px;
  }
}

.order-title {
  display: flex;
  // justify-content: space-between;
  align-items: center;
  font-size: 12px;
  font-weight: 400;
  color: #8993A5;



  .shop_name {
    display: inline-block;
    width: 240px;
    margin-right: 5px;
padding-left: 20px;
box-sizing: border-box;
font-size: 15px;
color: #0A1833;
line-height: 21px;

  }
}

.order-status {
  font-size: 12px;
  font-weight: 400;
  color: #353535;
  text-align: right;
  padding-right: 5px;

  .status-text {
    color: #e84b01;
  }
}

:deep(.el-table__body-wrapper)::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

:deep(.el-table__body-wrapper)::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #cccccc;
}

:deep(.el-table__body-wrapper)::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background-color: #e5e5e5;
}

.pro-desc {
  display: flex;
  align-items: center;
  padding:0 20px;
  box-sizing: border-box;
  .pro-name {
    margin: 0 5px;
    font-size: 12px;
    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
    font-weight: 400;
    text-align: left;

    p:first-child {
      color: #353535;
      padding: 0;
    }

    p:last-child {
      color: #959595;
      padding: 0;
    }
  }
}

.table-btn {
  width: 80px;
  height: 34px;
  background: #2277e8;
  border: 1px solid #2277e8;
  border-radius: 2px;
  font-size: 12px;
  font-family: Microsoft YaHei, Microsoft YaHei-Regular;
  font-weight: 400;
  text-align: center;
  color: #ffffff;
  line-height: 34px;
  margin: 5px auto;
  cursor: pointer;
}

.table-btn-info {
  width: 80px;
  height: 30px;
  background: #fff;
  border: 1px solid #d5d5d5;
  border-radius: 2px;
  font-size: 12px;
  font-family: Microsoft YaHei, Microsoft YaHei-Regular;
  font-weight: 400;
  text-align: center;
  color: #656565;
  line-height: 30px;
  margin: 5px 0;
  cursor: pointer;
}

.text-btn {
  font-size: 12px;
  color: #656565;
  cursor: pointer;
}
.price-style {
  font-weight: 400;
  font-size: 13px;
}
.price-style-bloder {
  font-weight: 700;
  font-size: 12px;
}
.show-more {
  text-align: center;
  padding: 4px;
  background-color: #efefef;
  border: 1px solid #d5d5d5;
  font-size: 12px;
  color: #353535;
  cursor: pointer;
}
</style>
  