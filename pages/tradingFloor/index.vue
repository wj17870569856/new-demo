<template>
  <div class="dataOpenPlatform">
    <div class="content">
      <div class="left">
        <div class="list-header">
          <h3>企业级模型</h3>
          <div class="flow" @click="flow = !flow">
            <span>{{flow?'收起':'展开'}}</span>
            <i :class="flow?'el-icon-arrow-up':' el-icon-arrow-down'"></i>
          </div>
        </div>

        <transition name="el-fade-in-linear">
        
      


        <div class="list-content" v-show="flow">
          <div
            @click="active = item.id"
            class="column"
            :class="item.id === active?'active':''"
            v-for="item in model_types"
            :key="item.id"
          >
            <div class="icon">
              <el-image
                style="width: 16px;height:16px"
                :src="item.id === active?require('../../assets/imgs/icon_model2.png'):require('../../assets/imgs/icon_model.png')"
              ></el-image>
            </div>
            <span>{{ item.name }}</span>
          </div>
        </div>
      </transition>
        <div class="list-header" style="margin-top: 30px;">
          <h3>产业级模型</h3>
          <div class="flow"></div>
        </div>
        <div class="list-content">
          <div
            class="column"
            @click="nav('http://lxb2.web.shuzhiren.com/#/home')"
            v-if="type_id == '0'"
          >
            <div class="icon">
              <el-image
                style="width: 16px;height:16px"
                :src="require('../../assets/imgs/icon_model.png')"
              ></el-image>
            </div>
            <span>鲁小班</span>
          </div>
          <div
            class="column"
            @click="nav('https://gpt-all.web.guanyingis.com/#/home?type=villiaumite')"
            v-if="type_id == '2'"
          >
            <div class="icon">
              <el-image
                style="width: 16px;height:16px"
                :src="require('../../assets/imgs/icon_model.png')"
              ></el-image>
            </div>
            <span>盐小氟</span>
          </div>
          <div
            v-if="type_id == '5'"
            class="column"
            @click="nav('https://gpt-all.web.guanyingis.com/#/home?type=copper')"
          >
            <div class="icon">
              <el-image
                style="width: 16px;height:16px"
                :src="require('../../assets/imgs/icon_model.png')"
              ></el-image>
            </div>
            <span>铜小铝</span>
          </div>
          <div
            v-if="type_id == '6'"
            class="column"
            @click="nav('https://gpt-all.web.guanyingis.com/#/home?type=food')"
          >
            <div class="icon">
              <el-image
                style="width: 16px;height:16px"
                :src="require('../../assets/imgs/icon_model.png')"
              ></el-image>
            </div>
            <span>牛么么</span>
          </div>
          <div
            v-if="type_id == '3'"
            class="column"
            @click="nav('https://gpt-all.web.guanyingis.com/#/home?type=tombarthite')"
          >
            <div class="icon">
              <el-image
                style="width: 16px;height:16px"
                :src="require('../../assets/imgs/icon_model.png')"
              ></el-image>
            </div>
            <span>垚小稀</span>
          </div>
          <div
            v-if="type_id == '7'"
            class="column"
            @click="nav('https://gpt-all.web.guanyingis.com/#/home?type=playing')"
          >
            <div class="icon">
              <el-image
                style="width: 16px;height:16px"
                :src="require('../../assets/imgs/icon_model.png')"
              ></el-image>
            </div>
            <span>红小鬼</span>
          </div>
          <div
            v-if="type_id == '8'"
            class="column"
            @click="nav('https://gpt-all.web.guanyingis.com/#/home?type=ecology')"
          >
            <div class="icon">
              <el-image
                style="width: 16px;height:16px"
                :src="require('../../assets/imgs/icon_model.png')"
              ></el-image>
            </div>
            <span>绿小影</span>
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
          <el-table :data="tableData" height="748px">
            <el-table-column label="ID" prop="id" width="90"></el-table-column>
            <el-table-column label="模型标识" prop="model_mark" width="120"></el-table-column>
            <el-table-column label="模型名称" prop="name" show-overflow-tooltip></el-table-column>
            <el-table-column label="应用场景" prop="scenarios" show-overflow-tooltip></el-table-column>
            <el-table-column label="关联字段" prop="linked_datas" show-overflow-tooltip></el-table-column>
            <el-table-column label="模型介绍" prop="describe" show-overflow-tooltip></el-table-column>
            <el-table-column label="应用价值" prop="value" show-overflow-tooltip></el-table-column>
          </el-table>

          <el-row class="pager">
            <el-pagination
              style="margin: 16px 0"
              background
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

    <div class="copyright">Copyright © 2022 江西冠英智能科技股份有限公司</div>
  </div>
</template>

<script>
export default {
  layout: "dataOpenPlatform",
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
    getList() {
      const type_id = this.type_id;
      this.$request
        .get("http://guanying-gbox-ai-bot.web.guanyingis.com/api/model_types")
        .then((data) => {
          this.model_types = data.filter(
            (item) => type_id == item.neighbourhood
          );
          this.active = this.model_types[0].id;
        });

      this.$request
        .get("http://guanying-gbox-ai-bot.web.guanyingis.com/api/models")
        .then((data) => {
          this.modelsData = data;
        });
    },
  },
  watch: {
    "$route.query.id"(id) {
      const type_id = id;
      this.type_id = type_id;
      this.getList();
    },
  },
  mounted() {
    const type_id = this.$route.query.id || 0;
    this.type_id = type_id;
    this.getList();
  },
  data() {
    return {
      total: 0,
      active: null,
      page: 1,
      limit: 20,
      flow:true,
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

<style scoped lang="less">
.copyright {

font-family: Noto Sans SC, Noto Sans SC;
font-weight: 400;
font-size: 12px;
color: #999999;
line-height: 38px;
text-align: center;
position: absolute;
bottom: 0;
left: 0;
right: 0;
}
::v-deep .el-table .cell {
font-family: Source Han Sans CN, Source Han Sans CN;
font-weight: 400;
font-size: 16px;
color: #0A1833;

}
::v-deep .el-form--inline .el-form-item__label {
font-family: Source Han Sans CN, Source Han Sans CN;
font-weight: 400;
font-size: 14px;
color: #0A1833;
}
::v-deep .el-table th.el-table__cell {
  background-color: #fafafa;
}
.list-content {
  display: flex;
  flex-wrap: wrap;
}
.list-header {
  padding: 8px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .flow {
    font-weight: 400;
    font-size: 14px;
    color: #333333;
    line-height: 29px;
    cursor: pointer;
  }
  h2 {
    font-family: Source Han Sans CN, Source Han Sans CN;
    font-weight: bold;
    font-size: 14px;
    color: #111111;
    line-height: 14px;
  }
}
.column {
  width: 130px;
  height: 30px;
  margin-left: 10px;
  margin-top: 10px;
  background: #ffffff;
  border-radius: 4px 4px 4px 4px;
  border: 1px solid #2998ff;
  display: flex;
  cursor: pointer;
  align-items: center;
  &.active {
    background: #2998ff;
    span {
      color: #fff;
    }
  }
  .icon {
    width: 30px;
    height: 30px;
    background: rgba(41, 152, 255, 0.1);
    border-radius: 0px 0px 0px 0px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  span {
    margin-left: 4px;
    font-weight: 400;
    font-size: 13px;
    color: #333333;
    line-height: 14px;
  }
}
.pager {
  display: flex;
  justify-content: center;
}
.dataOpenPlatform {
  background-image: url(../../assets/imgs/dataOpenPlatform_bg.png);
  background-size: 100% 100%;
  position: relative;
  background-repeat: no-repeat;
  padding: 110px 30px 38px;
  min-width: 1920px;
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  .content {
    width: 1860px;
    height: 932px;
    background: #ffffff;
    border-radius: 10px 10px 10px 10px;
    padding: 14px 20px 35px 20px;
    box-sizing: border-box;
    display: flex;
    .right {
      flex: 1;
      margin: 6px 20px 20px;
      overflow: hidden;
    }
    .left {
      width: 300px;
      box-sizing: border-box;
      height: 883px;
      padding-top: 11px;
      background: linear-gradient(
        180deg,
        rgba(41, 152, 255, 0.1) 0%,
        rgba(41, 152, 255, 0) 100%
      );
      border-radius: 0px 0px 0px 0px;
      border: 1px solid #b2daff;
    }
  }
}
.table {
}
</style>