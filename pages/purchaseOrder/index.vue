<template>
  <div class="wrap cart">
    <div class="content">

      <Breadcrumb :list="breadcrumb" />
      <div class="view">

        <div class="send-to col-center row-sw">
          <h3>购物车</h3>
          <div class="location">
            <span>配送至：</span>
            <el-select size="small" v-model="targetAddress" style="width: 130px" placeholder="请选择">
              <el-option v-for="item in cityOptions" :key="item.citycode" :label="item.name" :value="item.name">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="table-header">
          <div class="header">
            <div class="header-wrapper">
              <div class="w-60">
                <el-checkbox v-model="allCheck" @change="checkedAll">全选</el-checkbox>
              </div>
              <div class="header-col-name w-flex">商品</div>
              <div class="header-col-name center w-120">单价</div>
              <div class="header-col-name center w-120">数量</div>
              <div class="header-col-name center w-120">小计</div>
              <div class="header-col-name center w-60">操作</div>
            </div>
          </div>
          <div class="table-container">
            <div v-if="tableData.length != 0">
              <div v-for="store in tableData" :key="store.shop_id">
                <el-table :ref="`storeTable_${store.shop_id}`" :data="store.children" style="width: 100%"
                  @selection-change="getAllCheckedPro" :row-class-name="tableRowClassName" :row-style="rowCheckStyle">
                  <el-table-column type="selection" width="35"> </el-table-column>
                  <el-table-column>
                    <template slot="header"><span class="store" @click="gotoStoreDetails(store.shop_id)">{{
                      store.shop_name }}</span></template>
                    <template slot-scope="scope">
                      <div class="product" @click="gotoDetails(scope.row.sku_id)">
                        <img class="pic" :src="scope.row.image" alt="" />
                        <div class="summary">
                          <span>{{ scope.row.goods_name }}</span>
                          <span class="type">{{ scope.row.attr_name }}</span>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="sku_shop_price" width="160">
                    <template slot-scope="scope">
                      <div v-if="
                        scope.row.is_valid === 1 &&
                        !(
                          targetAddress &&
                          !scope.row.market_area_name.includes(targetAddress)
                        )
                      ">
                        <div class="text-center price" v-if="scope.row.sku_shop_price != 0">
                          {{ "￥" + scope.row.sku_shop_price }} / {{ scope.row.unit_name }}
                        </div>
                        <div class="text-center price" v-else>电议</div>
                      </div>
                      <div class="text-center" v-if="scope.row.is_valid === 0">
                        失效
                      </div>
                      <div class="text-center" v-if="
                        targetAddress &&
                        !scope.row.market_area_name.includes(targetAddress)
                      ">
                        暂不支持配送至该区域
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column width="120">
                    <template slot-scope="scope" v-if="
                      scope.row.is_valid === 1 &&
                      !(
                        targetAddress &&
                        !scope.row.market_area_name.includes(targetAddress)
                      )
                    ">
                      <el-input-number style="width: 110px" size="mini" v-model="scope.row.number"
                        :min="scope.row.min_sale" :max="999999" :precision="3" @change="(currentValue, oldValue) =>
                          numberChange(currentValue, oldValue, scope.row)
                          "></el-input-number>
                    </template>
                  </el-table-column>
                  <el-table-column width="120">
                    <template slot="header">
                      <div></div>
                    </template>
                    <template slot-scope="scope" v-if="
                      scope.row.is_valid === 1 &&
                      !(
                        targetAddress &&
                        !scope.row.market_area_name.includes(targetAddress)
                      )
                    ">
                      <div class="price text-center" v-if="scope.row.number * scope.row.sku_shop_price === 0">
                        待定
                      </div>
                      <div class="price text-center" v-else>
                        ￥{{
                          (
                            scope.row.number *
                            scope.row.sku_shop_price *
                            1
                          ).toFixed(2)
                        }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column width="60">
                    <template slot-scope="scope">
                      <el-button type="text" style="color: #656565" @click="deletePro(scope.row.id)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <div v-else style="padding: 200px 0">
              <emptyData></emptyData>
            </div>
          </div>
        </div>
        <div class="bottom-btn-group">
          <div class="btn-container">
            <div class="left-btn">
              <el-checkbox v-model="allCheck" @change="checkedAll">全选</el-checkbox>
              <div class="btn-text" @click="deleteCheckedPro">删除选中商品</div>
              <el-popconfirm title="确定清理失效商品？" hide-icon confirm-button-text="确定" cancel-button-text="取消"
                popper-class="popper-delete-2" @confirm="clearInvalidPro">
                <div class="btn-text" slot="reference">清理失效商品</div>
              </el-popconfirm>
              <div class="btn-text" @click="exportCartorder">导出采购单</div>
            </div>
            <div class="right-btn">
              <div class="count">
                <span class="count-label">已选择</span>
                <span class="count-value">{{ checkedCount }}</span>
                <span class="count-label">件商品</span>
              </div>
              <div class="price">
                <span class="price-label">总价:</span>
                <span class="price-value">{{ totalPrice }}</span>
              </div>
              <div class="order-btn col-center row-center" @click="gotoSettlement">去下单</div>
            </div>
          </div>
          <div class="bottom row-center col-center">
            赣州市智能产业创新研究院
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import Api from "@/plugins/api";
// import NavSearch from '@/components/NavSearch.vue'
import emptyData from "@/components/emptyData";
import logoSrc from "@/assets/images/logo.png";
export default {
  middleware: "auth",
  name: "PurchaseOrder",
  layout: 'hall',
  components: {
    // NavSearch,
    emptyData,
  },
  data() {
    return {
      breadcrumb: [
        {
          name: '交易大厅',
          path: '/productList'
        },
        {
          name: '购物车'
        }
      ],
      logoSrc,
      cityOptions: [],
      targetAddress: "广东省",
      tableData: [],
      allCheck: false,
      checkedCount: 0,
      totalPrice: 0,
      checkedPro: [],
    };
  },
  computed: {
    ...mapState(["token"]),
  },
  mounted() {
    this.getGoodsCart();
    this.getCityRegion();
  },
  methods: {
    gotoDetails(id) {
      window.open(`/productDetails?id=${id}`);
    },
    gotoStoreDetails(id) {
      window.open(`/company?id=${id}`);
    },
    getCityRegion() {
      return this.$request
        .get(Api.getCity, { params: { level: 1 } })
        .then((res) => {
          if (res.code === 0) {
            this.cityOptions = res.data;
          }
        });
    },
    tableRowClassName({ row }) {
      if (
        row.is_valid === 0 ||
        (this.targetAddress &&
          !row.market_area_name.includes(this.targetAddress))
      ) {
        return "invalid-row";
      }
      return "";
    },
    rowCheckStyle({ row }) {
      const checkIdList = this.checkedPro.map((item) => item.id);
      if (checkIdList.includes(row.id)) {
        return {
          backgroundColor: "#fff9f0",
        };
      }
    },
    checkedAll(newVal) {
      const tables = this.$refs;
      for (const key in tables) {
        if (
          Object.hasOwnProperty.call(tables, key) &&
          key.includes("storeTable")
        ) {
          if (newVal) {
            const tableInstace = tables[key][0];
            tableInstace.clearSelection();
            tableInstace.toggleAllSelection();
          } else {
            const tableInstace = tables[key][0];
            tableInstace.clearSelection();
          }
        }
      }
    },
    // 获取采购单商品数量
    getGoodsCart() {
      this.$request.get(Api.getGoodsCart).then((res) => {
        if (res.code === 0) {
          this.tableData = res.data;
        }
      });
    },

    // 加减号
    async numberChange(currentValue, oldValue, row) {
      let res = "";



      res = await this.$request.post(Api.setNumber, {
        cart_id: row.id,
        number: currentValue,
      });
      if (res.code === 0) {
        this.$message.success(res.msg);
        this.getAllCheckedPro();
      } else {
        this.$message.error(res.msg);
        this.getGoodsCart();
      }
    },

    // 单个表格勾选
    checkTable(refName) {
      const tableInstace = this.$refs[refName][0];
      tableInstace.toggleAllSelection();
    },
    // 获取全部勾选商品
    getAllCheckedPro() {
      const tables = this.$refs;
      let checkedPro = [];
      const is_check_all = [];
      for (const key in tables) {
        if (
          Object.hasOwnProperty.call(tables, key) &&
          key.includes("storeTable")
        ) {
          const tableInstace = tables[key][0];
          checkedPro = checkedPro.concat(tableInstace.selection);
          is_check_all.push(
            tableInstace.selection.length === tableInstace.tableData.length
          );
        }
      }

      // 判断是否全选
      if (is_check_all.every((item) => item)) {
        this.allCheck = true;
      } else {
        this.allCheck = false;
      }

      // 计算选择数量
      this.checkedCount = checkedPro.length;

      // 计算总价
      let total = 0;
      checkedPro.forEach((sonItem) => {
        if (Number(sonItem.sku_shop_price) !== 0) {
          total += sonItem.number * sonItem.sku_shop_price;
        }
      });

      this.totalPrice = "¥" + total.toFixed(2);

      if (checkedPro.map((item) => Number(item.sku_shop_price)).includes(0)) {
        this.totalPrice = "待定";
      }
      this.checkedPro = checkedPro;

      return checkedPro;
    },
    // 删除单个商品
    deletePro(id) {
      this.$request.post(Api.deleteGoodsCart, { cart_id: id }).then((res) => {
        if (res.code === 0) {
          this.getGoodsCart();
        }
      });
    },
    // 删除选择的商品
    deleteCheckedPro() {
      const checkedPro = this.getAllCheckedPro();
      const ids = checkedPro.map((item) => item.id);
      this.$request.post(Api.deleteGoodsCart, { cart_id: ids }).then((res) => {
        if (res.code === 0) {
          this.getGoodsCart();
        }
      });
    },
    clearInvalidPro() {
      this.$request.post(Api.clearGoodsCartCount).then((res) => {
        if (res.code === 0) {
          this.getGoodsCart();
          this.$message.success("已清空失效商品");
        } else {
          this.$message.warning(res.msg);
        }
      });
    },
    exportCartorder() {
      const checkedPro = this.getAllCheckedPro();
      const ids = checkedPro.map((item) => item.id);
      if (checkedPro.length === 0) {
        return this.$message.warning("请选择需要导出的商品");
      }
      this.$request.post(Api.exportGoodsCart, { cart_id: ids }).then((res) => {
        if (res.code === 0) {
          const link = document.createElement("a");
          link.style.display = "none";
          link.href = res.data + `&token=${this.token}`;
          link.target = "tempiframe";
          link.setAttribute("download", "采购单.xls");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      });
    },
    gotoSettlement() {
      const checkedPro = this.getAllCheckedPro();
      const sku_id = checkedPro.map((item) => item.sku_id * 1);
      const number = {};
      checkedPro.forEach((pro) => {
        number[pro.sku_id] = pro.number;
      });
      if (checkedPro.length === 0) {
        return this.$message.warning("请选择商品");
      }
      if (checkedPro.some((item) => item.is_valid === 0)) {
        return this.$message.warning("不能下单失效商品");
      }
      this.$router.push({
        path: "/purchaseorder/settlement",
        query: {
          type: 1, // 购物车下单
          sku_id,
          number: JSON.stringify(number),
        },
      });
    },
  },
};
</script>
<style lang="less" scoped>
.price {

  font-weight: 500;
  font-size: 16px;
  color: #FF2618;
  line-height: 19px;

}

.view {
  background-color: #fff;
  padding: 20px;
  box-sizing: border-box;
}

.wrap {
  .content {
    padding-bottom: 100px;
  }
}

.send-to {
  margin-bottom: 30px;
  font-size: 14px;
  color: #0A1833;
  line-height: 22px;

  h3 {
    font-weight: bold;
    font-size: 18px;
    color: #0A1833;
    line-height: 21px;

  }

}

.table-header {
  line-height: 42px;
  background: #fff;
  padding-bottom: 100px;

  .header {
    background-color: #fff;

    .header-wrapper {
      height: 42px;
      width: 1184px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
    }

    .header-col-name {
      padding: 0 10px;
      box-sizing: border-box;
      font-size: 12px;
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      font-weight: 400;
      color: #656565;
    }
  }

  .table-container {
    width: 1184px;
    margin: 0 auto;

    .store {

      font-weight: bold;
      font-size: 14px;
      color: #0A1833;
      line-height: 21px;


      &:hover {
        color: #2263e8;
      }
    }

    .product {
      display: flex;
      align-items: center;
      cursor: pointer;

      .pic {
        width: 64px;
        height: 64px;
        margin: 12px;
      }

      .summary {
        width: 600px;
        height: 88px;
        line-height: 19px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        font-size: 12px;
        font-family: Microsoft YaHei, Microsoft YaHei-Regular;
        font-weight: 400;
        text-align: left;
        color: #353535;

        .type {
          color: #959595;
        }
      }
    }
  }

  td {
    height: 88px;
    padding: 0;
    border: 1px solid #2263e8;
    line-height: 1;
  }

  .center {
    text-align: center;
  }

  .w-60 {
    width: 60px;
  }

  .w-120 {
    width: 120px;
  }

  .w-flex {
    flex: 1;
  }
}

.bottom-btn-group {
  .bottom {
padding: 9px 0;
font-size: 12px;
color: #8993A5;

  }
  position: fixed;
  left: 0;
  bottom: 0;
  width: 1920px;
  background: #ffffff;
  box-shadow: 0px -8px 16px 0px rgba(23, 36, 63, 0.08);
  z-index: 999;

  .btn-container {
    width: 1184px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 25px 0;

    .left-btn {
      display: flex;
      align-items: center;

      ::v-deep(.el-checkbox) {
        margin-bottom: 0;
      }

      .btn-text {

        margin: 0 10px;
        cursor: pointer;
        display: inline-block;

        display: flex;
        align-items: center;
        justify-content: center;
        width: 104px;
        height: 37px;
        border-radius: 6px 6px 6px 6px;
        border: 1px solid #B6BCC7;

        box-sizing: border-box;

        font-size: 14px;
        color: #43546F;


        &:hover {
          color: #2263e8;
        }
      }
    }

    .right-btn {
      display: flex;
      align-items: center;

      .price {
        margin: 0 20px;
      }

      .count-label,
      .price-label {
        font-size: 12px;
        font-family: Microsoft YaHei, Microsoft YaHei-Regular;
        font-weight: 400;
        color: #656565;
      }

      .count-value {
        font-size: 16px;
        font-weight: 700;
        color: #2263e8;
      }

      .price-value {
        font-size: 16px;
        font-weight: 700;
        color: #e84b01;
      }

      .order-btn {
        width: 100px;
        height: 36px;
        background: #257FF8;
        border-radius: 4px 4px 4px 4px;
        font-size: 16px;
        color: #FFFFFF;

        cursor: pointer;
      }
    }
  }
}

:deep(.el-checkbox__label) {
  font-size: 12px;
  font-family: Microsoft YaHei, Microsoft YaHei-Regular;
  font-weight: 400;
  color: #656565;
}

:deep(.el-table-column--selection .cell) {
  padding: 0 10px;
}

:deep(.is-leaf.el-table__cell) {
  background: rgba(137, 147, 165, 0.06);
}

:deep(.el-table .el-table__cell) {
  padding: 0;
}
</style>
