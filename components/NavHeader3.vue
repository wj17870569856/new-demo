<template>
  <div class="nav-header">
    <div class="content row-sw col-center">
      <div class="logo" @click="$router.push('/')">
        <img src="../assets/imgs/logo2.png" />
      </div>
      <!-- <div class="tabs flex">
        <div
          @click="nav(item)"
          :class="active == index ? 'active' : ''"
          v-for="(item, index) in getTabs"
          :key="index"
        >{{ item.name }}</div>
      </div> -->
      <!-- <div class="tabs flex">
        <div>首页</div>
        <div class="">供需中心</div>
        <div class="active">交易大厅</div>
      </div> -->
      <div class="tabs flex">
        <div @click="$router.push('/')">首页</div>

        <el-popover
          :visible-arrow="false"
          placement="bottom"
          trigger="hover"
          popper-class="popper-class"
        >
          <div class="news extend row-sw"  style="width: 1000px;">
            <div
              class="item"
              @click="$router.push('/news?cate_id='+item.cate_id)"
              v-for="item in category_list"
              :key="item.id"
            >
              <el-image style="width:31px;height:31px" :src="item.icon"></el-image>
              <p>{{ item.cate_name }}</p>
            </div>
          </div>
          <div slot="reference">
            <span>新闻资讯</span>
            <i class="el-icon-arrow-down"></i>
          </div>
        </el-popover>

        <el-popover
          :visible-arrow="false"
          placement="bottom"
          trigger="hover"
          popper-class="popper-class"
        >
          <div class="news extend row-sw" style="width: 1300px;">
            <div class="item" @click="$router.push('/news?cate_id='+item.cate_id)">
              <el-image
                style="width:31px;height:31px"
                :src="require('../assets/imgs/extend21.png')"
              ></el-image>
              <p>产业数据平台</p>
            </div>

            <div class="item" @click="$router.push('/dataOpenPlatform')">
              <el-image
                style="width:31px;height:31px"
                :src="require('../assets/imgs/extend17.png')"
              ></el-image>
              <p>产业模型平台</p>
            </div>

            <div class="item" @click="$router.push('/productList')">
              <el-image
                style="width:31px;height:31px"
                :src="require('../assets/imgs/extend18.png')"
              ></el-image>
              <p>交易大厅</p>
            </div>

            <div class="item" @click="$router.push('/supplyDemand')">
              <el-image
                style="width:31px;height:31px"
                :src="require('../assets/imgs/extend19.png')"
              ></el-image>
              <p>需求中心</p>
            </div>

            <div class="item"  @click="$router.push('/guidance')">
              <el-image
                style="width:31px;height:31px"
                :src="require('../assets/imgs/extend20.png')"
              ></el-image>
              <p>咨询服务</p>
            </div>
          </div>
          <div slot="reference">
            <span class="fb">数据要素</span>
            <i class="el-icon-arrow-down"></i>
          </div>
        </el-popover>

        <div @click="$router.push('/cooperation')">生态合作</div>
        <div @click="$router.push('/aboutUs')">关于我们</div>
      </div>
      <div class="user row-sw col-center">
        <!-- <div class="location">
          <span>赣县区</span>
          <i class="el-icon-caret-bottom"></i>
        </div>-->
        <div class="col-center">
          <el-popover v-if="userInfo.realname" placement="top-start" width="82" trigger="hover">
            <div class="fn">
              <ul>
                <li class="col-center row-center" @click="$router.push('/personalCenter')">个人中心</li>
                <li class="col-center row-center" @click="logout">退出登录</li>
              </ul>
            </div>

            <div class="info col-center" slot="reference">
              <el-avatar :size="32" :src="userInfo.avatar_url"></el-avatar>
              <span class="nick-name">hello，{{ userInfo.realname }}</span>
              <i class="el-icon-caret-bottom"></i>
            </div>
          </el-popover>

          <div class="col-center login register" v-else>
            <span @click="$router.push('/login')">登录</span>
            <span>/</span>
            <span @click="$router.push('/register')">注册</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Api from "@/plugins/api";
import config from "~/config";
import { mapState, mapMutations } from "vuex";
export default {
  props: {
    active: {
      type: [Number, String],
      default: 0,
    },
    tabs: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapState(["userInfo", "category_list"]),
    // getTabs() {
    //   if (this.tabs && this.tabs.length) return this.tabs;
    //   return [
    //     {
    //       name: "首页",
    //       path: "/",
    //     },
    //     {
    //       name: "新闻咨询",
    //       path: "/supplyDemand",
    //     },
    //     {
    //       name: "数据要素",
    //       path: "/productList",
    //     },
    //     {
    //       name: "生态合作",
    //       path: "/cooperation",
    //     },
    //     {
    //       name: "关于我们",
    //       path: "/aboutUs",
    //     },
    //   ];
    // },
  },
  methods: {
    ...mapMutations(["setToken", "setWelfareToken"]),
    nav(item) {
      if (item.path) {
        this.$router.push(item.path);
      } else {
        window.open(item.goto);
      }
    },
    async logout() {
      const pcRes = await this.$request.post(Api.logout);

      if (pcRes.code == 0) {
        this.setToken("");
        this.setWelfareToken("");
        this.$Cookies.remove("cloud_token");
        this.$Cookies.remove("welfare_token", {
          path: "/",
          domain: config.welfare_domain,
        });
        this.$Cookies.remove("PHPSESSID", {
          path: "/",
          domain: config.welfare_domain,
        });
        this.$Cookies.remove("userInfo");

        setTimeout(() => {
          location.reload();
        }, 100);
      }
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="less" scoped>
.fb{font-weight: bold;}
.login.register {
  color: #333;
  span {
    margin: 0 3px;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
}
:deep(.el-popover) {
  padding: 0 !important;
}

.fn {
  background: #ffffff;
  border-radius: 6px 6px 6px 6px;

  li {
    height: 44px;
    background: #ffffff;
    border-radius: 6px 6px 6px 6px;
    font-size: 16px;
    color: #0a1833;
    line-height: 19px;
    cursor: pointer;

    &:hover {
      background: rgba(37, 127, 248, 0.1);
      color: #257ff8;
    }
  }
}

.user {
  .location {
    margin-right: 28px;
    font-size: 14px;
    color: #0a1833;
    position: relative;

    &::after {
      content: "";
      width: 1px;
      height: 20px;
      background: #0a1833;
      border-radius: 0px 0px 0px 0px;
      position: absolute;
      right: -13px;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  .info {
    font-size: 14px;
    color: #0a1833;

    .nick-name {
      margin-left: 4px;
    }
  }
}

.nav-header {
  height: 60px;
  background-color: #fff;
  min-width: 1300px;
  opacity: .6;
}

.tabs {
  height: 100%;

  & div {
    font-size: 18px;
    color: #0A1833;
    margin-right: 42px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    cursor: pointer;
    span {
      margin-right: 7px;
    }
    &:hover {
      // color: #fff;
      font-weight: bold;
    }
  }
}
.content {
  width: 1300px;
  margin: 0 auto;
  height: 100%;
}

.logo {
  height: 25px;
  font-weight: bold;
  font-size: 20px;
  color: #ffffff;
  line-height: 23px;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
  }
}
.popper-class {
  width: 100%;
  margin: 0;
  padding: 0;
  top: 58px !important;
  left: 0 !important;
  margin-top: 0 !important;
  min-height: 105px;
  background: #ffffff;
  box-shadow: 0px 0px 10px 4px rgba(0, 0, 0, 0.1);
  border-radius: 0px 0px 6px 6px;
}
.popper-class2 {
  width: 100%;
  margin: 0;
  padding: 20px 0;
  top: 58px !important;
  left: 0 !important;
  margin-top: 0 !important;
  min-height: 352px;
  background: #ffffff;
  box-shadow: 0px 0px 10px 4px rgba(0, 0, 0, 0.1);
  border-radius: 0px 0px 6px 6px;
}
.bazaar {
  width: 700px;
  .right {
    width: 380px;
    .list {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
    }
  }
  .left {
    width: 155px;
    .item {
      width: unset;
    }
  }
}
.extend {
  margin: auto;
  p {
    font-weight: 400;
    font-size: 18px;
    text-align: center;
    color: #8993a5;
  }
  .column {
    .item {
      margin-top: 10px;
    }
  }
  .item {
    width: 150px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 20px;
    cursor: pointer;
    p {
      font-weight: 500;
      font-size: 16px;
      margin-top: 10px;
      color: #0a1833;
      line-height: 19px;
    }
  }
}
</style>