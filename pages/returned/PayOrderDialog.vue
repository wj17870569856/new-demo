<template>
  <div class="payOrder">
    <el-dialog title="上传支付凭证" :visible="visible" width="600px" class="pay-dialog" center @close="close">
      <el-form :model="payForm" :rules="payFormRules" ref="payForm" label-width="110px" class="demo-payForm">
        <el-form-item label="收款账户："  required v-if="type === 'default'">
          <el-descriptions :column="1" size="medium" border >
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-office-building"></i>
                收款银行
              </template>
              {{ info.bank }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-user-solid"></i>
                户名
              </template>
              {{ info.account_name }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-tickets"></i>
                账号
              </template>
              {{ info.account }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-postcard"></i>
                开户银行
              </template>
              {{ info.bank_deposit }}
            </el-descriptions-item>
          </el-descriptions>
        </el-form-item>
        <el-form-item label="支付金额" prop="money">
          <el-input type="number" v-model="payForm.money"></el-input>
        </el-form-item>
        <el-form-item label="支付凭证" prop="image">
          <div class="img">
            <el-upload list-type="picture-card" action="" :auto-upload="false" :file-list="fileList"
              class="avatar-uploader" :on-change="chooseImage" :limit="5" :on-exceed="exceedImage"
              :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
            <div class="img-desc">
              最多上传5张图片，建议尺寸为360px*360px，单张图片大小不超过10M
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="cancel-btn" @click="close">取 消</el-button>
        <el-button type="primary" class="save-btn" @click="submitPay">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Api from "@/plugins/api";
export default {
  props: {
    info: {
      type: Object,
      default: () => { },
    },
    type:{
      type:String,
      default:"default"
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    submitPay() { 
      this.$refs['payForm'].validate((valid) => {
        if(valid) {
          let d = {
            id:this.info.id,
            ...this.payForm,
            pics:this.fileList.map((item) => item.path).join(',')
          }


          this.$request.post('/order.afterSale/sellerRefundByVoucher', d).then((res) => {
            if(res.code == '0') {
              this.$emit('success')
              this.$message.success(res.msg);
              this.close();
            }else {
              this.$message.error(res.msg);
            }
          })
        }
      })

    },
    close() {
      this.fileList = [];
      this.payForm = {};
      this.$emit("update:visible", false);
    },
    handleRemove(file, fileList) {
      let i = fileList.findIndex((item) => item.uid === file.uid);
      this.fileList.splice(i, 1);
    },
    exceedImage(files, fileList) {
      if (fileList.length === 5) {
        this.$message.warning("最多上传5个文件");
      }
    },
    async chooseImage(file, fileList) {
      const fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1);
      const whiteList = ["jpg", "png", "jpeg", "JPG", "JPEG", "PNG"];

      if (!whiteList.includes(fileSuffix)) {
        fileList.pop();
        this.$message.error("仅支持jpg，png，jpeg图片");
        return false;
      }
      const isLt15M = file.size / 1024 / 1024 <= 10;
      if (!isLt15M) {
        fileList.pop();
        return this.$message.error("上传文件大小不能超过 10MB!");
      }
      // FormData 对象
      const formData = new FormData();
      // 文件对象
      formData.append("file", file.raw);
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: this.token,
        },
      };
      const res = await this.$request.post(Api.uploadFile, formData, config);
      if (res.success) {
        const { data } = res;
        this.fileList.push({
          url: data.fileUrl,
          path: data.filePath,
          name: data.fileName,
        });
      } else {
        this.$message.error(res.msg);
      }
    },
  },
  data() {
    return {
      orderInfo: {},
      fileList: [],
      payForm: {},
      payFormRules: {
        money: [
          {
            required: true,
            message: "请输入支付金额",
            trigger: ["change", "blur"],
          },
        ],
        image: [
          {
            required: true,
            message: "请上传支付凭证",
            trigger: ["change", "blur"],
            validator: (rule, value, callback) => {
              const fileList = this.fileList;
              if (fileList.length > 0) {
                callback();
              } else {
                callback(new Error(rule.message));
              }
            },
          },
        ]
      },
    };
  },
};
</script>

<style lang="less" scoped>
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
