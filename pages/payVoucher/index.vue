<template>
  <div style="background: #fff">


    <div class="main">
      <div class="back-btn btn" @click="back"><i class="el-icon-arrow-left"></i> 返回</div>
      <div class="order-info">
        <div class="total-price item">
          <div class="label">应付金额：</div>
          <div class="value">￥{{ goods_amount }}</div>
        </div>
        <!-- <div class="pay-last-time item">
                    <div class="label">支付倒计时：</div>
                    <div class="value">12:33:50</div>
        </div>-->
        <div class="order-number item">
          <div class="label">订单编号：</div>
          <div class="value">{{ order_sn }}</div>
        </div>


      </div>

      <el-tabs type="border-card" style="width: 100%;">
        <el-tab-pane label="收款码支付">
          <div class="tab-content">
            <div class="upload-btn">
              <el-button size="small" type="primary" @click="aggregateVisible = true">上传支付凭证</el-button>
            </div>
            <p class="tips">
              注意：扫码支付后请点击付款详情将支付凭证截图上传
            </p>
            <el-image style="width:640px" src="https://img.hzyvip.com/images/QRCode.jpg"></el-image>
          </div>
        </el-tab-pane>
        <el-tab-pane label="线下支付">
          <div class="tab-content">
            <div class="upload-btn">
              <el-button size="small" type="primary" @click="upBtn">上传支付凭证</el-button>
            </div>
            <p class="tips">
              注意：转账后请将转账凭证截图上传
            </p>
            <div class="bank-card">
              <div class="card" v-for="(bank, i) in bankCardardList" :key="i">
                <div class="bank-name">{{ bank.bank_name }}</div>
                <div class="item">
                  <span>户名</span>
                  <span>{{ bank.account_name }}</span>
                </div>
                <div class="item">
                  <span>账号</span>
                  <span>{{ bank.account }}</span>
                </div>
                <div class="item">
                  <span>开户银行</span>
                  <span>{{ bank.bank_of_deposit }}</span>
                </div>
              </div>
              <div class="card-empty"></div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="其他方式">
          <div class="tab-content">




            <div class="payment bg-white">
              <div class="payment-footer">

                <div class="title lg weight-500">请选择支付方式</div>
                <div class="flex m-t-16">
                  <div class="pay-way flex row-center" v-for="(item, index) in payWayArr" :key="index"
                    @click="orderPay(item.pay_way)">
                    <img :src="item.image" alt="" />
                    <div class="m-l-16">
                      <span class="md">{{ item.short_name }}</span>
                      <div class="muted m-t-2 sm">{{ item.extra }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <el-dialog title="微信支付" :visible.sync="showWxpay" width="700px" center @close="clearTimer">
                <div class="flex-col col-center black">
                  <img class="pay-code" :src="payInfo" alt="" />
                  <div class="m-t-8" style="font-size: 18px">
                    微信扫一扫，完成支付
                  </div>
                  <!-- <div class="pay-money flex" style="display: none;">
                            <span>需支付金额：</span>
                            <span class="primary">
                                <price-formate :price="orderInfo.order_amount" :subscript-size="18" :first-size="28"
                                    :second-size="28" />
                            </span>
                        </div> -->
                </div>
              </el-dialog>
              <el-dialog title="支付宝" :visible.sync="showAlipay" width="700px" center @close="clearTimer">
                <div class="flex-col col-center black">
                  <img class="pay-code" :src="payInfo" alt="" />
                  <div class="m-t-8" style="font-size: 18px">
                    支付宝扫一扫，完成支付
                  </div>
                  <div class="pay-money flex">
                    <span>需支付金额：</span>
                    <span class="primary">
                      <price-formate :price="orderInfo.order_amount" :subscript-size="18" :first-size="28"
                        :second-size="28" />
                    </span>
                  </div>
                </div>
              </el-dialog>
            </div>





          </div>
        </el-tab-pane>
      </el-tabs>


    </div>






    <el-dialog title="上传支付凭证" top="25vh" :visible.sync="aggregateVisible" width="540px" class="pay-dialog" center>
      <el-form :model="payForm" :rules="payFormRules" ref="payForm" label-width="80px" class="demo-payForm">
        <el-form-item label="支付金额" prop="amount">
          <el-input v-model="payForm.amount"></el-input>
        </el-form-item>
        <el-form-item label="支付凭证" prop="image">
          <el-upload class="upload-demo" :auto-upload="false" action :on-change="uploadPayVoucher"
            :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" multiple :limit="5"
            :on-exceed="handleExceed" :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">可上传5张图片，文件大小不超过5M</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="cancel-btn" @click="paymentDialogClose">取 消</el-button>
        <el-button type="primary" class="save-btn" @click="submitPay('aggregate')">提 交</el-button>
      </div>
    </el-dialog>











    <el-dialog title="上传支付凭证" top="25vh" :visible.sync="PayVisible" width="540px" class="pay-dialog" center>
      <el-form :model="payForm" :rules="payFormRules" ref="payForm" label-width="80px" class="demo-payForm">
        <el-form-item label="收款银行" prop="bank_id">
          <el-select v-model="payForm.bank_id" placeholder="请选择收款银行" style="width: 100%">
            <el-option :label="bank.bank_name" :value="bank.id" v-for="(bank, i) in bankCardardList"
              :key="i"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付金额" prop="amount">
          <el-input v-model="payForm.amount"></el-input>
        </el-form-item>
        <el-form-item label="支付凭证" prop="image">
          <el-upload class="upload-demo" :auto-upload="false" action :on-change="uploadPayVoucher"
            :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" multiple :limit="5"
            :on-exceed="handleExceed" :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">可上传5张图片，文件大小不超过5M</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="cancel-btn" @click="paymentDialogClose">取 消</el-button>
        <el-button type="primary" class="save-btn" @click="submitPay">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import logoSrc from "@/assets/images/logo.png";
import Api from "@/plugins/api";

export default {
  name: "payVoucher",
  components: {},
  data() {
    return {
      orderInfo: {},
      payWayArr: [],
      logoSrc,
      PayVisible: false,
      aggregateVisible: false,
      bankCardardList: [],
      payForm: {
        order_id: "",
        bank_id: "",
        amount: "",
        image: [],
      },
      payInfo: {},
      order_sn: "",
      goods_amount: 0,
      payFormRules: {
        bank_id: [
          { required: true, message: "请选择收款银行", trigger: "blur" },
        ],
        amount: [
          { required: true, message: "请输入支付金额", trigger: "blur" },
        ],
        image: [{ required: true, message: "请上传支付凭证", trigger: "blur" }],
      },
      fileList: [],
      showWxpay: false,
      showAlipay: false,
      timer: null,
    };
  },
  mounted() {
    if (this.$route.query.order_id) {
      this.payForm.order_id = this.$route.query.order_id;
      this.order_sn = this.$route.query.order_sn;
      this.goods_amount = this.$route.query.goods_amount;
      console.log(this.$route.query, 'this.$route.query');
      this.orderInfo = {
        ...this.$route.query
      }
    }

    this.getBankCardList();
    this.getPayway();
  },
  methods: {
    createTimer() {
      if (this.timer) clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.getPayStatus();
      }, 2000);
    },
    orderPay(payWay) {
      this.$request.post(Api.getUnifiedPay, {
        order_id: this.orderInfo.order_id,
        pay_way: payWay,
        from: "order",
      }).then(res => {
        if (res.code == 1) {
          if (res.pay_way == 2) {
            this.payInfo = res.data;
            this.showWxpay = true;
            this.createTimer();
          } else if (res.pay_way == 3) {
            let divForm = document.getElementsByTagName("divform");
            if (divForm.length) {
              document.body.removeChild(divForm[0]);
            }
            const div = document.createElement("divform");
            div.innerHTML = res.data;
            document.body.appendChild(div);
            document.forms[0].submit();

          } else if (res.pay_way == 4) {
            console.log(1, '11');
          } else {
            this.$message({
              message: res.msg,
              type: "success",
            });
            this.getPayStatus();
          }
        }
      });

    },
    async getPayStatus() {
      this.$request.get(Api.getPayStatus, {
        params: {
          id: this.orderInfo.order_id,
          from: "order",
        },
      }).then(res => {
        if (res.code == 1) {
          if (res.data.pay_status == 1) {
            clearInterval(this.timer);
            if (this.showWxpay) {
              this.showWxpay = false;
            } else {
              this.showAlipay = false;
            }


            this.back();
          }
        }
      });
    },
    clearTimer() {
      clearInterval(this.timer);
    },
    //在线支付
    getPayway() {
      this.$request.get(Api.getPayWay, { params: { from: "order", order_id: this.$route.query.order_id }, }).then(res => {
        if (res.code == 1) {
          this.payWayArr = res.data.pay_way;
          if (!this.payWayArr.length)
            this.$message({
              message: "请配置支付方式",
              type: "error",
            });
        }
      });

    },
    upBtn() {
      this.PayVisible = true;
    },
    getBankCardList() {
      this.$request.get(Api.getBankCardList, { params: { company_id: -1 } }).then((res) => {
        if (res.code === 0) {
          this.bankCardardList = res.data;
        }
      });
    },
    uploadPayVoucher(file) {
      console.log(file);
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
        this.$message.error("上传凭证只能是图片或pdf格式");
        return false;
      }

      const formData = new FormData();
      formData.append("file", file.raw, file.name);
      formData.append("dir", "payVoucher");
      const uploadConfig = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      this.$request
        .post(Api.uploadImage, formData, uploadConfig)
        .then((res) => {
          if (res.code === 0) {
            const data = res.data;
            data.url = res.data.img_path;
            data.name = res.data.img;
            this.fileList.push(data);
          } else {
            this.fileList = [];
            this.$message({
              message: res.msg,
              type: "error",
            });
          }
        });
    },
    back() {
      history.back();
    },
    paymentDialogClose() {
      this.aggregateVisible = this.PayVisible = false;
      this.fileList = [];
      this.payForm = {
        order_id: "",
        bank_id: "",
        amount: "",
        image: [],
      }
    },
    /**
     * 
     * @param {* aggregate/default} type //默认线下支付    
     * 聚合支付/线下支付
     */
    submitPay(type = 'default') {
      this.payForm.image = this.fileList.map((item) => item.img);
      this.$refs.payForm.validate((valid) => {
        if (valid) {
          const data = JSON.parse(JSON.stringify(this.payForm));
          this.$request.post(Api.payVoucher, data).then((res) => {
            if (res.code === 0) {
              this.$router.push({
                path: "/payvoucher/result",
                query: {
                  order_id: this.payForm.order_id,
                },
              });
            }
          });
        }
      });
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList);
      this.fileList = fileList;
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length
        } 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
  },
};
</script>
<style scoped lang="less">
.btn {
  height: 28px;
  line-height: 28px;
  border-radius: 2px;
  text-align: center;
  border: 1px solid #d5d5d5;
  margin: 0 5px;
  cursor: pointer;
  padding: 0;
}

.back-btn {
  width: 64px;
  background: #ffffff;
  color: #656565;
}

.btn-group {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  .btn {
    height: 28px;
    line-height: 28px;
    border-radius: 2px;
    text-align: center;
    border: 1px solid #d5d5d5;
    margin: 0 5px;
    cursor: pointer;
    padding: 0;
  }

  .back-btn {
    width: 64px;
    background: #ffffff;
    color: #656565;
  }

  .cancel-order-btn {
    width: 76px;
    background: #ffffff;
    color: #656565;
  }

  .confirm-order-btn {
    width: 76px;
    background: #2277e8;
    border: 1px solid #2277e8;
    color: #fff;
  }

  .receive-order-btn {
    width: 76px;
    background: #ffffff;
    color: #656565;
  }
}

.page {
  margin: 10px auto 0;
  width: 300px;
  display: flex;
  justify-content: space-around;
  align-items: center;

  .page-btn {
    padding: 4px 12px;
    background: #ffffff;
    color: #656565;
    border: 1px solid #d5d5d5;
    font-size: 12px;
    text-align: center;
    cursor: pointer;
  }
}

.card {
  border: 1px solid #e3e5e9;
  margin-bottom: 12px;

  .header {
    height: 36px;
    padding: 0 16px;
    box-sizing: border-box;
    background: #eff4fb;
    border-radius: 2px 2px 0px 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    font-family: Microsoft YaHei, Microsoft YaHei-Bold;
    font-weight: 700;
    color: #353535;
  }

  .body {
    padding: 12px;
    box-sizing: border-box;
  }
}

.info-item {
  display: flex;
  // justify-content: space-between;
  flex-wrap: wrap;

  .item {
    width: 25%;
    font-size: 12px;
    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
    font-weight: 400;
    color: #656565;
    padding: 5px;
    box-sizing: border-box;
    display: flex;
    align-items: center;

    .label {
      color: #000;
      width: 65px;
      text-align: left;
    }
  }
}

:deep(.el-timeline-item) {
  margin-left: 150px;
}

:deep(.el-timeline-item__timestamp) {
  position: absolute;
  top: -6px;
  left: -150px;
}

:deep(.el-timeline-item__content) {
  font-size: 12px;
  color: #656565;
}

:deep(.table-header-style) {
  background: rgba(137,147,165,0.06);

  th {
    background: transparent;
    font-size: 12px;
    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
    font-weight: 400;
    color: #656565;
  }
}

:deep(.el-table .cell) {
  padding-left: 2px;
  padding-right: 2px;
}

:deep(.el-table .el-table__cell) {
  padding: 6px 0;
}

.pro-desc {
  display: flex;
  align-items: center;
  cursor: pointer;

  .pro-name {
    margin: 0 5px;
    font-size: 12px;
    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
    font-weight: 400;
    text-align: left;

    p:first-child {
      color: #353535;
      padding: 0;
    }

    p:last-child {
      color: #959595;
      padding: 0;
    }
  }
}

:deep(.el-input.is-disabled .el-input__inner) {
  color: #656565;
}

:deep(.el-radio__input.is-disabled+span.el-radio__label) {
  color: #656565;
}

.jcys-dialog {
  :deep(.el-dialog) {
    padding: 10px;
    background-color: #bbbbbbb7;
    border-radius: 10px;
    border-radius: 10px;
    overflow: hidden;
  }

  :deep(.el-dialog__header) {
    background-color: transparent;
    background: url('@/assets/images/supplydemand/dialog-header-bg.png') no-repeat;
    background-size: 100% 100%;
    font-size: 16px;
    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
    font-weight: 400;
    text-align: center;
    line-height: 48px;
    height: 48px;
    padding: 0;

    .el-dialog__title {
      color: #ffffff;
    }

    .el-dialog__headerbtn {
      top: 25px;
    }

    .el-dialog__headerbtn .el-dialog__close {
      color: #fff;
    }
  }

  :deep(.el-dialog__body) {
    background-color: #fff;
    padding-left: 60px;
    padding-right: 60px;

    .el-form-item__label {
      text-align: left;
    }
  }

  :deep(.el-dialog__footer) {
    background-color: #fff;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  :deep(.el-radio__label) {
    display: inline-block;
    width: 80px;
  }

  .el-upload__tip {
    margin: 0;
    line-height: 18px;
  }

  .dialog-footer {
    .cancel-btn {
      width: 88px;
      height: 32px;
      background: #ffffff;
      border: 1px solid #d5d5d5;
      border-radius: 2px;
      font-size: 14px;
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      font-weight: 400;
      text-align: center;
      color: #353535;
      line-height: 32px;
      padding: 0;
    }

    .save-btn {
      width: 88px;
      height: 32px;
      background: #2277e8;
      border: 1px solid #d5d5d5;
      border-radius: 2px;
      font-size: 14px;
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      font-weight: 400;
      text-align: center;
      color: #fff;
      line-height: 32px;
      padding: 0;
    }
  }
}

.price-info {
  padding: 10px;
  width: 250px;
  margin-left: 73%;
  color: #353535;

  .item {
    padding: 5px;
    display: flex;
    align-items: center;
    font-size: 12px;
    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
    font-weight: 400;
    text-align: right;
    color: #353535;

    .label {
      color: #000;
      text-align: right;
      width: 80px;
    }

    .value {
      text-align: right;
      flex: 1;
    }
  }
}


.heji-price {
  font-size: 14px;
  font-family: Microsoft YaHei, Microsoft YaHei-Bold;
  font-weight: 700;
  color: #e84b01;
}

.payment {
  margin: 16px 0;
  padding: 0 40px;

  .payment-hd {
    >img {
      width: 32px;
      height: 32px;
    }

    .status {
      font-size: 24px;
    }
  }

  .payment-con,
  .payment-hd {
    padding: 32px 0;
    border-bottom: 1px dashed #cccccc;
  }

  .payment-con {
    .item {
      align-items: flex-start;
    }
  }

  .payment-footer {
    padding: 32px 0;

    .pay-way {
      min-width: 200px;
      padding: 0 20px;
      height: 68px;
      cursor: pointer;
      margin-right: 32px;
      border: 1px dashed #cccccc;

      img {
        width: 30px;
        height: 30px;
      }
    }

    .btn {
      padding: 0;
      width: 134px;
      height: 40px;
      border: 1px solid #cccccc;
    }
  }

  .el-dialog {
    .pay-code {
      width: 270px;
      height: 270px;
    }

    .pay-money {
      font-size: 18px;
      margin-top: 24px;
      align-items: baseline;
    }
  }
}

.bg-white {
  background-color: #fff;
}

.flex {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.lg {
  font-size: 16px;
}

.weight-500 {
  font-weight: 500;
}

.m-t-16 {
  margin-top: 16px;
}

.row-center {
  justify-content: center;
}

.m-l-16 {
  margin-left: 16px;
}

.md {
  font-size: 15px;
}

.m-t-2 {
  margin-top: 2px;
}

.sm {
  font-size: 13px;
}

.muted {
  color: #999;
}

.el-dialog__wrapper {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  margin: 0;
}

.el-dialog--center {
  text-align: center;
}

.el-dialog {
  position: relative;
  margin: 0 auto 50px;
  margin-top: 0px;
  background: #fff;
  border-radius: 2px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, .3);
  box-sizing: border-box;
  width: 50%;
}

.el-dialog__header {
  padding: 20px 20px 10px;
}

.el-dialog__title {
  line-height: 24px;
  font-size: 16px;
  color: #333;
}

.el-dialog__headerbtn {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 0;
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  font-size: 16px;
}

.el-dialog__headerbtn .el-dialog__close {
  color: #909399;
}

[class*=" el-icon-"],
[class^="el-icon-"] {
  font-family: "element-icons" !important;
  speak: none;
  font-style: normal;
  font-weight: 400;
  font-feature-settings: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  vertical-align: baseline;
  display: inline-block;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.el-dialog--center .el-dialog__body {
  text-align: left;

  text-align: initial;

  padding: 25px 25px 30px;

}

.el-dialog__body {
  padding: 30px 20px;

  color: #666;

  font-size: 14px;

  word-break: break-all;

}

.col-center {
  align-items: center;
}

.flex-col {
  display: flex;
  flex-direction: column;
}

.black {
  color: #333;
}

.m-t-8 {
  margin-top: 8px;
}

.payment .el-dialog .pay-money {
  font-size: 18px;
  margin-top: 24px;
  align-items: baseline;
}

.primary {
  color: #ff2c3c;
}

.price-format {
  display: flex;
  align-items: baseline;
}

.tab-content {
  min-height: 520px;
  .tips {
    color: #f40;
    margin-top: 10px;
  }
}

.main {
  width: 1184px;
  margin: 0 auto;
  padding: 16px 16px 200px;

  .order-info {
    height: 54px;
    display: flex;
    align-items: center;
    margin: 20px 0;

    .item {
      display: flex;
      padding: 0 20px 0 0;

      .label {
        height: 30px;
        line-height: 30px;
        // width: 80px;
        padding: 0 5px;
        box-sizing: border-box;
        font-size: 14px;
        font-family: Microsoft YaHei, Microsoft YaHei-Regular;
        font-weight: 400;
        text-align: right;
        color: #656565;
      }

      .value {
        height: 30px;
        line-height: 30px;
        font-size: 14px;
      }
    }

    .total-price {
      .label {
        font-size: 18px;
        color: #656565;
      }

      .value {
        font-size: 28px;
        font-family: Roboto, Roboto-Bold;
        font-weight: 700;
        text-align: left;
        color: #e84b01;
      }
    }

    .pay-last-time {
      .value {
        font-family: Roboto, Roboto-Bold;
        font-weight: 700;
        color: #353535;
      }
    }

    .order-number {
      .value {
        font-family: Roboto, Roboto-Bold;
        font-weight: 500;
        color: #656565;
      }
    }


  }
}


.logo {
  width: 1184px;
  height: 120px;
  margin: 0 auto;
  background: #ffffff;
  display: flex;
  align-items: center;

  .desc {
    p {
      font-size: 14px;
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      font-weight: 400;
      color: #656565;
      padding: 0 5px;
    }
  }
}

.bank-card {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;

  .card-empty {
    width: 380px;
  }

  .card {
    width: 680px;
    // height: 190px;
    border: 1px solid #bec9d9;
    margin-top: 16px;
    // border-bottom: none;

    .bank-name {
      padding: 0 10px;
      box-sizing: border-box;
      height: 44px;
      line-height: 44px;
      background: #e9f0fa;
      border: 1px solid #e5e5e5;
      font-size: 16px;
      font-weight: 700;
      text-align: left;
      color: #353535;
    }

    .item {
      height: 44px;
      line-height: 44px;
      border-bottom: 1px solid #e5e5e5;
      font-size: 14px;
      font-weight: 400;
      text-align: left;
      color: #353535;

      span:first-child {
        width: 140px;
      }

      span {
        display: inline-block;
        padding: 0 10px;
      }
    }
  }
}

.price {
  font-size: 28px;
  font-family: Roboto, Roboto-Bold;
  font-weight: 700;
  text-align: center;
  color: #e84b01;
  margin: 10px;
}

.pay-dialog {
  :deep(.el-dialog) {
    padding: 10px;
    background-color: #bbbbbbb7;
    border-radius: 10px;
    border-radius: 10px;
    overflow: hidden;
  }

  :deep(.el-dialog__header) {
    background-color: transparent;
    background: url("@/assets/images/supplydemand/dialog-header-bg.png") no-repeat;
    background-size: 100% 100%;
    font-size: 16px;
    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
    font-weight: 400;
    text-align: center;
    line-height: 48px;
    height: 48px;
    padding: 0;

    .el-dialog__title {
      color: #ffffff;
    }

    .el-dialog__headerbtn {
      top: 10px;
    }

    .el-dialog__headerbtn .el-dialog__close {
      color: #fff;
    }
  }

  :deep(.el-dialog__body) {
    background-color: #fff;
    padding-left: 60px;
    padding-right: 60px;

    .el-form-item__label {
      text-align: left;
    }
  }

  :deep(.el-dialog__footer) {
    background-color: #fff;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  :deep(.el-radio__label) {
    display: inline-block;
    width: 80px;
  }

  .el-upload__tip {
    margin: 0;
    line-height: 18px;
  }

  .dialog-footer {
    .cancel-btn {
      width: 88px;
      height: 32px;
      background: #ffffff;
      border: 1px solid #d5d5d5;
      border-radius: 2px;
      font-size: 14px;
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      font-weight: 400;
      text-align: center;
      color: #353535;
      line-height: 32px;
      padding: 0;
    }

    .save-btn {
      width: 88px;
      height: 32px;
      background: #2277e8;
      border: 1px solid #d5d5d5;
      border-radius: 2px;
      font-size: 14px;
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      font-weight: 400;
      text-align: center;
      color: #fff;
      line-height: 32px;
      padding: 0;
    }
  }
}
</style>
