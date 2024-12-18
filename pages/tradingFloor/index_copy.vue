<template>
  <div class="page">
    <div class="header">
      <el-image
        style="cursor: pointer;"
        @click.native="$router.back()"
        :src="require('../../assets/imgs/back.png')"
      ></el-image>
      <div>{{ pageData&&pageData.name }}</div>
    </div>
    <div class="content">
      <div class="left">
        <div class="cate_name">
          <div class="tab active">
            <span>企业级模型</span>
            <i class="el-icon-caret-bottom icon"></i>
          </div>
          <div class="list">
            <div
              @click="active = item.id"
              class="column"
              :class="item.id === active?'active':''"
              v-for="item in model_types"
              :key="item.id"
            >{{ item.name }}</div>
          </div>
        </div>
        <div class="cate_name">
          <div class="tab">
            <span>产业级模型</span>
          </div>
          <div class="list">
            <div
              class="column active"
              @click="nav('http://lxb2.web.shuzhiren.com/#/home')"
              v-if="type_id == '0'"
            >鲁小班</div>
            <div
              class="column active"
              @click="nav('https://gpt-all.web.guanyingis.com/#/home?type=villiaumite')"
              v-if="type_id == '2'"
            >盐小氟</div>
            <div
              v-if="type_id == '5'"
              class="column active"
              @click="nav('https://gpt-all.web.guanyingis.com/#/home?type=copper')"
            >铜小铝</div>
            <div
              v-if="type_id == '6'"
              class="column active"
              @click="nav('https://gpt-all.web.guanyingis.com/#/home?type=food')"
            >牛么么</div>
            <div
              v-if="type_id == '3'"
              class="column active"
              @click="nav('https://gpt-all.web.guanyingis.com/#/home?type=tombarthite')"
            >垚小稀</div>
            <div
              v-if="type_id == '7'"
              class="column active"
              @click="nav('https://gpt-all.web.guanyingis.com/#/home?type=playing')"
            >红小鬼</div>
            <div
              v-if="type_id == '8'"
              class="column active"
              @click="nav('https://gpt-all.web.guanyingis.com/#/home?type=ecology')"
            >绿小影</div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="search-form">
          <el-form inline>
            <el-form-item label="模型名称">
              <el-input placeholder="请输入" v-model="searchData.name"></el-input>
            </el-form-item>
            <el-form-item label="应用场景">
              <el-input placeholder="请输入" v-model="searchData.scenarios"></el-input>
            </el-form-item>
            <el-form-item label="关联字段">
              <el-input placeholder="请输入" v-model="searchData.linked_datas"></el-input>
            </el-form-item>
            <el-form-item label="数据来源">
              <el-select v-model="searchData.data_origin">
                <el-option
                  v-for="item in origins"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="table">
          <div class="table-header tr">
            <div class="th">ID</div>
            <div class="th">模型标识</div>
            <div class="th">模型名称</div>
            <div class="th">应用场景</div>
            <div class="th">关联字段</div>
            <div class="th">模型介绍</div>
            <div class="th">应用价值</div>
          </div>
          <div class="table-body">
            <div class="item tr" v-for="item in tableData" :key="item.id">
              <el-tooltip effect="dark" :content="item.id + ''" placement="top-end">
                <div class="th">{{ item.id }}</div>
              </el-tooltip>

              <el-tooltip effect="dark" :content="item.model_mark" placement="top-end">
                <div class="th">{{ item.model_mark }}</div>
              </el-tooltip>

              <el-tooltip effect="dark" :content="item.name " placement="top-end">
                <div class="th">{{ item.name }}</div>
              </el-tooltip>

              <el-tooltip effect="dark" :content="item.scenarios" placement="top-end">
                <div class="th">{{ item.scenarios }}</div>
              </el-tooltip>

              <el-tooltip effect="dark" :content="item.linked_datas" placement="top-end">
                <div class="th">{{ item.linked_datas }}</div>
              </el-tooltip>

              <el-tooltip effect="dark" :content="item.describe" placement="top-end">
                <div class="th">{{ item.describe }}</div>
              </el-tooltip>

              <el-tooltip effect="dark" :content="item.scenarios" placement="top-end">
                <div class="th">{{ item.scenarios }}</div>
              </el-tooltip>
            </div>
          </div>

          <el-row class="pager">
            <el-pagination
              style="text-align: right; margin: 20px 0"
              small
              :background="true"
              :page-sizes="pageSizes"
              layout="total, sizes, prev, pager, next, jumper"
              :total="tableTotal"
              :page-size="limit"
              :pager-count="5"
              :current-page="page"
              @size-change="pageSizeChange"
              @current-change="handleCurrentChange"
            ></el-pagination>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: "main",
  computed: {
    tableData() {
      const list = this.tableList;
      return list.slice((this.page - 1) * this.limit, this.page * this.limit);
    },
    tableList() {
      const modelsData = this.modelsData;
      const active = this.active;
      let result = this.modelsData.filter((item) => item.type_id == active);
      const { name, scenarios, linked_datas, data_origin } = this.searchData;
      if (name) {
        result = result.filter((item) => item.name.includes(name));
      }
      if (scenarios) {
        result = result.filter((item) => item.scenarios.includes(scenarios));
      }
      if (linked_datas) {
        result = result.filter((item) =>
          item.linked_datas.includes(linked_datas)
        );
      }
      if (data_origin) {
        result = result.filter((item) => item.data_origin == data_origin);
      }
      return result;
    },
    tableTotal() {
      return this.tableList.length;
    },
    pageData() {
      return this.neighbourhoods.find((item) => item.id == this.type_id);
    },
  },
  methods: {
    pageSizeChange(limit) {
      this.limit = limit;
    },
    handleCurrentChange(page) {
      this.page = page;
    },
    nav(url) {
      window.open(url);
    },
  },
  mounted() {
    const type_id = this.$route.query.id || 0;
    this.type_id = type_id;

    this.$request
      .get("http://guanying-gbox-ai-bot.web.guanyingis.com/api/model_types")
      .then((data) => {
        this.model_types = data.filter((item) => type_id == item.neighbourhood);
        this.active = this.model_types[0].id;
      });

    this.$request
      .get("http://guanying-gbox-ai-bot.web.guanyingis.com/api/models")
      .then((data) => {
        this.modelsData = data;
      });
  },
  data() {
    return {
      total: 0,
      active: null,
      page: 1,
      limit: 20,
      model_types: [],
      pageSizes: [10, 20, 30, 50, 100],
      origins: [
        { id: 0, name: "会昌", isShow: true },
        { id: 1, name: "智龙", isShow: true },
        { id: 2, name: "东江源", isShow: true },
        { id: 3, name: "黄南州", isShow: true },
      ],
      neighbourhoods: [
        { id: 0, name: "现代家具", isShow: true },
        { id: 1, name: "装备制造", isShow: true },
        { id: 2, name: "石化化工", isShow: true },
        { id: 3, name: "有色金属", isShow: true },
        { id: 4, name: "电子信息", isShow: true },
        { id: 5, name: "铜基新材", isShow: true },
        { id: 6, name: "食品产业", isShow: true },
        { id: 7, name: "玩具产业", isShow: true },
        { id: 8, name: "生态环保", isShow: true },
      ],
      searchData: {},
      type_id: 0,
      modelsData: [],
    };
  },
};
</script>
<style>
.pager {
  position: relative;
  z-index: 999;
  display: flex;
  justify-content: center;
}
.table-cell {
  border: none !important;
}
</style>
<style scoped lang="less">
.table {
  color: #fff;

  ::v-deep {
    .el-pagination {
      display: flex;
      align-items: center;
    }
    .el-pagination__sizes {
      height: unset;
      line-height: unset;
    }

    .el-pagination.is-background .el-pager li,
    .el-pagination.is-background .btn-prev,
    .el-pagination.is-background .btn-next,
    .el-pagination__editor.el-input .el-input__inner {
      border: 1px solid #00c2e1 !important;
    }
  }
  ::v-deep .el-pagination__editor.el-input .el-input__inner {
    border: 1px solid #00c2e1;
  }

  ::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #00c2e1 !important;
  }
  ::v-deep .el-pagination__sizes .el-input .el-input__inner {
    background: transparent;
    border: 1px solid #00c2e1;
    color: #fff !important;
  }
  ::v-deep .el-pagination.is-background .btn-prev {
    background: transparent;
    border-radius: 2px;
    border: 1px solid #295a85;
    color: #fff;
  }
  ::v-deep .el-pagination.is-background .btn-next {
    background: transparent;
    border-radius: 2px;
    border: 1px solid #295a85;
    color: #fff;
  }
  ::v-deep .el-pagination.is-background .el-pager li {
    background: transparent;
    border-radius: 2px;
    border: 1px solid #295a85;
    color: #fff;
  }
  ::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active {
    background: #409eff;
  }
  ::v-deep .el-pagination__editor.el-input .el-input__inner {
    background: transparent;
    border: 1px solid #295a85;
    color: #fff;
  }
  ::v-deep .el-pagination__total,
  ::v-deep .el-pagination__jump {
    color: #fff;
  }
  .tr > .th {
    text-align: center;
    &:nth-of-type(1) {
      width: 70px;
    }
    &:nth-of-type(2),
    &:nth-of-type(3),
    &:nth-of-type(4),
    &:nth-of-type(5) {
      width: 180px;
    }
    &:nth-of-type(6),
    &:nth-of-type(7) {
      flex: 1;
    }
  }
  .table-body {
    overflow: auto;
    height: calc(100vh - 310px);
    .item {
      display: flex;
      align-items: center;
      margin-top: 12px;
      height: 52px;
      background: rgba(0, 53, 105, 0.4);
      box-shadow: inset -1px -5px 16px 0px rgba(0, 73, 141, 0.6);
      border-radius: 10px 10px 10px 10px;
      border: 1px solid;
      border-image: linear-gradient(
          332deg,
          rgba(0, 175, 255, 1),
          rgba(0, 175, 255, 0),
          rgba(0, 175, 255, 0)
        )
        1 1;
      .th {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .table-header {
    .th {
      font-family: YouSheBiaoTiHei, YouSheBiaoTiHei;
      font-weight: 400;
      font-size: 24px;
      color: #ffffff;
    }
    display: flex;
    align-items: center;
    height: 60px;
    background: rgba(0, 53, 105, 0.6);
    box-shadow: inset -1px -5px 16px 0px rgba(0, 73, 141, 0.6);
    border-radius: 10px 10px 10px 10px;
    border: 1px solid;
    border-image: linear-gradient(
        332deg,
        rgba(0, 175, 255, 1),
        rgba(0, 175, 255, 0),
        rgba(0, 175, 255, 0)
      )
      1 1;
  }
}
.search-form ::v-deep .el-input__inner {
  width: 210px;
  height: 36px;
  background: rgba(0, 30, 68, 0.6);
  box-shadow: inset 0px 0px 19px 0px #003272;
  border-radius: 3px 3px 3px 3px;
  border: 1px solid #014795;
}

.page {
  min-width: 1920px !important;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-image: url(../../assets/imgs/tradingFloor_bg.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  .content {
    padding: 20px;
    flex: 1;
    display: flex;
    justify-content: space-between;
    .left {
      width: 257px;
      padding: 20px 24px;
      box-sizing: border-box;
      height: 100%;
      background-image: url(../../assets/imgs/tradingFloor_content_left_bg.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      .cate_name {
        margin-bottom: 20px;
      }
      .list {
        padding-top: 5px;
        .column {
          height: 36px;
          cursor: pointer;
          background-image: url(../../assets/imgs/cate4.png);
          background-repeat: no-repeat;
          background-size: 100% 100%;
          display: flex;
          align-items: center;
          font-weight: 400;
          font-size: 14px;
          justify-content: center;
          color: #c9eeff;
          margin-top: 4px;
          &.active {
            background-image: url(../../assets/imgs/cate3.png);
          }
        }
      }
      .tab {
        background-image: url(../../assets/imgs/cate2.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        cursor: pointer;
        height: 67px;
        font-weight: 500;
        font-size: 20px;
        color: #cff1ff;
        &.active {
          background-image: url(../../assets/imgs/cate1.png);
        }
        span {
          margin-right: 12px;
        }
        .icon {
          color: #1dbdf7;
          font-size: 18px;
        }
      }
      .cate_name {
      }
    }
    .right {
      padding: 20px;
      box-sizing: border-box;
      width: 1603px;
      height: 100%;
      background-image: url(../../assets/imgs/tradingFloor_content_right_bg.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
  }
  .header {
    height: 88px;
    width: 100%;
    position: relative;
    z-index: 99;
    background-image: url(../../assets/imgs/tradingFloor_header_bg.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    font-family: YouSheBiaoTiHei, YouSheBiaoTiHei;
    font-weight: 400;
    font-size: 46px;
    color: #ffffff;
    line-height: 54px;
    text-shadow: 0px 0px 15px #51ddff;
  }
}
</style>

