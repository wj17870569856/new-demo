<template>
  <div class="result-page">
    <div class="content">
      <div class="message">
        <img :src="successSrc" class="success-img" fit="fill" />
        <div class="success-text">提交成功</div>
        <div class="wait-text">等待店铺确认实际费用，请稍候!</div>
      </div>
      <div>
        <div class="cancel-btn" @click="gotoPurchaseorder">返回采购单</div>
        <div class="confirm-btn" @click="gotoMyOrder">查看我的订单</div>
      </div>
    </div>
  </div>
</template>
<script>
// import { mapMutations } from 'vuex'
// import Api from '../../plugins/api'
import logoSrc from "@/assets/images/logo.png";
import successSrc from "@/assets/images/purchaseOrder/order-success.png";

export default {
  name: "resultOrder",
  layout:'hall',
  middleware: "auth",
  data() {
    return {
      logoSrc,
      successSrc,
    };
  },
  computed: {},
  methods: {
    gotoPurchaseorder() {
      this.$router.push("/purchaseorder");
    },
    gotoMyOrder() {
      this.$router.push("/personalCenter/buyerList");
    },
  },
};
</script>
<style lang="less" scoped>
.result-page {
  background: #ffffff;
  padding: 150px 50px 50px;
  min-height: 850px;
  box-sizing: border-box;
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

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 50px;
    .message {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .success-img {
      width: 120px;
      height: 120px;
    }

    .success-text {
      font-size: 16px;
      font-family: Microsoft YaHei, Microsoft YaHei-Bold;
      font-weight: 700;
      text-align: center;
      color: #1dbe68;
      margin: 10px;
    }

    .wait-text {
      font-size: 12px;
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      font-weight: 400;
      text-align: center;
      color: #353535;
      line-height: 18px;
      margin-bottom: 50px;
    }

    .cancel-btn,
    .confirm-btn {
      padding: 10px 30px;
    }
  }
}
</style>
