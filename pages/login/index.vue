<template>
  <div class="login-page col-center row-center">
    <el-image style="height:56px" :src="require('../../assets/imgs/logo2.png')"></el-image>

    <div class="login-wrapper">
      <div class="login-form">
        <div class="tab">
          <div class="tab-item" :class="activeIndex == 0 ? 'active' : ''" @click="clickTab(0)">
            密码登录
          </div>
          <div class="tab-item" :class="activeIndex == 1 ? 'active' : ''" @click="clickTab(1)">
            验证码登录
          </div>
        </div>
        <div class="form-wrapper">
          <el-form v-show="activeIndex == 0" ref="loginByAccountForm" :model="loginByAccountForm"
            :rules="loginByAccountFormRules" label-width="0">
            <!-- 账号登录 -->
            <el-form-item prop="account">
              <el-input v-model="loginByAccountForm.account" placeholder="输入账号或手机号" @keyup.enter.native="login()">
              </el-input>
            </el-form-item>
            <el-form-item prop="passwd">
              <el-input v-model="loginByAccountForm.passwd" type="password" placeholder="输入密码"
                @keyup.enter.native="login()">
              </el-input>
            </el-form-item>
          </el-form>
          <el-form v-show="activeIndex == 1" ref="loginByMobileForm" :model="loginByMobileForm"
            :rules="loginByMobileFormRules" label-width="0">
            <!-- 短信登录 -->
            <el-form-item prop="mobile">
              <el-input v-model="loginByMobileForm.mobile" placeholder="输入手机号" @keyup.enter.native="login()">
              </el-input>
            </el-form-item>
            <el-form-item class="code-input" prop="sms">
              <el-input v-model="loginByMobileForm.sms" placeholder="输入验证码" @keyup.enter.native="login()">
                <template  slot="suffix">
                  <span class="get-code" @click="getCode">{{
                    timer ? `${seconds}秒后重新获取` : "获取验证码"
                  }}</span>
                </template>
              </el-input>
            </el-form-item>
          </el-form>
          <div class="login-submit row-center col-center" @click="login()">登 录</div>
        </div>
        <div class="forget">
          <div style="display: flex; justify-content: space-between; width: 382px">
            <div class="btn" @click="gotoResetPwd">忘记密码?</div>
            <!-- <div class="v-line"></div> -->
            <div class="btn" @click="gotoRegister">免费注册</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations } from "vuex";
import Api from "../../plugins/api";
import config from "@/config/index";
export default {
  name: "LoginPage",
  layout: "main",
  data() {
    return {
      loginByAccountForm: {
        account: "",
        passwd: "",
      },
      loginByMobileForm: {
        mobile: "",
        sms: "",
      },
      loginByAccountFormRules: {
        account: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        passwd: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
      loginByMobileFormRules: {
        mobile: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        sms: [{ required: true, message: "请输入验证码", trigger: "blur" }],
      },
      activeIndex: 0,
      timer: null,
      seconds: 60,
    };
  },

  methods: {
    ...mapMutations(["setToken", "setUserInfo", "setWelfareToken"]),
    clickTab(i) {
      this.activeIndex = i;
      this.$refs.loginByAccountForm.clearValidate();
      this.$refs.loginByMobileForm.clearValidate();
    },
    getCode() {
      if (this.timer) return;
      this.$request
        .get(Api.userMobileCode, {
          params: { mobile: this.loginByMobileForm.mobile },
        })
        .then((res) => {
          if (res.code === 0) {
            this.$message({
              message: res.msg,
              type: "success",
            });
            this.timer = setInterval(() => {
              this.seconds--;
              if (this.seconds <= 0) {
                this.timer && clearInterval(this.timer);
                this.timer = null;
                this.seconds = 120;
              }
            }, 1000);
          } else {
            this.$message({
              message: res.msg,
              type: "warning",
            });
            this.timer && clearInterval(this.timer);
            this.timer = null;
            this.seconds = 120;
          }
        });
    },
    login() {
      if (this.activeIndex === 0) {
        this.$refs.loginByAccountForm.validate((valid) => {
          if (valid) {
            this.$request
              .post(Api.loginByAccount, this.loginByAccountForm)
              .then((res) => {
                if (res.code === 0) {
                  const accessToken = res.data.access_token;
                  const { status, welfare_token } = res.data;
                  this.loginRes(status, accessToken, welfare_token);
                } else {
                  this.$message.error(res.msg);
                }
              });
          }
        });
      } else {
        this.$refs.loginByMobileForm.validate((valid) => {
          if (valid) {
            this.$request
              .post(Api.loginByMobile, this.loginByMobileForm)
              .then((res) => {
                if (res.code === 0) {
                  const accessToken = res.data.access_token;
                  const { status, welfare_token } = res.data;
                  this.loginRes(status, accessToken, welfare_token);
                } else {
                  this.$message.error(res.msg);
                }
              });
          }
        });
      }
    },

    // 获取用户信息
    getUserInfo() {
      return this.$request.get(Api.getUserInfo);
    },
    // 处理登录结果
    async loginRes(status, accessToken, welfare_token) {
      switch (status) {
        case 1:
        case 3:
        case 4:
        case 5:
          {
            this.setToken(accessToken);
            this.setWelfareToken(welfare_token);
            this.$Cookies.set("cloud_token", accessToken);
            this.$Cookies.set("welfare_token", welfare_token, {
              path: "/",
              domain: config.welfare_domain,
            });

            const userData = await this.getUserInfo();
            const userInfo = userData.data;
            this.setUserInfo(JSON.stringify(userInfo));

            this.$message.success("登录成功");
            if (this.$route.query.backPage) {
              this.$router.push(this.$route.query.backPage);
            }

            this.$router.push("/");
          }
          break;
        case 2: // 账号禁用，弹出提示
          this.$message.error("该账号已被禁用");
          break;
      }
    },
    gotoRegister() {
      this.$router.push("/register");
    },
    gotoResetPwd() {
      this.$router.push("/resetPwd");
    },
  },
};
</script>
<style lang="less" scoped>
.login-page {
  width: 100vw;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background-color: #EEF7FF;
  background-image: url(../../assets/imgs/login-bg.png);
  background-size: 100% 100%;
}
::v-deep {
  .el-form-item {
    margin-top: 24px;
  }
  .el-input__inner {
    height: 48px;
    background: rgba(137,147,165,0.06);
  }
  .el-input__suffix-inner {
    height: 100%;
    display: flex;
    align-items: center;
  }
}
.get-code {

font-size: 14px;
color: #257FF8;
line-height: 16px;
cursor: pointer;
}
.login-wrapper {
  width: 1032px;
  margin-top: 78px;
  height: 651px;
  padding: 40px 0;
  box-sizing: border-box;
  background-color: #fff;
  display: flex;
  justify-content: center;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.06);
  border-radius: 10px 10px 10px 10px;
  .forget {
        display: flex;
        justify-content: center;
        color: #656565;
        margin-top: 15px;
        font-size: 14px;

        .btn {
          cursor: pointer;
          color: #257FF8;
          padding: 0;

          &:hover {
            text-decoration: underline;
          }
        }

        .v-line {
          width: 0;
          height: 16px;
          border: 1px solid #d5d5d5;
        }
      }
  .login-submit {
    width: 382px;
    height: 54px;
    background: linear-gradient(90deg, #257FF8 0%, #0361E9 100%);
    box-shadow: 0px 4px 10px 0px rgba(37, 127, 248, 0.4);
    border-radius: 6px 6px 6px 6px;
cursor: pointer;

    font-weight: bold;
    font-size: 18px;
    color: #FFFFFF;
    line-height: 21px;

  }

  .login-form {
    width: 382px;

    .tab {
      width: 382px;
      margin: 0 auto;
      font-size: 18px;
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      font-weight: 400;
      text-align: center;
      color: #353535;
      display: flex;
      justify-content: space-around;

      .tab-item {
        padding: 30px 10px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 30px;
        font-family: YouSheBiaoTiHei, YouSheBiaoTiHei;
        font-weight: 400;
        color: #333333;
      }

      .tab-item.active::before {
        content: "";
        display: block;
        width: 22px;
        height: 4px;
        background: #257FF8;
        border-radius: 2px;
        position: absolute;
        bottom: 20px;
      }
    }

  }
}
</style>
