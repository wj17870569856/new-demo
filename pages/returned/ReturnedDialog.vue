<template>
  <el-drawer
    title="申请退款售后"
    :visible="visible"
    @open="open"
    @close="close"
    size="600px"
    :wrapperClosable="false"
  >
    <div class="content">
      <el-form
        label-width="140px"
        :model="formData"
        :rules="rules"
        ref="ruleForm"
      >
        <el-form-item label="退款商品：" prop="sku_id">
          <el-select v-model="formData.sku_id">
            <el-option
              v-for="item in info.order_goods"
              :key="item.sku_id"
              :label="item.goods_name"
              :value="item.sku_id"
            ></el-option>
          </el-select>
        </el-form-item>
        <template v-if="formData.sku_id">
          <el-form-item label="申请类型：" prop="type">
            <el-radio-group v-model="formData.type" size="small">
              <el-radio label="1" border>仅退款</el-radio>
              <el-radio label="2" border>退货退款</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="收款账户：" prop="bank">
            <el-descriptions :column="1" size="medium" border>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-office-building"></i>
                  收款银行
                </template>
                <el-input
                  size="mini"
                  v-model="formData.bank"
                  placeholder="请输入"
                ></el-input>
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-user-solid"></i>
                  户名
                </template>
                <el-input
                  size="mini"
                  v-model="formData.account_name"
                  placeholder="请输入"
                ></el-input>
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-tickets"></i>
                  账号
                </template>
                <el-input
                  size="mini"
                  v-model="formData.account"
                  placeholder="请输入"
                ></el-input>
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-postcard"></i>
                  开户银行
                </template>
                <el-input
                  size="mini"
                  v-model="formData.bank_deposit"
                  placeholder="请输入"
                ></el-input>
              </el-descriptions-item>
            </el-descriptions>
          </el-form-item>

          <el-form-item label="申请原因：" prop="reason_id">
            <el-select v-model="formData.reason_id">
              <el-option
                v-for="item in reason"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="退货数量：" prop="number" v-if="formData.type == '2'">
            <span class="tips">
              （本次可申请<span
                style="font-size: 16px; font-weight: bolder; color: #f40"
                >{{ maxNumber }}{{ unit_name }}</span
              >)
            </span>
            <el-input-number
              v-model="formData.number"
              :precision="3"
              :step="1"
              :min="1"
              :max="maxNumber"
            ></el-input-number>
          </el-form-item>

          <el-form-item label="申请金额：" prop="money">
            <el-input type="number" v-model="formData.money">
              <template slot="prepend">¥</template>
            </el-input>
          </el-form-item>
        </template>

        <el-form-item label="申请说明：">
          <el-input
            type="textarea"
            placeholder="请输入"
            v-model="formData.explain"
            :rows="4"
            :max="200"
          >
          </el-input>
        </el-form-item>

        <el-form-item label="上传图片：">
          <div class="img">
            <el-upload
              list-type="picture-card"
              action=""
              :auto-upload="false"
              :file-list="fileList"
              class="avatar-uploader"
              :on-change="chooseImage"
              :limit="5"
              :on-exceed="exceedImage"
              :on-remove="handleRemove"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <div class="img-desc">
              最多上传5张图片，建议尺寸为360px*360px，单张图片大小不超过10M
            </div>
          </div>
        </el-form-item>

        <el-form-item label="联系电话：">
          <el-input placeholder="请输入" v-model="formData.tel"> </el-input>
        </el-form-item>
      </el-form>
      <el-row class="row text-r">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </el-row>
    </div>
  </el-drawer>
</template>

<script>
import utils from "@/utils";
import Api from "@/plugins/api";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    info: {
      type: Object,
      default: () => {},
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
      rules: {
        bank: [
          {
            required: true,
            message: "收款账户信息不能为空",
            trigger: ["change", "blur"],
            validator: (rule, value, callback) => {
              const {bank,bank_deposit,account_name,account} = this.formData;
              if (!bank || !bank_deposit || !account_name || !account) {
                callback(new Error(rule.message));
              } else {
               
                callback();
              }
            },
          },
        ],
        sku_id: [
          {
            required: true,
            message: "请选择申请类型",
            trigger: ["change", "blur"],
          },
        ],
        type: [
          {
            required: true,
            message: "请选择申请类型",
            trigger: ["change", "blur"],
          },
        ],
        reason_id: [
          {
            required: true,
            message: "请选择申请原因",
            trigger: ["change", "blur"],
          },
        ],
        number: [
          {
            required: true,
            message: "请输入退货数量",
            trigger: ["change", "blur"],
          },
        ],
        money: [
          {
            required: true,
            message: "请输入退款金额",
            trigger: ["change", "blur"],
          },
        ],
      },
      maxNumber: 99,
      fileList: [],
      reason: [],
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
      },
      bankSelected: {},
    };
  },
  methods: {
    submit() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          
          let d = {
            ...this.formData,
            order_id: this.info.id,
          }
          if(this.fileList.length) {
            d.pics = this.fileList.map((item) => item.path).join(',');
          }
          // 仅退款数量传0
          if(d.type == '1') {
            d.number = 0;
          }
          this.$request.post(Api.afterSaleSubmit, d).then((res) => {
            if(res.code == '0') {
              this.$emit('reload')
              this.$message.success(res.msg);
              this.close();
            }else {
              this.$message.error(res.msg);
            }
          })
        }
      });
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
    getData(sku_id) {
      this.$request
        .get(Api.afterSalePreOrder, {
          params: {
            order_id: this.info.id,
            sku_id,
          },
        })
        .then((res) => {
          if (res.code === 0) {
            const {
              order_bank,
              refund_reason_list,
              support_refund_number,
              support_refund_money,
              tel,
              types,
              sku_id,
              unit_name,
            } = res.data;

            this.formData = {
              number: Number(support_refund_number),
              money: Number(
                utils.performOperation("divide", support_refund_money, 100)
              ).toFixed(2),
              bank: order_bank.bank_name,
              bank_deposit: order_bank.bank_of_deposit,
              account_name: order_bank.account_name,
              account: order_bank.account,
              tel,
              sku_id: Number(sku_id),
            };
            this.types = types;
            this.reason = refund_reason_list;
            this.maxNumber = Number(support_refund_number);
            this.unit_name = unit_name;
          }
        });
    },
    open() {},
    close() {
      this.fileList = [];
      this.formData = {};
      this.$refs['ruleForm'].resetFields();
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
}
::v-deep .el-radio {
  margin-right: 0;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
</style>
