<!-- 我发布的供应信息  -->
<template>
  <div class="myDemand-page">
    <div class="title">我报价的需求信息</div>
    <div class="search-form">
      <el-form ref="searchForm" :model="searchForm" class="search-form-inline">
        <el-form-item label prop="order_sn">
          <el-input v-model="searchForm.order_sn" placeholder="单号"></el-input>
        </el-form-item>
        <el-form-item label prop="cat3_id">
          <el-select
            v-model="searchForm.cat3_id"
            size="mini"
            filterable
            allow-create
            default-first-option
            placeholder="请选择分类"
          >
            <el-option
              v-for="item in categoryOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="报价时间" class="time">
          <el-date-picker
            style="width:260px"
            value-format="yyyy-MM-dd"
            v-model="searchForm.create_time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>

          <!-- <el-col :span="11">
            <el-date-picker
              v-model="searchForm.create_time_start"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              style="width: 100%"
            ></el-date-picker>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-date-picker
              v-model="searchForm.create_time_stop"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              style="width: 100%"
            ></el-date-picker>
          </el-col>-->
        </el-form-item>
        <el-form-item label prop="status">
          <el-select v-model="searchForm.status" clearable placeholder="请选择">
            <el-option label="未选中" value="1"></el-option>
            <el-option label="已选中" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="text" @click="getTableData">搜索</el-button>
          <el-button type="text" @click="reset('searchForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table
        :data="tableData"
        tooltip-effect="dark"
        stripe
        header-row-class-name="table-header-style"
      >
        <el-table-column prop="req_order_sn" label="单号" align="center"></el-table-column>

        <el-table-column label="创建时间" align="center">
          <template
            slot-scope="{ row }"
          >{{ $moment(row.req_create_time * 1000).format("yyyy-MM-DD HH:mm:ss") }}</template>
        </el-table-column>
        <el-table-column prop="take_confirm_time" label="截止日期" align="center">
          <template
            slot-scope="{ row }"
          >{{ $moment(row.req_deadline * 1000).format("yyyy-MM-DD HH:mm:ss") }}</template>
        </el-table-column>
        <el-table-column prop="money" label="报价金额" align="center" width="100">
          <template slot-scope="{ row }">
            <span>{{ formatPrice(row.money) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="报价时间" align="center" width="100">
          <template
            slot-scope="{ row }"
          >{{ $moment(row.create_time * 1000).format("yyyy-MM-DD HH:mm:ss") }}</template>
        </el-table-column>
        <el-table-column prop="price_status_name" label="状态" align="center" width="100">
          <template slot-scope="{ row }">
                      <el-tag :type="row.price_status_name === '报价结束'
                        ? 'info'
                        : row.price_status_name === '已下单' ||
                          row.price_status_name === '已选中'
                          ? 'success'
                          : 'warning'
                        ">
                        {{ row.price_status_name }}
                      </el-tag>
                    </template>
        </el-table-column>
        <el-table-column prop="release_time" label="操作" align="center" width="180">
          <template slot-scope="{row}">
            <el-button type="text" size="mini" @click="navDetail(row.supply_order_id)">查看报价</el-button>
            <el-button
              type="text"
              size="mini"
              v-if="row.rel_order_id"
              @click="navOrder(row.rel_order_id)"
            >查看订单</el-button>
          </template>
        </el-table-column>
      </el-table>
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
  </div>
</template>
<script>
/* eslint-disable */
import utils from "@/utils";
import Api from "../../plugins/api";

export default {
  layout: "personalCenter",
  middleware: "auth",
  name: "myQuote",
  data() {
    return {
      categoryOptions: [],
      searchForm: {
        type: "1",
        information_type: 1,
        order_sn: "",
        cat3_id: "",
        status: "",
        create_time: [],
        create_time_start: "",
        create_time_stop: "",
        page: 1,
        limit: 10,
      },
      tableData: [],
      total: 0,
      page: 1,
    };
  },

  mounted() {
    this.getCategoryOptions();
    this.getTableData();
  },
  methods: {
    navOrder(id) {
      this.$router.push("/personalCenter/buyerList?order_id=" + id);
    },
    navDetail(id) {
      this.$router.push("/supplyDemand/details?id=" + id);
    },
    // 获取分类下拉选
    getCategoryOptions() {
      // 获取物资分类下拉选
      this.$request.get(Api.getGoodsLevel3CategoryList).then((res) => {
        if (res.code === 0) {
          this.categoryOptions = res.data.map((item) => {
            return {
              id: item.cate_id,
              name: item.cate_name,
            };
          });
        }
      });
    },
    formatPrice(price) {
      return Number(utils.performOperation("divide", price, 100)).toFixed(2);
    },
    reset(formName) {
      this.$refs[formName].resetFields();
      this.searchForm.create_time_start = "";
      this.searchForm.create_time_stop = "";
      this.searchForm.create_time = [];
      this.searchForm.page = 1;
      this.searchForm.pagesize = 10;
      this.getTableData();
    },
    getTableData() {
      let params = {
        ...this.searchForm,
      };
      if (params.create_time && params.create_time.length > 0) {
        params.create_time_start = params.create_time[0];
        params.create_time_stop = params.create_time[1];
      }
      delete params.create_time;
      this.$request.get(Api.getMyPrices, { params }).then((res) => {
        this.total = res.data.count;
        this.tableData = res.data.data;
      });
    },
    handleCurrentChange(val) {
      this.searchForm.page = val;
      this.getTableData();
    },
  },
};
</script>
<style lang="less" scoped>
.myDemand-page {
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
    margin-bottom: 20px;
    .search-form-inline {
      display: flex;

      :deep(.el-form-item) {
        margin: 0 5px;
        width: 120px;

        &.time {
          width: 350px;
          display: flex;
          .el-input__icon,
          .el-range__icon,
          .el-range-separator,
          .el-range__close-icon {
            display: flex;
            align-items: center;
          }
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
    margin: 20px 0;
    .btn {
      width: 100px;
      height: 36px;
      background: linear-gradient(90deg, #257ff8 0%, #0361e9 100%);
      border-radius: 4px 4px 4px 4px;
      font-weight: 500;
      font-size: 16px;
      color: #ffffff;
      line-height: 19px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
  }

  :deep(.table-header-style) {
    th {
      text-align: center;
      background: rgba(137, 147, 165, 0.06);
      font-weight: 400;
      font-size: 14px;
      color: #43546f;
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
</style>
