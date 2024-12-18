<template>
  <div class="nav-header">
    <div class="content row-sw col-center">
      <div class="logo" @click="$router.push('/')">
        <img src="../assets/imgs/logo@2x.png" />
      </div>
      <div class="tabs flex">
        <div @click="$router.push('/')">首页</div>

        <el-popover
          :visible-arrow="false"
          placement="bottom"
          trigger="hover"
          popper-class="popper-class"
        >
          <div class="news extend row-sw">
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
            <div class="item" @click="$router.push('/numIntelligence/ecology')">
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

          <!-- <div class="bazaar extend row-sw">
            <div class="column left">
              <p>产业高质量数据集</p>
              <div class="list">
                <div class="item">
                  <el-image
                    style="width:31px;height:31px"
                    :src="require('../assets/imgs/extend5.png')"
                  ></el-image>
                  <p>产业大脑数智底座</p>
                </div>
                <div class="item"  @click="$router.push('/productList?')">
                  <el-image
                    style="width:31px;height:31px"
                    :src="require('../assets/imgs/extend6.png')"
                  ></el-image>
                  <p>交易大厅</p>
                </div>
                <div class="item"  @click="$router.push('/supplyDemand')">
                  <el-image
                    style="width:31px;height:31px"
                    :src="require('../assets/imgs/extend7.png')"
                  ></el-image>
                  <p>供需大厅</p>
                </div>
              </div>
            </div>
            <div class="column right">
              <p>产业模型共享</p>
              <div class="list">
                <div class="item" @click="$router.push('/tradingFloor?id=0')">
                  <el-image
                    style="width:31px;height:31px"
                    :src="require('../assets/imgs/extend8.png')"
                  ></el-image>
                  <p>现代家居</p>
                </div>
                <div class="item" @click="$router.push('/tradingFloor?id=2')">
                  <el-image
                    style="width:31px;height:31px"
                    :src="require('../assets/imgs/extend9.png')"
                  ></el-image>
                  <p>石化化工</p>
                </div>
                <div class="item" @click="$router.push('/tradingFloor?id=5')">
                  <el-image
                    style="width:31px;height:31px"
                    :src="require('../assets/imgs/extend10.png')"
                  ></el-image>
                  <p>铜基新材</p>
                </div>
                <div class="item" @click="$router.push('/tradingFloor?id=6')">
                  <el-image
                    style="width:31px;height:31px"
                    :src="require('../assets/imgs/extend11.png')"
                  ></el-image>
                  <p>食品产业</p>
                </div>
                <div class="item" @click="$router.push('/tradingFloor?id=3')">
                  <el-image
                    style="width:31px;height:31px"
                    :src="require('../assets/imgs/extend12.png')"
                  ></el-image>
                  <p>稀土有色</p>
                </div>
                <div class="item" @click="$router.push('/tradingFloor?id=7')">
                  <el-image
                    style="width:31px;height:31px"
                    :src="require('../assets/imgs/extend13.png')"
                  ></el-image>
                  <p>玩具产业</p>
                </div>
                <div class="item" @click="$router.push('/tradingFloor?id=8')">
                  <el-image
                    style="width:31px;height:31px"
                    :src="require('../assets/imgs/extend14.png')"
                  ></el-image>
                  <p>生态环保</p>
                </div>
                <div class="item">
                  <el-image
                    style="width:31px;height:31px"
                    :src="require('../assets/imgs/extend15.png')"
                  ></el-image>
                  <p>安全测试模型</p>
                </div>
                <div
                  class="item"
                  @click="nav({
                  goto:'http://localhost:3000/login?id=123'
                })"
                >
                  <el-image
                    style="width:31px;height:31px"
                    :src="require('../assets/imgs/extend16.png')"
                  ></el-image>
                  <p>产业通用模型</p>
                </div>
              </div>
            </div>
          </div>-->
          <div slot="reference">
            <span>数据要素</span>
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
          <el-popover placement="top-start" width="82" trigger="hover" v-if="userInfo.realname">
            <div class="fn">
              <dl>
                <li class="col-center row-center" @click="$router.push('/personalCenter')">个人中心</li>
                <li class="col-center row-center" @click="logout">退出登录</li>
              </dl>
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
  },
  computed: {
    ...mapState(["userInfo", "category_list"]),
  },
  methods: {
    ...mapMutations(["setToken", "setWelfareToken"]),
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
    nav(item) {
      if (item.path) {
        this.$router.push(item.path);
      } else {
        window.open(item.goto);
      }
    },
  },
  data() {
    return {
      tabs: [
        {
          name: "首页",
          path: "/",
        },
        {
          name: "数据归集",
          goto: "https://www.baidu.com",
        },
        {
          name: "供需大厅",
          path: "/supplyDemand",
        },
        {
          name: "交易大厅",
          path: "/productList",
        },
      ],
    };
  },
};
</script>
<style>
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
</style>
<style lang="less" scoped>
.news {
  width: 1020px;
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
.login.register {
  color: #fff;
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
    color: #ffffff;
    position: relative;

    &::after {
      content: "";
      width: 1px;
      height: 20px;
      background: #fff;
      border-radius: 0px 0px 0px 0px;
      position: absolute;
      right: -13px;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  .info {
    font-size: 14px;
    color: #ffffff;
    cursor: pointer;

    .nick-name {
      margin-left: 4px;
    }
  }
}

.nav-header {
  height: 60px;
  background: rgba(10, 42, 121, 0.7);
  min-width: 1300px;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  z-index: 999;
}

.tabs {
  height: 100%;

  & div {
    font-size: 18px;
    color: #fff;
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
      color: #fff;
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