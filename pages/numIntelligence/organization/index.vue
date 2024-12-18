<template>
  <div class="numIntelligence-bg">
    <div class="classify">
      <div
        :class="index == activeTab ? 'active' : ''"
        class="classify-item"
        v-for="(item, index) in tabList"
        :key="index"
        @click="bindTab(item.url)"
      >
        {{ item.label }}
      </div>
    </div>

    <!-- <div class="table-content">
      <div class="table-left"> -->
    <div class="classify-ul">
      <div class="right-border"></div>
      <div
        class="classify-list"
        v-for="(item, index) in industryList"
        :key="index"
        @click="bindChangeList(item.id)"
      >
        <div class="text text-cut">{{ item.name }}</div>
        <div class="shadow text-cut">{{ item.name }}</div>
      </div>
      <!-- </div>
      </div> -->
    </div>
    <div class="table-content">
      <div class="table-right">
        <div class="screen-dialog">
          <el-table
            :data="tableData"
            style="width: 100%"
            :header-cell-style="{
              background: 'rgba(44,166,255,0.1);',
              'text-align': 'center',
            }"
            :cell-style="{ 'text-align': 'center' }"
            class="scroll"
          >
            <el-table-column
              prop="title"
              label="名称"
              width="460px"
              :show-overflow-tooltip="true"
            />
            <el-table-column prop="second_cate_name" label="级别" />
            <el-table-column prop="scope" label="操作">
              <template #default="scope">
                <div class="pre" @click="gotoDetails(scope.row.id)">查看</div>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            style="text-align: right; margin: 20px 0"
            small
            layout=" prev, pager, next, jumper"
            :total="total"
            :page-size="pageSize"
            :pager-count="5"
            :current-page="page"
            @current-change="handleCurrentChange"
            background
          >
          </el-pagination>
        </div>
      </div>
      <div class="table-right">
        <div class="screen-dialog">
          <el-table
            :data="tableData2"
            style="width: 100%"
            :header-cell-style="{
              background: 'rgba(44,166,255,0.1);',
              'text-align': 'center',
            }"
            :cell-style="{ 'text-align': 'center' }"
          >
            <el-table-column prop="title" label="名称" />
            <el-table-column prop="second_cate_name" label="省份"> </el-table-column>
          </el-table>
          <!-- <el-pagination  style="text-align: right; margin: 20px 0" small layout=" prev, pager, next, jumper"
                :total="total2" :page-size="pageSize" :pager-count="5" :current-page="page"
                @current-change="handleCurrentChange">
            </el-pagination> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Api from "@/plugins/api";
import { mapState } from "vuex";
export default {
  layout: "intelligence",

  data() {
    return {
      tabList: [
        { label: "规模实力", value: 0, url: "/scaleStrength" },
        { label: "技术创新", value: 1, url: "/technology" },
        { label: "发展生态", value: 2, url: "/developEcology" },
        { label: "产业协作", value: 3, url: "/collaborate" },
        { label: "组织保障", value: 4, url: "/organization" },
      ],
      leftList: [],
      activeTab: 4,
      tableData: [],
      tableData2: [],
      total2: 0,
      total: 0,
      industryList: [],
      page: 1,
      pageSize: 10,
      typeId: 1,
    };
  },
  computed: {
    ...mapState(["numTab"]),
  },
  watch: {
    numTab: {
      handler(newValue, oldValue) {
        if (newValue.id) {
          this.getIndustryPage(newValue);
          this.typeId = newValue.id;
        }

        // this.getList();
      },
      immediate: true,
      deep: true,
    },
  },

  mounted() {
    this.getList();
  },
  methods: {
    bindTab(url) {
      this.$router.push("/numIntelligence" + url);
    },
    bindChangeList(id) {
      this.getIndustryPage(id);
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getIndustryPage();
    },
    getList() {
      this.industryList = [];
      this.$request
        .get(Api.industryList, {
          params: {},
        })
        .then((res) => {
          if (res.code == 0) {
            res.data.forEach((element) => {
              if (element.name != "集群标准") {
                this.industryList.push(element);
              }
            });
            this.getIndustryPage(this.industryList[0].id);
            this.getTableList(this.industryList[1].id);
          }
        });
    },
    getIndustryPage(id) {
      this.$request
        .get(Api.industryPage, {
          params: {
            industry_id: this.typeId,
            first_cate_id: 3,
            page: this.page,
            pageSize: this.pageSize,
          },
        })
        .then((res) => {
          this.tableData = res.data.data;
          this.total = res.data.total;
        });
    },
    getTableList(id) {
      this.$request
        .get(Api.industryPage, {
          params: {
            industry_id: this.typeId,
            first_cate_id: 6,
            page: 1,
            pageSize: 10,
          },
        })
        .then((res) => {
          this.tableData2 = res.data.data;
          this.total2 = res.data.total;
        });
    },
    gotoDetails(id) {
      this.$request
        .get(Api.industryGetails, {
          params: { id: id },
        })
        .then((res) => {
          window.open(res.data.file_url2, "_blank");
        });
    },
  },
};
</script>

<style lang="less" scoped>
.numIntelligence-bg {
  width: 100vw;
  height: calc(100vh - 5.725rem);
  background: #030913;
}
.classify {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 0 1.25rem;
  margin: 0 auto;
  cursor: pointer;
  .classify-item {
    width: 8.5625rem;
    line-height: 2.8125rem;
    text-align: center;
    color: #c3d3e2;
    font-size: 1.25rem;
    background: linear-gradient(
      90deg,
      rgba(0, 25, 52, 0) 0%,
      #001934 50%,
      rgba(0, 25, 52, 0) 100%
    );
    margin-right: 1rem;
  }
  .classify-item.active {
    background: #030913 url("../../../assets/images/numIntelligence/tab3.png")
      no-repeat 0 0;
    background-size: 100% 100%;
  }
}
.classify-ul {
  position: relative;
  width: 99%;
  display: flex;
  // .right-border {
  //   position: absolute;
  //   right: -0.8125rem;
  //   top: 0;
  //   width: 0px;
  //   height: 55.8125rem;
  //   border-radius: 0px 0px 0px 0px;
  //   border: 1px solid;
  //   border-image: linear-gradient(
  //       180deg,
  //       rgba(93, 149, 201, 0),
  //       rgba(93, 149, 201, 1),
  //       rgba(93, 149, 201, 0)
  //     )
  //     1 1;
  // }
  .classify-list {
    flex: 1;
    height: 3.125rem;
    background: url("../../../assets/images/numIntelligence/bottom.png")
      no-repeat 0 0;
    background-size: 100% 100%;
    margin-bottom: 1.5rem;
    position: relative;
    cursor: pointer;
  }
  .text {
    width: 100%;
    line-height: 3.125rem;
    letter-spacing: 0.2rem;
    font-size: 1.625rem;
    text-align: center;
    font-weight: bold;
    background-image: linear-gradient(
      to top,
      #e4f2ff 0%,
      #2daeef 62%,
      #e4f2ff 100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
  }
  .shadow {
    width: 100%;
    line-height: 3.125rem;
    color: #2daeef;
    letter-spacing: 0.2rem;
    text-align: center;
    font-size: 1.625rem;
    font-weight: bold;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 0;
    text-shadow: 5px 0px 10px #17498b;
  }
}

.table-content {
  width: 99%;
  height: 55.8125rem;
  margin: 0 auto;
  background: url("../../../assets/images/numIntelligence/bg.png") no-repeat 0 0;
  background-size: 100% 100%;
  padding: 0.625rem;
  box-sizing: border-box;
  display: flex;
  .table-left {
    flex: 1;
    padding: 0 0.8125rem;
    flex-shrink: 0;
  }

  .table-right {
    flex: 1;
    padding-left: 0.8125rem;
    box-sizing: border-box;
  }
}

.text-cut {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.screen-dialog {
  width: 100%;
}
.pre {
  cursor: pointer;
  color: rgba(37, 127, 248, 1);
  text-decoration: underline;
}
</style>
<style>
.screen-dialog .el-table {
  background: rgba(6, 18, 36, 0.2);
  --el-table-border-color: rgba(6, 18, 36, 0.2);
}
.screen-dialog .el-table .el-table__row {
  background: rgba(6, 18, 36, 0.2);
}

.screen-dialog .el-table .el-table__header th {
  background: #0a1f35 !important;
  color: #fff;
  border: 1px solid rgba(6, 18, 36, 0.5);
}

.screen-dialog .el-table__body {
  color: #fff !important;
}
.screen-dialog .el-table__body-wrapper tr:hover > td {
  background-color: rgba(250, 248, 248, 0.226) !important;
}
.screen-dialog .el-table.el-table--fit::before {
  background: rgba(6, 18, 36, 0.5);
}
.screen-dialog .el-table td.el-table__cell {
  border-bottom: 1px solid rgba(30, 134, 255, 0.1);
}

.el-pagination.is-background .el-pager li:not(.disabled) {
  background-color: #040a14;
  border: 1px solid #758eb4;
}
.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #1e86ff;
  color: #fff;
  border-color: #1e86ff;
}

.el-pagination .el-input__inner {
  border-color: #758eb4;
  background-color: #040a14;
}
.el-pagination .btn-next {
  border-color: #1e86ff!important;
  background-color: #1e86ff!important;
}
.el-pagination .btn-prev {
  border-color: #162940!important;
  background-color: #162940!important;
}
</style>
