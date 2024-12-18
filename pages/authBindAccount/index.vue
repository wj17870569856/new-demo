<template>
  <div class="login-auth">
    <div class="form-wrapper">
      <h1>账号绑定</h1>
      <el-form
        ref="loginByAccountForm"
        :model="loginByAccountForm"
        :rules="loginByAccountFormRules"
        label-width="0"
      >
        <!-- 账号登录 -->
        <el-form-item prop="account">
          <el-input
            v-model="loginByAccountForm.account"
            placeholder="输入账号或手机号"
            @keyup.enter.native="loginAuthBind()"
          >
            <template slot="prepend">
              <img :src="loginPhone" class="login-icon" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="passwd">
          <el-input
            v-model="loginByAccountForm.passwd"
            type="password"
            placeholder="输入密码"
            @keyup.enter.native="loginAuthBind()"
          >
            <template slot="prepend">
              <img :src="loginCode" alt="" class="login-icon" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="passwd">
          <el-button @click="loginAuthBind()">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { mapMutations } from "vuex";
import Api from "../../plugins/api";
import config from "../../config/index";
import loginPhone from "../../assets/images/login/login_phone@2x.png";
import loginCode from "../../assets/images/login/login_code@2x.png";
export default {
  name: "LoginAuth",
  layout: "loginAuth",
  data() {
    return {
      loginPhone,
      loginCode,
      code: "",
      loginByAccountForm: {
        account: "",
        passwd: "",
      },
      loginByAccountFormRules: {
        account: [
          { required: true, message: "请输入账号或手机号", trigger: "blur" },
        ],
        passwd: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  mounted() {
    this.code = this.$route.query.code;
  },
  methods: {
    ...mapMutations(["setToken", "setUserInfo"]),
    // 获取用户信息
    getUserInfo() {
      return this.$request.get(Api.getUserInfo);
    },
    loginAuthBind() {
      const params = { ...this.loginByAccountForm, code: this.code };
      // 请求接口，获取用户信息和token
      this.$request.post(Api.loginAuthBind, params).then((res) => {
        console.log(res);
        if (res.code === 0) {
          this.$message.success(res.msg);

          //   绑定成功后，再用code去授权登录
          this.getAuthByCode();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    getAuthByCode() {
      // 请求接口，获取用户信息和token
      this.$request
        .post(Api.authUserLogin, { code: this.code })
        .then(async (res) => {
          const { access_token, status, welfare_token } = res.data;

          // 处理登录结果
          switch (status) {
            case 1:
              {
                // 正常登录，跳转到首页
                this.setToken(access_token);
                this.$Cookies.set("cloud_token", access_token);
                this.$Cookies.set("welfare_token", welfare_token, {
                  path: "/",
                  domain: config.welfare_domain,
                });
                const userData = await this.getUserInfo();
                const userInfo = userData.data;
                this.setUserInfo(JSON.stringify(userInfo));
                // this.$Cookies.set('userInfo', JSON.stringify(userInfo))

                this.$message.success("登录成功");
                this.$router.push("/");
              }
              break;
            case 2: // 账号禁用，弹出提示
              this.$message.error("该账号已被禁用");
              break;
            case 4: // 待审核-跳转到注册页-待审核
              this.setToken(access_token);
              this.$router.push({ path: "/register", query: { status } });
              break;
            default: // 3和5 跳转到注册页-填写公司信息
              this.setToken(access_token);
              this.$Cookies.set("cloud_token", access_token);
              this.$router.push({ path: "/register", query: { status } });
              break;
          }
        });
    },
  },
};
</script>
<style scoped lang="less">
.login-auth {
  height: 100vh;
  width: 100vw;
  background-color: #fff;
  color: #999;
  display: flex;
  justify-content: center;
  align-items: center;
  .form-wrapper {
    padding: 20px 36px;
    text-align: center;
    border: 1px solid #f1f1f1;
    border-radius: 5px;
    color: #000;
    h1 {
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      font-size: 16px;
      color: #353535;
      letter-spacing: 2px;
      margin-bottom: 20px;
    }
    .login-icon {
      width: 48px;
      height: 41px;
    }

    .get-code {
      color: #2263e8;
      cursor: pointer;
    }

    :deep(.el-input-group__prepend) {
      padding: 0;
      background-color: #fff;
      //   border-right: none;
    }

    :deep(.el-input-group__append) {
      padding: 0 12px;
      background-color: rgba(137, 147, 165, 0.06);
      //   border-left: none;
    }

    :deep(.el-input__inner) {
      height: 48px;
      line-height: 48px;
      // background-color: rgba(137, 147, 165, 0.06);
      //   border-left: none;
      padding: 5px;
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

    :deep(.el-form-item.is-error .el-input__inner) {
      border-color: #e84b01;
    }

    :deep(.el-form-item.is-error .el-input-group__prepend) {
      border-color: #e84b01;
    }

    :deep(.el-form-item.is-error .el-input-group__append) {
      border-color: #e84b01;
    }

    :deep(.el-form-item.code-input .el-input__inner) {
      border-right: none;
    }

    :deep(.el-input__inner:focus) {
      border-color: #dcdfe6;
    }

    .login-submit {
      margin-top: 40px;
      width: 298px;
      height: 48px;
      background: #2263e8;
      border: 1px solid #2263e8;
      border-radius: 2px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #ffffff;
      line-height: 18px;
      cursor: pointer;
      font-size: 14px;
    }

    .shouquan {
      font-size: 14px;
      font-weight: 400;
      text-align: center;
      color: #2277e8;
      margin-top: 12px;
      cursor: pointer;
    }
  }
}
</style>
