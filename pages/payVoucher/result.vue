<template>
  <div style="background: #fff">
    <div class="main">
      <el-image
        v-if="result === 1"
        style="width: 120px; height: 120px"
        :src="pay_success"
        fit="fill"
      ></el-image>
      <el-image
        v-else
        style="width: 120px; height: 120px"
        :src="pay_failed"
        fit="fill"
      ></el-image>
      <div v-if="result === 1" class="success-text">订单支付成功</div>
      <div v-else class="failed-text">订单支付失败</div>
      <div class="btn-group">
        <div class="btn" @click="gotoPage()">返回首页</div>
        <div v-if="result === 1" class="view-btn" @click="viewOrderDetails">
          查看订单详情
        </div>
        <div v-else class="repay-btn" @click="rePay">重新支付</div>
      </div>
    </div>
  </div>
</template>
<script>
import logoSrc from "@/assets/images/logo.png";
import pay_success from "@/assets/images/pay/pay_success.png";
import pay_failed from "@/assets/images/pay/pay_failed.png";

export default {
  name: "PayResult",
  components: {},
  data() {
    return {
      logoSrc,
      pay_failed,
      pay_success,
      order_id: "",
      result: 1,
    };
  },
  mounted() {
    if (this.$route.query.order_id) {
      this.order_id = this.$route.query.order_id;
    }
  },
  methods: {
    rePay() {
      this.$router.back();
    },
    viewOrderDetails() {
      this.$router.push({
        path: "/personalCenter/buyerList",
        query: {
          order_id: this.order_id,
        },
      });
    },
    gotoPage() {
      this.$router.push({
        path: "/",
      });
    },
  },
};
</script>
<style scoped lang="less">
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

.main {
  width: 1184px;
  margin: 0 auto;
  padding: 16px 16px 200px;
  text-align: center;

  .success-text,
  .failed-text {
    width: 120px;
    margin: 0 auto;
    font-size: 16px;
    font-family: Microsoft YaHei, Microsoft YaHei-Bold;
    font-weight: 700;
    text-align: center;
    color: #1dbe68;
  }

  .failed-text {
    color: #e84b01;
  }

  .btn-group {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 70px;

    .btn {
      width: 120px;
      height: 40px;
      background: rgba(137, 147, 165, 0.06);
      border: 1px solid #d5d5d5;
      border-radius: 2px;
      font-size: 14px;
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      font-weight: 400;
      text-align: center;
      color: #353535;
      line-height: 40px;
      margin: 10px 5px;
      cursor: pointer;
      padding: 0;
    }

    .repay-btn {
      width: 120px;
      height: 40px;
      background: #e84b01;
      border: 1px solid #e84b01;
      border-radius: 2px;
      font-size: 14px;
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      font-weight: 400;
      text-align: center;
      color: #ffffff;
      line-height: 40px;
      margin: 10px 5px;
      cursor: pointer;
    }

    .view-btn {
      width: 120px;
      height: 40px;
      background: #2263e8;
      border: 1px solid #2263e8;
      border-radius: 2px;
      font-size: 14px;
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      font-weight: 400;
      text-align: center;
      color: #ffffff;
      line-height: 40px;
      margin: 10px 5px;
      cursor: pointer;
    }
  }
}
</style>
