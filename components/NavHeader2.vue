<template>
  <div class="nav-header">
    <div class="content row-sw col-center">
      <div class="logo" @click="$router.push('/')">
        <img src="../assets/imgs/logo2.png" />
      </div>
      <div class="tabs flex">
        <div
          @click="nav(item)"
          :class="active == index ? 'active' : ''"
          v-for="(item, index) in getTabs"
          :key="index"
        >{{ item.name }}</div>
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
    ...mapState(["userInfo"]),
    getTabs() {
      if (this.tabs && this.tabs.length) return this.tabs;
      // return [
      //   {
      //     name: "首页",
      //     path: "/",
      //   },
      //   {
      //     name: "供需中心",
      //     path: "/supplyDemand",
      //   },
      //   {
      //     name: "交易大厅",
      //     path: "/productList",
      //   },
      // ];
    },
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
  background: #fff;
  min-width: 1300px;
}

.tabs {
  height: 100%;

  & > div {
    font-size: 18px;
    color: #0a1833;
    margin-right: 48px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    cursor: pointer;

    &.active::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 80px;
      height: 4px;
      background-color: #257ff8;
      transform: translateX(-50%);
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
</style>