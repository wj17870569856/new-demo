<template>
  <div class="detail">
    <el-form label-width="110px" inline>
      <el-form-item label="需求单号："> {{ info.order_sn }} </el-form-item>
      <el-form-item label="发布时间：">{{ info.create_time }} </el-form-item>
      <el-form-item label="截止时间：">{{ info.deadline_text }}</el-form-item>

      <el-form-item label="联系人：">{{ info.company_name }}</el-form-item>
      <el-form-item label="联系电话："> {{ info.deadline }}</el-form-item>
      <el-form-item label="地址：">{{ info.region }}</el-form-item>
    </el-form>

    <el-table
      :data="tableData"
      header-row-class-name="table-header-style"
      border
      default-expand-all
      ref="table"
      row-class-name="tableRowStyle"
      @row-click="rowClick"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table
            class="table"
            style="width: 98%; margin-left: 1%; border: none !important"
            size="mini"
            ref="tableExpand"
            :data="props.row.price_details"
          >
            <el-table-column
              label="分类"
              prop="goods_name"
              align="center"
              width="180"
            >
            </el-table-column>
            <el-table-column label="要求" prop="content" align="center">
            </el-table-column>
            <el-table-column label="数量" prop="num" align="center" width="100">
            </el-table-column>
            <el-table-column
              label="单价"
              prop="unit_price"
              align="center"
              width="100"
            >
              <template slot-scope="scope">
                <span>{{ formatPrice(scope.row.unit_price) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="小计" align="center" width="100">
              <template slot-scope="{ row }">
                <span>{{ getTotalAmount(row) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>

      <el-table-column
        prop="company_name"
        label="公司名"
        align="center"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="money"
        label="总金额"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ formatPrice(scope.row.money) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="报价时间"
        align="center"
        width="160"
      >
        <template slot-scope="{ row }">
          {{ $moment(row.create_time * 1000).format("yyyy-MM-DD HH:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column
        prop="take_confirm_time"
        label="交货时间"
        align="center"
        width="160"
      >
        <template slot-scope="{ row }">
          {{
            $moment(row.take_confirm_time * 1000).format("yyyy-MM-DD HH:mm:ss")
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        show-overflow-tooltip
        align="center"
      >
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center" width="100">
        <template slot-scope="{ row }">
          <el-tag type="success" v-if="row.status == '2'">已选中</el-tag>
          <el-tag type="success" v-else-if="row.status == '3'">已下单</el-tag>
          <el-tag type="info" v-else>未选中</el-tag>

        </template>
      </el-table-column>
      <el-table-column width="140" label="操作" align="center">
        <template slot-scope="{ row }">
          <el-button
            size="mini"
            type="text"
            @click.stop="setWinPrice(row)"
            v-if="row.status == '1'"
            >选中报价</el-button
          >
          <el-button
            size="mini"
            type="text"
            @click.stop="placeOrder(row)"
            v-if="row.status == '2' && !row.rel_order_id"
            >立即下单</el-button
          >


          <el-button
            size="mini"
            type="text"
            @click.stop="navOrder(row.rel_order_id)"
            v-if="row.rel_order_id"
            >查看订单</el-button
          >

          <el-button
            size="mini"
            type="text"
            @click.stop="unselectPrice(row)"
            v-if="row.status == '2'"
            >取消选中</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-row style="text-align: right; margin-top: 22px">
      <el-button @click="navBack">返回</el-button>
    </el-row>
  </div>
</template>

<script>
import utils from "@/utils";
import Api from "@/plugins/api";
export default {
  props: {
    orderId: {
      type: [Number, String],
      default: "",
    },
  },
  mounted() {
    this.getOrderInfo();
    this.getDetails();
  },
  methods: {
    rowClick (row) {
      this.$refs['table']&&this.$refs['table'].toggleRowExpansion(row)
    },
    getTotalAmount(row) {
      return Number(
        utils.performOperation(
          "divide",
          utils.performOperation("multiply", row.num, row.unit_price),
          100
        )
      ).toFixed(2);
    },
    formatPrice(price) {
      return Number(utils.performOperation("divide", price, 100)).toFixed(2);
    },
    navOrder (id) {
      
      
      this.$router.push('/personalCenter/buyerList?order_id='+id)
    },
    getDetails() {
      this.$request
        .get(Api.getSupplyOrderInfo, { params: { id: this.orderId } })
        .then((res) => {
          if (res.code === 0) {
            this.info = res.data || {};
          }
        });
    },
    placeOrder(row) {
      this.$router.push({
        path: "/purchaseorder/settlement2",
        query: {
          price_id: row.id,
        },
      });
    },
    unselectPrice(row) {
      this.$request
        .get(Api.unselectprice, {
          params: {
            price_id: row.id,
          },
        })
        .then((res) => {
          this.getOrderInfo();
        });
    },
    setWinPrice(row) {
      this.$request
        .get(Api.setWinPrice, {
          params: {
            price_id: row.id,
          },
        })
        .then((res) => {
          this.getOrderInfo();
        });
    },
    navBack() {
      this.$emit("back");
    },
    getOrderInfo() {
      this.$request
        .get(Api.getUserQuoteList, {
          params: {
            supply_order_id: this.orderId,
          },
        })
        .then((res) => {
          console.log("====================================");
          console.log(res, "resss");
          console.log("====================================");
          this.tableData = res.data.data || [];
        });
    },
  },
  data() {
    return {
      utils,
      info: {},
      tableData: [],
    };
  },
};
</script>

<style lang="less" scoped>
:deep(.table-header-style) {
  background: rgba(137,147,165,0.06);

  th {
    background: transparent;
  }
}
:deep(.el-table .tableRowStyle) {
  background-color: rgba(137, 147, 165, 0.06) !important;
}
:deep(.el-table--mini .el-table__cell),
:deep(.el-table--mini) {
  border: none;
}
</style>
