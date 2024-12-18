<template>
  <el-drawer title="申请退款售后" :visible="visible" @open="open" @close="close" size="600px" :wrapperClosable="false">
    <div class="content">
      <el-form label-width="140px" :model="formData" ref="ruleForm">
        <el-form-item label="退款商品：" prop="sku_id">
          {{ formData.goods_name }}
        </el-form-item>

        <el-form-item label="申请类型：" prop="type">
          {{ formData.type_name }}
        </el-form-item>
        <el-form-item label="收款账户：" prop="bank">
          <el-descriptions :column="1" size="medium" border>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-office-building"></i>
                收款银行
              </template>
              {{ formData.bank }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-user-solid"></i>
                户名
              </template>
              {{ formData.account_name }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-tickets"></i>
                账号
              </template>
              {{ formData.account }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-postcard"></i>
                开户银行
              </template>
              {{ formData.bank_deposit }}
            </el-descriptions-item>
          </el-descriptions>
        </el-form-item>

        <el-form-item label="申请原因：" prop="reason_id">
          {{ formData.refund_reason.title }}
        </el-form-item>

        <el-form-item label="退货数量：" prop="number">
          {{ formData.number + formData.unit_name }}
          <span class="tips">
            （本次可申请<span style="font-size: 16px; font-weight: bolder; color: #f40">{{
              Number(formData.support_refund_number)
            }}{{ formData.unit_name }}</span>)
          </span>
       
        </el-form-item>

        <el-form-item label="申请金额：" prop="money">
          ¥{{ (Number(formData.money) / 100).toFixed(2) }}
        </el-form-item>

        <el-form-item label="申请说明：">
          {{ formData.explain }}
        </el-form-item>

        <el-form-item label="上传图片：">
          <div class="img">
            <el-image v-for="(item, index) in formData.pics_url" :key="index"
              style="width: 140px; height: 140px; margin: 6px" :src="item" :preview-src-list="[item]">
            </el-image>
          </div>
        </el-form-item>

        <el-form-item label="联系电话：">
          {{ formData.tel }}
        </el-form-item>
      </el-form>
      <el-row class="row text-r">

        <el-button @click="refuse" type="info">拒绝</el-button>


        <el-popconfirm title="确定同意该退款申请吗？" @confirm="submit">
          <el-button type="primary" slot="reference">确认</el-button>
        </el-popconfirm>
      </el-row>










      <el-dialog title="请填写拒绝退款原因" :modal="false" :visible="rejectDialogVisible" @close="rejectDialogClose" width="400px"
        center>
        <el-input type="textarea" placeholder="请输入" :rows="4" v-model="rejectReasonMsg"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="rejectDialogClose">取 消</el-button>
          <el-button type="primary" @click="rejectDialogSubmit">确认拒绝</el-button>
        </span>
      </el-dialog>




    </div>
  </el-drawer>
</template>

<script>
export default {
  name: "afterPrevView",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    info: {
      type: Object,
      default: () => { },
    },
  },
  watch: {
    "formData.sku_id"(val) {
      if (val) {
        this.getData(val);
      }
    },
  },
  data() {
    return {
      rejectDialogVisible: false,
      maxNumber: 99,
      fileList: [],
      reason: [],
      rejectReasonMsg: "",//拒绝原因
      unit_name: "",
      bankList: [],
      formData: {
        number: 1,
        goods_id: "",
        type: "",
        reason_id: "",
        money: "",
        bank: "",
        bank_deposit: "",
        account_name: "",
        account: "",
        tel: "",
        explain: "",
        refund_reason: {},
        pics_url: [],
      },
      bankSelected: {},
    };
  },
  methods: {
    rejectDialogClose() {
      this.rejectReasonMsg = "";
      this.rejectDialogVisible = false;
    },
    rejectDialogSubmit() {
            this.$request
        .get("/order.afterSale/sellerRefuse", {
          params: {
            id: this.info.id,
      msg: this.rejectReasonMsg
          },
        })
        .then((res) => {
          if (res.code == "0") {
            this.$emit("reload");
            this.$message.success(res.msg);
            this.close();
          } else {
            this.close();
            this.$message.error(res.msg);
          }
        });
    },
    refuse() {
      this.rejectDialogVisible = true;

    },
    submit() {
      this.$request
        .get("/order.afterSale/sellerConfirm", {
          params: {
            id: this.info.id,
          },
        })
        .then((res) => {
          if (res.code == "0") {
            this.$emit("reload");
            this.$message.success(res.msg);
            this.close();
          } else {
            this.close();
            this.$message.error(res.msg);
          }
        });
    },
    getData() {
      this.$request
        .get("/order.afterSale/info", {
          params: {
            id: this.info.id,
          },
        })
        .then((res) => {
          if (res.code == "0") {
            this.formData = res.data;
          } else {
            this.close();
            this.$message.error(res.msg);
          }
        });
    },
    open() {
      this.getData();
    },
    close() {
      this.rejectDialogVisible = false;
      this.rejectReasonMsg = "";
      this.$emit("update:visible", false);
    },
  },
};
</script>

<style scoped lang="less">
.text-r {
  text-align: right;
}

.img-desc {
  color: #ccc;
  font-size: 12px;
}

.tips {
  margin-right: 6px;
}

.content {
  padding: 20px 20px 40px 0;
  font-size: 15px;
  color: #666;
}

::v-deep .el-radio {
  margin-right: 0;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
</style>
