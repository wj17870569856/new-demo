<template>
  <div class="login-page col-center row-center">
    <el-image style="width: 596px;height:56px" :src="require('../../assets/imgs/logo2.png')"></el-image>

    <div class="login-wrapper">
      <div class="login-form">
        <div class="tab">
          <div class="tab-item active">
            注册
          </div>
        </div>
        <div class="form-wrapper">
          <el-form ref="registerByAccountForm" :model="registerByAccountForm" :rules="registerByAccountFormRules"
            label-width="0">
            <template v-if="current == '0'">
              <el-form-item prop="realname" class="required">
                <el-input v-model="registerByAccountForm.realname" placeholder="输入姓名">
                </el-input>
              </el-form-item>
              <el-form-item prop="passwd" class="tips required">
                <el-input v-model="registerByAccountForm.passwd" type="password" placeholder="输入密码">
                </el-input>
              </el-form-item>

              <el-form-item prop="mobile" class="required">
                <el-input v-model="registerByAccountForm.mobile" placeholder="输入手机号">
                </el-input>
              </el-form-item>
              <el-form-item class="code-input required" prop="sms">
                <el-input v-model="registerByAccountForm.sms" placeholder="输入验证码">
                  <template slot="suffix">
                    <span class="get-code" @click="getCode">{{
                      timer ? `${seconds}秒后重新获取` : "获取验证码"
                    }}</span>
                  </template>
                </el-input>
              </el-form-item>
            </template>



            <template v-else>
              <div class="form-title">公司及法人信息</div>

              <el-form-item prop="company_name" class="required">
                <el-input v-model="registerByAccountForm.company_name" placeholder="请输入公司名称"></el-input>
              </el-form-item>

              <el-form-item prop="province" class="required">
                <client-only>
                  <el-cascader v-model="registerByAccountForm.province" placeholder="请选择公司所在地" size="large"
                    style="width: 100%" :options="cityOptions">
                  </el-cascader>
                </client-only>
              </el-form-item>


              <el-form-item>
                <el-input v-model="registerByAccountForm.address" placeholder="请输入详细地址"></el-input>
              </el-form-item>
              <el-form-item prop="legal_person_name" class="required">
                <el-input v-model="registerByAccountForm.legal_person_name" placeholder="请输入法人姓名"></el-input>
              </el-form-item>
              <el-form-item>
                <el-input v-model="registerByAccountForm.legal_person_identity" placeholder="请输入法人身份证"></el-input>
              </el-form-item>
              <el-form-item prop="legal_person_mobile" class="required">
                <el-input v-model="registerByAccountForm.legal_person_mobile" placeholder="请输入法人电话"></el-input>
              </el-form-item>
              <el-form-item>
                <el-input v-model="registerByAccountForm.phone" placeholder="请输入办公电话"></el-input>
              </el-form-item>


              <div class="form-title">统一社会信用代码</div>




              <el-form-item prop="social_credit_code" class="required">
                <el-input v-model="registerByAccountForm.social_credit_code" placeholder="请输入统一社会信用代码"></el-input>
              </el-form-item>
              <el-form-item>

                <el-upload style="width:100%" name="business_license" action="" :on-preview="handlePreview"
                  :on-remove="handleRemove" :limit="1" :on-exceed="handleExceed" :file-list="fileList"
                  :show-file-list="true" :before-upload="uploadBusinessLicense"
                  accept=".pdf,.jpg,.jpeg,.png,.JPG,.JPEG,.PNG,.PDF">
                  <el-button style="width:100%" type="primary" plain icon="el-icon-upload2">点击上传营业执照副本</el-button>
                </el-upload>

              </el-form-item>

              <el-form-item>
                <el-date-picker v-model="registerByAccountForm.establishment_date" style="width: 100%" type="date"
                  placeholder="请选择公司成立日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>


              <el-form-item>
                <el-input v-model="registerByAccountForm.registered_capital" placeholder="请输入注册资本">
                  <template slot="append">万</template>
                </el-input>
              </el-form-item>
            </template>




            <div class="agreement col-center" v-if="current == '0'" @click="isAgreement = !isAgreement">
              <img class="icon" v-if="isAgreement" src="../../assets/imgs/icon_checked.png">
              <img class="icon" v-else src="../../assets/imgs/icon_not-checked.png">
              <span>我已阅读并接受<a class="link" href="#" @click="agreementVisible = true">《用户注册及隐私保护协议》</a>
              </span>
            </div>
          </el-form>

          <div class="login-submit row-center col-center" @click="submit" v-if="current == '0'">下一步</div>

          <div class="login-submit row-center col-center" @click="authentication" v-else>提交</div>
        </div>

      </div>
    </div>






    <!-- 注册协议 -->
    <el-dialog :visible.sync="agreementVisible" top="10vh" width="50%">
      <div class="rich-text ql-editor" v-html="agreementContent"></div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="agreementVisible = false">确 定</el-button>
      </span>
    </el-dialog>



  </div>
</template>
<script>
import { mapMutations } from "vuex";
import Api from "../../plugins/api";
export default {
  name: "RegisterPage",
  layout: "main",
  data() {
    return {
      fileList: [],
      isAgreement: false,
      current: 0,
      cityOptions: [],
      content: "",
      agreementVisible: false,
      agreementContent: '',
      registerByAccountForm: {

      },
      registerByAccountFormRules: {
        realname: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        passwd: [{ required: true, message: "请输入密码", trigger: "blur" }],
        mobile: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        sms: [{ required: true, message: "请输入验证码", trigger: "blur" }],


        company_name: [{ required: true, message: "请输入公司名称", trigger: "blur" }],
        province: [{ required: true, message: "请选择公司所在地", trigger: "blur" }],
        legal_person_name: [{ required: true, message: "请输入法人姓名", trigger: "blur" }],
        legal_person_mobile: [{ required: true, message: "请输入法人电话", trigger: "blur" }],
        social_credit_code: [{ required: true, message: "请输入统一社会信用代码", trigger: "blur" }],

      },
      activeIndex: 0,
      timer: null,
      seconds: 60,
    };
  },
  mounted() {
    this.getAgree();
    this.getAllRegion();
  },
  methods: {
    ...mapMutations(["setToken", "setUserInfo", "setWelfareToken"]),
    uploadBusinessLicense(file) {
      const fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1);
      const whiteList = [
        "pdf",
        "jpg",
        "jpeg",
        "png",
        "JPG",
        "JPEG",
        "PNG",
        "PDF",
      ];

      if (!whiteList.includes(fileSuffix)) {
        this.$message.error("上传文件只能是图片或pdf格式");
        return false;
      }

      const formData = new FormData();
      formData.append("business_license", file, file.name);
      const uploadConfig = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      this.$request
        .post(Api.uploadBusinessLicense, formData, uploadConfig)
        .then((res) => {
          if (res.code === 0) {
            const { business_license, business_license_url } = res.data;
            this.fileList = [{
              ...file,
              name: file.name,
              url: business_license_url,
              path: business_license
            }]
          }
        });
    },
    handlePreview(file) {
      window.open(file.url);
    },
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length
        } 个文件`
      );
    },
    clickTab(i) {
      this.activeIndex = i;
      this.$refs.registerByAccountForm.clearValidate();
    },
    getAllRegion() {
      this.$request.get(Api.selectAllRegion).then((res) => {
        if (res.code === 0) {
          this.cityOptions = res.data;
        }
      });
    },
    getAgree() {
      this.$request.get(Api.registerAgreement).then((res) => {
        if (res.code === 0) {
          this.agreeTitle = res.data.title;
          this.agreementContent = res.data.content;
        }
      });
    },
    getCode() {
      if (this.timer) return;
      this.$request
        .get(Api.userMobileCode, {
          params: { mobile: this.registerByAccountForm.mobile },
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
    // 第二部认证
    authentication() {
      this.$refs.registerByAccountForm.validate((valid) => {
        if (valid) {
          const [province_code, city_code, district_code] = this.registerByAccountForm.province;
          const params = {
            ...this.registerByAccountForm,
            province_code, city_code, district_code

          };
          if (this.fileList && this.fileList.length) {
            params.business_license = this.fileList[0].path;
          }


          this.$request.post(Api.registerCompany, params).then((res) => {
            if (res.code === 0) {
              this.setToken("");
              this.setWelfareToken("");
              this.$Cookies.remove("cloud_token");
              this.$router.push('/login')
              this.$message.success('注册成功，请重新登录')
            } else {
              this.$message({
                message: res.msg,
                type: "error",
              });
            }
          });

        }
      })
    },

    // 处理登录结果
    async loginRes(status, accessToken, welfare_token) {
      switch (status) {
        // 3 个人注册
        case 1:
        case 3:
        case 4:
        case 5:
        case 6:
          {
            // 正常登录，跳转到首页
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
            // this.$Cookies.set('userInfo', JSON.stringify(userInfo))

            this.$message.success("登录成功");
            if (this.$route.query.backPage) {
              this.$router.push(this.$route.query.backPage);
            }

            if (status == '6') {
              this.$router.push("/seller/companyAuthInfo");
            } else {
              this.$router.push("/");
            }


          }
          break;
        case 2: // 账号禁用，弹出提示
          this.$message.error("该账号已被禁用");
          break;
      }
    },

    // 第一步注册
    submit() {
      if (!this.isAgreement) return this.$message.warning('请先阅读并接受《用户注册及隐私保护协议》')
      this.$refs.registerByAccountForm.validate((valid) => {
        if (valid) {

          this.$request
            .post(Api.registerUser, {
              ...this.registerByAccountForm,
              user_id_type: 2,
            })
            .then((res) => {
              if (res.code === 0) {
                // 用户注册完成，保存token
                const accessToken = res.data.access_token;
                this.setToken(accessToken);
                this.$Cookies.set("cloud_token", accessToken);


                //  注册成功下一步认证信息
                this.current = 1;




              } else {
                this.$message({
                  message: res.msg,
                  type: "error",
                });
              }
            });
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
::v-deep {
  .el-upload {
    width: 100%;
  }
}

.form-title {
  text-align: center;

  font-weight: bold;
  font-size: 16px;
  color: #0A1833;
  line-height: 19px;

}

.required {
  position: relative;

  &::before {
    content: '*';
    position: absolute;
    left: -16px;
    top: 50%;
    transform: translateY(-50%);


    font-size: 14px;
    color: #FF4023;

  }
}

.agreement {
  cursor: pointer;
  font-size: 14px;
  color: #8993A5;
  line-height: 16px;

  .icon {
    margin-right: 10px;
  }

  a.link {
    color: #257FF8;
  }
}

.ql-editor {
  height: 70vh;
  overflow: auto;
}

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
    background: rgba(137, 147, 165, 0.06);
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
  overflow: auto;

  .login-submit {
    width: 382px;
    height: 54px;
    background: linear-gradient(90deg, #257FF8 0%, #0361E9 100%);
    box-shadow: 0px 4px 10px 0px rgba(37, 127, 248, 0.4);
    border-radius: 6px 6px 6px 6px;
    cursor: pointer;
    margin-top: 30px;
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

.tips {
  position: relative;

  &::after {
    content: '9-16位字符(字母、数字、符号)，区分大小写';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: -288px;
    font-size: 14px;
    color: #8993A5;
    line-height: 16px;

  }
}
</style>
