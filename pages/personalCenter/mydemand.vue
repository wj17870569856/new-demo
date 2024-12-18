<!-- 我发布的需求信息  -->
<template>
  <div class="myDemand-page">
    <div class="title">{{ showQuoteList ? '查看需求报价列表' : publish ? '发布需求信息' : '我发布的需求信息' }}</div>
    <div v-show="!publish && !showQuoteList" class="search-form">
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
        <el-form-item label="发布时间" class="time" label-width="190px">
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
            <el-option label="待审核" value="1"></el-option>
            <el-option label="审核通过" value="2"></el-option>
            <el-option label="审核不通过" value="3"></el-option>
            <el-option label="已关闭" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="text" @click="onSubmit">搜索</el-button>
          <el-button type="text" @click="reset('searchForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-show="!publish && !showQuoteList">
      <div class="btn-group">
        <div class="btn pub-btn" @click="publishBtn">发布需求</div>
      </div>
      <el-table
        :data="firsttable"
        tooltip-effect="dark"
        style="width: 100%"
        stripe
        header-row-class-name="table-header-style"
        @selection-change="selecChangeFirsttable"
      >
        <el-table-column prop="order_sn" label="单号" align="center" width="100"></el-table-column>
        <el-table-column prop="category_name" label="分类" align="center"></el-table-column>
        <el-table-column prop="number" label="采购数量" align="center" width="90"></el-table-column>
        <el-table-column prop="deadline" label="信息有效期" width="100" align="center">
          <template slot-scope="scope">
            {{
            scope.row.deadline_long === 1
            ? "长期有效"
            : dateFormatter(scope.row.deadline, "yyyy-MM-DD")
            }}
          </template>
        </el-table-column>
        <!-- 1-待审核,2-审核通过,3-审核不通过,4-已关闭 -->
        <el-table-column prop="status_text" label="审核状态" align="center" width="100">
          <template slot-scope="scope">
            <div>{{ scope.row.status == '1'?'待审核': scope.row.status == '2'?'审核通过':scope.row.status == '3'?'审核不通过':'已关闭' }}</div>
            <div v-if="scope.row.status === 3" class="reason-text">{{ scope.row.reason }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" align="center" width="100">
          <template slot-scope="scope">
            <div>{{ dateFormatter(scope.row.create_time, "yyyy-MM-DD") }}</div>
            <div>{{ dateFormatter(scope.row.create_time, "HH:mm:ss") }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="release_time" label="操作" align="center" width="140">
          <template slot-scope="scope">
            <el-popconfirm
              :title="`确定删除？`"
              hide-icon
              confirm-button-text="取消"
              cancel-button-text="删除"
              popper-class="popper-delete"
              @cancel="deleteDemand(scope.row.id)"
            >
              <el-button
                v-if="scope.row.status == 1 || scope.row.status == 3"
                slot="reference"
                size="mini"
                type="text"
                icon="el-icon-delete"
              >删除</el-button>
            </el-popconfirm>
            <el-button
              v-if="scope.row.status == 2"
              size="mini"
              type="text"
              icon="el-icon-circle-close"
              @click="closeDemand(scope.row.id)"
            >关闭</el-button>
            <el-button
              v-if="scope.row.status == 4"
              size="mini"
              type="text"
              @click="reUse(scope.row.id)"
            >重新激活</el-button>
            <el-button
              slot="reference"
              size="mini"
              type="text"
              icon="el-icon-view"
              @click="editDemand(scope.row.id)"
            >查看</el-button>
            <el-button
              slot="reference"
              size="mini"
              type="text"
              icon="el-icon-view"
              @click="showDetailByQuote(scope.row.id)"
            >
              查看报价({{ scope.row.price_order_num
              }})
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="text-align: right; margin: 20px 0"
        small
        layout="prev, pager, next, jumper"
        :total="total1"
        :page-count="10"
        :pager-count="5"
        :current-page="page1"
        @current-change="handleCurrentChange1"
      ></el-pagination>
    </div>

    <div v-if="publish">
      <publishComponent
        v-if="searchForm.type != 3"
        :id="orderId"
        :type="searchForm.type"
        :information_type="searchForm.information_type"
        @publishSuccess="publishSuccess"
        @publishDelete="publishDelete"
        @publishBack="publishBack"
        @publishClose="publishClose"
      ></publishComponent>
      <publishCarComponent
        v-else
        :id="orderId"
        :is-supply="searchForm.information_type"
        :type="searchForm.type"
        :information_type="searchForm.information_type"
        @publishSuccess="publishSuccess"
        @publishDelete="publishDelete"
        @publishBack="publishBack"
        @publishClose="publishClose"
      ></publishCarComponent>
    </div>

    <QuoteList :orderId="orderId" @back="showQuoteList = false" v-if="showQuoteList" />
  </div>
</template>
<script>
/* eslint-disable */
import QuoteList from "./quoteList.vue";
import { mapState } from "vuex";
import Api from "../../plugins/api";
import publishComponent from "../supplyDemand/publishComponent.vue";
import publishCarComponent from "../supplyDemand/publishCarComponent.vue";
import defaultImg from "@/assets/images/default-img.png";

export default {
  layout: "personalCenter",
  name: "myDemand",
  middleware: "auth",
  components: {
    publishComponent,
    publishCarComponent,
    QuoteList,
  },
  data() {
    return {
      categoryOptions: [], // 分类下拉选
      defaultImg,
      publish: false,
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

      firsttable: [],
      page1: 1,
      total1: 0,
      secondtable: [],
      page2: 1,
      total2: 0,
      thirdtable: [],
      page3: 1,
      total3: 0,
      showQuoteList: false,

      firstTableChecked: [],
      sceondTableChecked: [],
      thirdTableChecked: [],
      orderId: "",
    };
  },
  directives: {
    splitTime(el, binding) {
      if (binding && binding.value) {
        let str = "";
        const arr = binding.value.split(" ");
        str = `<p>${arr[0]}</p><p>${arr[1]}</p>`;
        el.innerHTML = str;
      }
    },
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  mounted() {
    if (this.$route.query.id) {
      this.showDetailByQuote(this.$route.query.id);
    } else if (this.$route.query.type === "add") {
      this.publishBtn();
      this.$nextTick(() => {
        this.$router.replace({ query: {} });
      });
    }
    this.getCategoryOptions();
    this.getsupplyOrderList();
  },
  methods: {
    showDetailByQuote(id) {
      this.showQuoteList = false;
      this.orderId = id;
      this.$nextTick(() => {
        this.showQuoteList = true;
        this.$router.replace({ query: {} });
      });
    },
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
    dateFormatter(t, formatter = "yyyy-MM-DD HH:mm:ss") {
      t = t * 1000;
      return this.$moment(t).format(formatter);
    },
    getsupplyOrderList() {
      let params = {
        ...this.searchForm,
      };
      if (params.create_time && params.create_time.length > 0) {
        params.create_time_start = params.create_time[0];
        params.create_time_stop = params.create_time[1];
      }
      delete params.create_time;
      this.$request.get(Api.getUserSupplyOrderList, { params }).then((res) => {
        if (this.searchForm.type == 1) {
          this.firsttable = res.data;
          this.total1 = res.count;
        }
        if (this.searchForm.type == 2) {
          this.secondtable = res.data;
          this.total2 = res.count;
        }
        if (this.searchForm.type == 3) {
          this.thirdtable = res.data;
          this.total3 = res.count;
        }
      });
    },
    selecChangeFirsttable(val) {
      this.firstTableChecked = val;
    },
    selecChangeSecondtable(val) {
      this.secondTableChecked = val;
    },
    selecChangeThirdtable(val) {
      this.thirdTableChecked = val;
    },
    handleCurrentChange1(val) {
      this.searchForm.page = val;
      this.getsupplyOrderList();
    },
    handleCurrentChange2(val) {
      this.searchForm.page = val;
      this.getsupplyOrderList();
    },
    handleCurrentChange3(val) {
      this.searchForm.page = val;
      this.getsupplyOrderList();
    },
    // 删除需求
    deleteDemand(id) {
      this.$request
        .get(Api.deleteSupplyOrder, { params: { id } })
        .then((res) => {
          if (res.code === 0) {
            this.$message.success("删除成功");
            this.getsupplyOrderList();
          }
        });
    },
    editDemand(id) {
      this.orderId = id;
      this.publish = true;
    },

    // 关闭需求
    closeDemand(id) {
      this.$request.get(Api.closeOrder, { params: { id } }).then((res) => {
        if (res.code === 0) {
          this.$message.success("关闭成功");
          this.getsupplyOrderList();
        }
      });
    },
    // 重新激活
    reUse(id) {
      this.$request
        .get(Api.reloadSupplyOrder, { params: { id } })
        .then((res) => {
          if (res.code === 0) {
            this.$message.success("激活成功");
            this.getsupplyOrderList();
          }
        });
    },
    // 进入到发布表单
    publishBtn() {
      this.publish = true;
    },
    // 发布成功后查询
    publishSuccess(data) {
      this.publish = false;
      this.searchForm.page = 1;
      this.searchForm.type = data.type + "";
      this.getsupplyOrderList();
    },
    publishDelete(data) {
      this.publish = false;
      this.searchForm.page = 1;
      this.searchForm.type = data.type + "";
      this.getsupplyOrderList();
    },
    publishClose(data) {
      this.publish = false;
      this.searchForm.page = 1;
      this.searchForm.type = data.type + "";
      this.getsupplyOrderList();
    },
    publishBack() {
      this.orderId = "";
      this.publish = false;
    },
    onSubmit() {
      this.getsupplyOrderList();
    },
    reset(formName) {
      this.$refs[formName].resetFields();
      this.searchForm.create_time = [];
      this.searchForm.create_time_start = "";
      this.searchForm.create_time_stop = "";
      this.searchForm.page = 1;
      this.searchForm.pagesize = 10;
      this.getsupplyOrderList();
    },
    handleClick(tab) {
      if (tab.name === "1") {
        // 已上架
        this.searchForm.page = this.page1;
      }
      if (tab.name === "2") {
        // 已未架
        this.searchForm.page = this.page2;
      }
      if (tab.name === "3") {
        // 审核不通过
        this.searchForm.page = this.page3;
      }
      this.getsupplyOrderList();
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