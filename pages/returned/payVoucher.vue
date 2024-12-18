<template>
  <div style="background: #fff">
    <div class="logo">
      <svg-icon icon-class="logo" class="svg-logo" />
    </div>

    <div class="main">
      <div class="back-btn btn" @click="back">
        <i class="el-icon-arrow-left"></i> 返回
      </div>
      <div class="order-info">
        <div class="total-price item">
          <div class="label">应付金额：</div>
          <div class="value">
            ￥{{ (Number(orderInfo.money) / 100).toFixed(2) }}
          </div>
        </div>
        <div class="order-number item">
          <div class="label">订单编号：</div>
          <div class="value">{{ orderInfo.order_sn }}</div>
        </div>
      </div>

      <el-tabs type="border-card" style="width: 100%">
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
              <el-button size="small" type="primary" @click="showPayOrderDialog">上传支付凭证</el-button>
            </div>
            <p class="tips">
              注意：转账后请将转账凭证截图上传
            </p>
            <el-descriptions :column="1" size="medium" border title="收款账户如下：">
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-office-building"></i>
                  收款银行
                </template>
                {{ orderInfo.bank }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-user-solid"></i>
                  户名
                </template>
                {{ orderInfo.account_name }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-tickets"></i>
                  账号
                </template>
                {{ orderInfo.account }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-postcard"></i>
                  开户银行
                </template>
                {{ orderInfo.bank_deposit }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </el-tab-pane>
        <el-tab-pane label="结算支付">
          <div class="tab-content">
            <template v-if="settlement.order_amount >= orderInfo.money">
              <div class="tips" >
              当前可用结算金额为
              <span class="amount">{{
                (Number(settlement.order_amount) / 100).toFixed(2)
              }}</span>元
            </div>
            <div class="tips">确认进行支付？</div>
            <el-row class="row">
              <el-button size="small" class="btn" @click="back">取消</el-button>
              <el-button size="small" class="btn" type="primary" @click="submit">确认</el-button>
            </el-row>
            </template>




            <template v-else>
              <div class="tips" >
              当前可用结算金额为
              <span class="amount">{{
                (Number(settlement.order_amount) / 100).toFixed(2)
              }}</span>元
            </div>
            <div class="tips">
不可进行结算支付</div>
          </template>


          </div>

        </el-tab-pane>
      </el-tabs>
    </div>


    

    <PayOrderDialog :info="orderInfo" :visible.sync="payOrderDialogVisible" @success="back" />


    <PayOrderDialog :info="orderInfo" type="aggregate" :visible.sync="aggregateVisible" @success="back" />
  </div>
</template>
<script>
import PayOrderDialog from "@/pages/returned/PayOrderDialog";

export default {
  name: "payVoucher",
  components: {
    PayOrderDialog
  },
  data() {
    return {
      aggregateVisible:false,
      payOrderDialogVisible: false,
      orderInfo: {},
      order_sn: "",
      goods_amount: 0,
      settlement: {
        order_amount: 0,
        settlement_amount: 0,
      },
    };
  },
  mounted() {
    console.log(this.$route);
    this.getData(this.$route.query.id);
  },
  methods: {
    submit() {

      this.$request
        .post("/order.afterSale/sellerRefundBySettlement", {

          id:this.orderInfo.id

        })
        .then((res) => {
          if (res.code == "0") {
            this.$message.success(res.msg);
            this.back();
          }
        });

    },
    getData(id) {
      this.$request
        .get("/order.afterSale/info", {
          params: {
            id,
          },
        })
        .then((res) => {
          if (res.code == "0") {
            this.orderInfo = res.data;
          } else {
            this.$message.error(res.msg);
          }
        });

      this.$request
        .get("/settlement/count", {
          params: {
            id,
          },
        })
        .then((res) => {
          if (res.code == "0") {
            this.settlement = res.data;
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    showPayOrderDialog() {
      this.payOrderDialogVisible = true;
    },
    back() {
      history.back();
    },
  },
};
</script>
<style scoped lang="less">
.row {
  padding: 20px;

  .btn {
    width: 100px;
    height: auto;
    margin: auto;
    padding: auto;
    margin-right: 8px;
    outline: none;
  }
}

.tips {
  font-size: 18px;
  margin: 20px;

  .amount {
    color: #f40;
    font-size: 20px;
    font-weight: bold;
  }
}

.upload-btn {
 
}

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

:deep(.el-radio__input.is-disabled + span.el-radio__label) {
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
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
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
    font-size: 15px;
    margin: 14px 0;
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
    width: 380px;
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
        width: 60px;
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
</style>
