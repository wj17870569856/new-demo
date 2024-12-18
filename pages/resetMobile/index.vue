<template>
  <div class="resetpwd-page">
    <div class="logo">
      <span class="welcome">修改手机号</span>
    </div>
    <div class="step">
      <div class="step-item" :class="stepIndex >= 1 ? 'active' : ''">
        1.确认手机号
      </div>
      <div class="step-item" :class="stepIndex >= 2 ? 'active' : ''">
        2.安全验证
      </div>
      <div class="step-item" :class="stepIndex >= 3 ? 'active' : ''">
        3.重置手机号
      </div>
      <div class="step-item" :class="stepIndex >= 4 ? 'active' : ''">
        4.完成
      </div>
    </div>
    <div>
      <div v-if="stepIndex == 1" class="form">
        <el-form
          ref="confirmPhoneForm"
          :model="confirmPhoneForm"
          :rules="confirmPhoneFormRules"
          label-width="100px"
          class="confirmPhoneForm"
        >
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="confirmPhoneForm.mobile" disabled></el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="captcha">
            <el-input v-model="confirmPhoneForm.captcha"> </el-input>
            <img
              v-show="captchaSrc"
              :src="captchaSrc"
              class="captcha"
              title="点击重新获取验证码"
              @click="getCaptcha()"
            />
          </el-form-item>
          <el-form-item>
            <el-button class="next-btn" @click="nextStep(1)">下一步</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="stepIndex == 2" class="form">
        <div>
          <div class="sms-tips">
            短信验证码已发送到您手机上，请输入短信验证码
          </div>
          <el-form
            ref="securityForm"
            :model="securityForm"
            :rules="securityFormRules"
            label-width="100px"
            class="securityForm"
          >
            <el-form-item label="验证码" prop="sms">
              <el-input v-model="securityForm.sms">
                <template slot="append">
                  <span
                    class="get-code"
                    :class="timer ? '' : 'can-get'"
                    @click="authMobile"
                    >{{
                      timer ? `${seconds}秒后重新获取` : "重新获取验证码"
                    }}</span
                  >
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="next-btn" @click="nextStep(2)"
                >下一步</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div v-if="stepIndex == 3" class="form">
        <el-form
          ref="resetMobile"
          :model="resetMobile"
          :rules="resetMobileRules"
          label-width="100px"
          class="resetMobile"
        >
          <el-form-item label="新手机号" prop="new_mobile">
            <el-input v-model="resetMobile.new_mobile"></el-input>
          </el-form-item>
          <el-form-item label="短信验证码" prop="sms">
            <el-input v-model="resetMobile.sms">
              <template slot="append">
                <span
                  class="get-code"
                  :class="timer ? '' : 'can-get'"
                  @click="getCode"
                  >{{ timer ? `${seconds}秒后重新获取` : "获取验证码" }}</span
                >
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="next-btn" @click="nextStep(3)">下一步</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="stepIndex == 4" class="form">
        <img :src="success" width="120px" height="120px" />
        <div class="success-text">修改成功</div>
        <div class="btn-group">
          <div class="back-home" @click="goHome">返回首页</div>
          <div class="back-home" @click="reLogin">重新登录</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations } from "vuex";
import Api from "../../plugins/api";
import logoSrc from "../../assets/images/logo.png";
import success from "../../assets/images/register/success@2x.png";
import config from "@/config/index";
export default {
  name: "RegisterPage",
  layout: "register",
  data() {
    return {
      logoSrc,
      success,
      stepIndex: 1, // 当前步骤
      captchaSrc: "",
      confirmPhoneForm: {
        // 确认手机号
        mobile: "",
        captcha: "",
        key: "",
      },
      confirmPhoneFormRules: {
        captcha: [{ required: true, message: "请输入", trigger: "blur" }],
        mobile: [{ required: true, message: "请输入", trigger: "blur" }],
      },

      //   安全验证
      securityForm: {
        sms: "",
      },
      securityFormRules: {
        sms: [{ required: true, message: "请输入", trigger: "blur" }],
      },
      //   重置密码
      resetMobile: {
        new_mobile: "",
        sms: "",
      },
      resetMobileRules: {
        new_mobile: [
          { required: true, message: "请输入新手机号", trigger: "blur" },
          {
            pattern: /^(?:(?:\+|00)86)?1\d{10}$/,
            message: "请输入正确的手机号",
            trigger: "change",
          },
        ],
        sms: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "6-16位字符(字母、数字、符号)区分大小写",
            trigger: "change",
          },
        ],
      },
      seconds: 120,
      timer: null,
    };
  },
  mounted() {
    this.getCaptcha();
    this.confirmPhoneForm.mobile = this.$route.query.mobile;
  },
  methods: {
    ...mapMutations(["setToken", "setWelfareToken"]),

    // 获取图片验证码
    getCaptcha() {
      this.$request.get(Api.loginCaptcha).then((res) => {
        if (res.code === 0) {
          this.confirmPhoneForm.key = res.data.key;
          this.captchaSrc = res.data.captcha;
        }
      });
    },

    // 安全验证
    authMobile() {
      if (this.timer) return;
      this.$request
        .post(Api.userAuthenticationEditMobile, this.confirmPhoneForm)
        .then((res) => {
          console.log(res);
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
              type: "error",
            });
          }
        });
    },
    // 获取短信验证码
    getCode() {
      if (this.timer) return;
      this.$request
        .get(Api.userMobileCode, {
          params: { mobile: this.resetMobile.new_mobile },
        })
        .then((res) => {
          if (res.code === 0) {
            console.log(res);
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
          }
        });
    },
    nextStep(num) {
      if (num === 1) {
        this.$refs.confirmPhoneForm.validate((valid) => {
          if (valid) {
            this.$request
              .post(Api.userAuthenticationEditMobile, this.confirmPhoneForm)
              .then((res) => {
                console.log(res);
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
                  this.stepIndex = 2;
                } else {
                  this.$message({
                    message: res.msg,
                    type: "error",
                  });
                  this.stepIndex = 1;
                }
              });
          }
        });
      }
      if (num === 2) {
        this.$refs.securityForm.validate((valid) => {
          if (valid) {
            this.$request
              .post(Api.userCheckAuthenticationSms, {
                key: this.confirmPhoneForm.key,
                sms: this.securityForm.sms,
              })
              .then((res) => {
                console.log(res);
                if (res.code === 0) {
                  // this.$message({
                  //   message: res.msg,
                  //   type: 'success',
                  // })

                  // 如果已经通过，清除掉倒计时
                  this.timer && clearInterval(this.timer);
                  this.timer = null;
                  this.seconds = 120;

                  this.stepIndex = 3;
                } else {
                  this.$message({
                    message: res.msg,
                    type: "error",
                  });
                  this.stepIndex = 2;
                }
              });
          }
        });
      }
      if (num === 3) {
        this.$refs.resetMobile.validate((valid) => {
          if (valid) {
            this.$request
              .post(Api.userEditMobile, {
                key: this.confirmPhoneForm.key,
                ...this.resetMobile,
              })
              .then((res) => {
                console.log(res);
                if (res.code === 0) {
                  this.$message({
                    message: res.msg,
                    type: "success",
                  });
                  this.stepIndex = 4;
                } else {
                  this.$message({
                    message: res.msg,
                    type: "error",
                  });
                  this.stepIndex = 3;
                }
              });
          }
        });
      }
    },
    goHome() {
      // const userInfo = JSON.parse(this.$Cookies.get('userInfo'))
      // userInfo.mobile = this.resetMobile.new_mobile
      // this.$Cookies.set('userInfo', JSON.stringify(userInfo))
      // this.setUserInfo(JSON.stringify(userInfo))
      this.$router.push("/");
    },
    reLogin() {
      this.setToken("");
      this.setWelfareToken("");
      this.$Cookies.remove("cloud_token");
      this.$Cookies.remove("welfare_token", {
        path: "/",
        domain: config.welfare_domain,
      });
      this.$Cookies.remove("userInfo");
      this.$router.push("/login");
    },
  },
};
</script>
<style lang="less" scoped>
.resetpwd-page {
  background: #ffffff;
  height: 100vh;

  .logo {
    height: 120px;
    background: #ffffff;
    display: flex;
    align-items: center;
    width: 1184px;
    margin: 0 auto;
    .welcome {
      font-size: 20px;
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      font-weight: 400;
      text-align: left;
      color: #353535;
      letter-spacing: 3.6px;
      display: inline-block;
      padding: 0 10px;
    }
  }
  :deep(.el-input-group__append) {
    padding: 0 5px;
    background-color: #fff;
    border-left: none;
    color: #2263e8;
  }
  :deep(.el-form-item) {
    margin-bottom: 26px;
  }
  :deep(.el-form-item__error) {
    padding: 5px 0;
  }
  :deep(.el-form-item__error)::before {
    display: inline-block;
    content: "!";
    width: 14px;
    height: 14px;
    background: url("../../assets/images/warn_icon.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .step {
    height: 120px;
    background: linear-gradient(
      47deg,
      rgba(255, 255, 255, 0) 6%,
      #ecf1fa 56%,
      rgba(255, 255, 255, 0) 100%
    );
    display: flex;
    justify-content: center;
    align-items: center;

    .step-item {
      width: 226px;
      height: 44px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-image: url("../../assets/images/register/step_arrow@2x.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      font-size: 16px;
      color: #353535;

      &.active {
        background-image: url("../../assets/images/register/step_arrow_active@2x.png");
        color: #ffffff;
        line-height: 18px;
      }
    }
  }

  .form {
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    margin-top: 20px;

    .sms-tips {
      font-size: 14px;
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      font-weight: 400;
      text-align: center;
      color: #353535;
      padding: 10px;
      margin: 30px 0;
    }

    .confirmPhoneForm,
    .securityForm,
    .resetMobile {
      width: 400px;
    }

    .captcha {
      width: 108px;
      height: 40px;
      position: absolute;
      top: 0;
      right: -120px;
      cursor: pointer;
    }

    .success-text {
      font-size: 16px;
      font-family: Microsoft YaHei, Microsoft YaHei-Bold;
      font-weight: 700;
      text-align: center;
      color: #0bc763;
      padding: 2px;
      margin: 2px 0;
    }

    .success-msg {
      width: 183px;
      height: 34px;
      font-size: 12px;
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      font-weight: 400;
      text-align: left;
      color: #656565;
      line-height: 18px;
      margin: 12px 0;
    }

    .back-home {
      padding: 13px 35px;
      background: rgba(137, 147, 165, 0.06);
      border: 1px solid #d5d5d5;
      border-radius: 2px;
    }

    .next-btn {
      width: 120px;
      height: 40px;
      background: #2263e8;
      border-radius: 2px;
      color: #fff;
      margin-top: 20px;
    }

    .btn-group {
      display: flex;
      div {
        margin: 70px 10px;
        cursor: pointer;
      }
    }

    .sub-title {
      width: 665px;
      height: 38px;
      line-height: 38px;
      padding-left: 10px;
      background: linear-gradient(
        90deg,
        #f1f4fa 27%,
        rgba(255, 255, 255, 0) 100%
      );
      margin-bottom: 20px;
      font-size: 16px;
      font-family: Microsoft YaHei, Microsoft YaHei-Bold;
      font-weight: 700;
      text-align: left;
      color: #353535;
    }
  }
}
.can-get {
  cursor: pointer;
}
</style>
