<template>
  <div class="supply wrap">
    <Functional :show="['我的供应','我的需求']" />

    <div class="content">
      <div class="search-bar row-sw">
        <span class="label-title">供需中心</span>
        <el-input
          clearable
          placeholder="请输入您感兴趣的需求"
          v-model="keyword"
          style="width: 590px;height:40px"
        >
          <i class="el-icon-search" :size="21" slot="prefix"></i>
          <el-button
            slot="append"
            type="primary"
            @click="reload"
            style="width: 89px;height:40px;background: #257FF8;color:#fff;border-radius:0"
          >搜索</el-button>
        </el-input>
        <el-button
          plain
          class="publish btn"
          icon="el-icon-s-promotion"
          @click="$router.push('/supplyDemand/publish')"
        >免费发布需求</el-button>
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
          </div>
    
      </div>
      <div class="list">
        <div class="item" v-for="item in dataList" :key="item.id">
          <div class="line1 row-sw">
            <span class="title">{{ item.title }}</span>
            <span class="status">面议</span>
          </div>
          <div class="line2 row-sw">
            <div class="tags">
              <ul class="flex">
                <li>{{ item.first_cate_name }}</li>
                <li>{{ item.second_cate_name }}</li>
                <li>{{item.third_cate_name}}</li>
              </ul>
            </div>
            <div class="countdown" v-if="item.deadline_long == '2'">
              <span v-if=" timeAgo(item.deadline * 1000)">{{ timeAgo(item.deadline * 1000) }}后</span>截止
            </div>
          </div>
          <div class="line3 row-sw">
            <div class="desc">{{ item.remark }}</div>
            <button
              class="btn detail"
              @click="$router.push('/supplyDemand/details?id=' + item.id)"
            >查看需求</button>
          </div>
          <div class="line4 col-center">
            <el-avatar :size="32" :src="item.company_logo"></el-avatar>
            <span class="company">{{ item.company_name }}</span>
            <span class="dot">|</span>
            <span>发布时间:{{ $moment(item.update_time * 1000).format("yyyy-MM-DD HH:mm:ss") }}</span>
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
  </div>
</template>

<script>
import utils from "@/utils";
import config from "@/config";
import Functional from "@/components/Functional";
import axios from "axios";
import Api from "../../plugins/api";
export default {
  name: "supplyPage",
  layout: "supply",
  components: {
    Functional,
  },
  methods: {
    timeAgo: utils.timeAgo,
    resetActive () {
      this.active1 = "";
      this.active2 = "";
      this.active3 = "";
      this.reload();
    },
    reload() {
      this.page = 1;
      this.getSupplyOrderList();
    },
    getCateId() {
      const { active1, active2, active3 } = this;
      var cat1_id = "";
      var cat2_id = "";
      var cat3_id = "";
      if (active3) {
        cat3_id = active3
      }
      if (active2) {
        cat2_id = active2
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
        this.getSupplyOrderList();
      });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getSupplyOrderList();
    },
    getSupplyOrderList() {
      this.$request
        .get(Api.getSupplyOrderList, {
          params: {
            type: this.type,
            information_type: this.information_type,
            keyword: this.keyword,
            page: this.page,
            limit: this.limit,
            ...this.getCateId(),
          },
        })
        .then((res) => {
          this.total = res.count;
          this.dataList = res.data;
        });
    },
  },
  asyncData({ query }) {
    var type = 1;
    var information_type = 1;
    return axios
      .all([
        axios.get(config.baseUrl + Api.getSupplyOrderList, {
          params: { page: 1, limit: 10, information_type, type },
        }),
        axios.get(config.baseUrl + Api.getGoodsCategoryTree, {}),
      ])
      .then(
        axios.spread(function (res, res2) {
          return {
            information_type,
            type,
            dataList: res.data.data,
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
      information_type: "",
      type: "",
      page: 1,
      limit: 10,
      dataList: [],
      total: 0,
      category: [],
      active1: "",
      active2: "",
      active3: "",
      keyword: "",
      showMoreByLevel2: false,
      showMoreByLevel3: false,
    };
  },
};
</script>

<style scoped lang="less">
.list {
  margin-top: 30px;
  min-height: 60vh;

  .item {
    width: 100%;
    min-height: 152px;
    background: #ffffff;
    border-radius: 6px 6px 6px 6px;
    margin-bottom: 20px;
    padding: 16px 20px 4px;
    box-sizing: border-box;

    .line1 {
      .title {
        font-weight: 500;
        font-size: 16px;
        color: #0a1833;
        line-height: 19px;
        position: relative;

        &::after {
          position: absolute;
          right: -73px;
          top: 50%;
          transform: translateY(-50%);
          content: "生效中";
          width: 60px;
          height: 27px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #21bc72;
          border-radius: 4px 4px 4px 4px;
          font-size: 14px;
          color: #ffffff;
          line-height: 16px;
        }
      }

      .status {
        font-weight: 500;
        font-size: 20px;
        color: #ff2618;
        line-height: 23px;
      }
    }

    .line2 {
      margin-top: 11px;

      .tags {
        li {
          padding: 0 6px;
          display: flex;
          align-items: center;
          height: 24px;
          border-radius: 4px 4px 4px 4px;
          border: 1px solid #257ff8;
          font-size: 12px;
          color: #257ff8;
          line-height: 14px;
          margin-right: 10px;
        }
      }

      .countdown {
        font-size: 14px;
        color: #8993a5;

        span {
          color: #257ff8;
        }
      }
    }

    .line3 {
      font-size: 12px;
      color: #8993a5;
      line-height: 15px;
      margin-top: 10px;

      .desc {
        width: 1060px;
      }

      .btn.detail {
        width: 100px;
        height: 36px;
        background: linear-gradient(90deg, #257ff8 0%, #0361e9 100%);
        border-radius: 4px 4px 4px 4px;
        cursor: pointer;
        font-weight: 500;
        font-size: 16px;
        color: #ffffff;
        border: none;
      }
    }

    .line4 {
      font-weight: 400;
      font-size: 12px;
      color: #43546f;
      line-height: 14px;

      .company {
        margin-left: 8px;
      }

      .dot {
        color: #b6bcc7;
        margin: 0 10px;
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

  .label-title {
    font-weight: bold;
    font-size: 30px;
    color: #257ff8;
    line-height: 35px;
    letter-spacing: 1px;
  }

  .el-icon-search {
    font-size: 21px;
    display: flex;
    align-items: center;
    height: 100%;
    line-height: 100%;
    margin-left: 4px;
  }

  .search {
    width: 89px;
  }
}
</style>