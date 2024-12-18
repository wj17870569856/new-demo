<template>
  <!-- 录入发货信息 -->
  <el-dialog
    title="录入发货信息"
    :visible="visible"
    width="760px"
    class="jcys-dialog"
    @close="close"
    center
  >
    <el-form
      :model="DoShippingForm"
      :rules="DoShippingFormRules"
      ref="DoShippingForm"
      label-width="80px"
      class="demo-DoShippingForm"
    >
      <el-form-item label="车牌号" prop="car_no">
        <el-input v-model="DoShippingForm.car_no"></el-input>
      </el-form-item>
      <el-form-item label="发货数量" prop="number">
        <el-input
          type="number"
          v-model="DoShippingForm.number"
          @input="inputShippingNumber"
        ></el-input>
      </el-form-item>
      <el-form-item label="发货凭证" prop="image">
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
      <el-form-item label="收货地址" prop="address">
        <el-cascader
          v-model="DoShippingForm.province"
          placeholder="请选择"
          size="large"
          style="width: 100%"
          :options="cityOptions"
          :props="cityProps"
        ></el-cascader>
        <el-input
          style="margin-top: 10px"
          v-model="DoShippingForm.address"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button class="cancel-btn" @click="close">取 消</el-button>
      <el-button type="primary" class="save-btn" @click="submit"
        >提 交</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import Api from "@/plugins/api";
export default {
  data() {
    return {
      cityOptions: [],
      cityProps: {
        label: "name",
        value: "citycode",
      },
      fileList: [],
      DoShippingForm: {},
      DoShippingFormRules: {
        address: [
          {
            required: true,
            trigger: ["change", "blur"],
            validator: (rule, value, callback) => {
              const province = this.DoShippingForm.province;
              const address = this.DoShippingForm.address;
              if (!province) {
                callback(new Error("请选择收货地址"));
              } else if (!address) {
                callback(new Error("请填写详细地址"));
              } else {
                callback();
              }
            },
          },
        ],
        number: [
          {
            required: true,
            message: "请输入数量",
            trigger: ["change", "blur"],
          },
        ],
        car_no: [
          {
            required: true,
            message: "请输入车牌号",
            trigger: ["change", "blur"],
          },
        ],
        image: [
          {
            required: true,
            message: "请上传发货凭证",
            trigger: ["change", "blur"],
            validator: (rule, value, callback) => {
              if (this.fileList.length > 0) {
                callback();
              } else {
                callback(new Error(rule.message));
              }
            },
          },
        ],
      },
    };
  },
  mounted() {
    this.getCityRegion();
  },
  methods: {
    inputShippingNumber(value) {
      this.DoShippingForm.number =
        value
          .replace(/\D*(\d*)(\.?)(\d{0,3})\d*/, "$1$2$3") // 只能输入数字、小数点限制3位
          .replace(/^0+(\d)/, "$1") // 第一位0开头，0后面为数字，则过滤掉，取后面的数字
          .replace(/^\./, "0.") // 如果输入的第一位为小数点，则替换成 0. 实现自动补全
          .match(/^\d*(\.?\d{0,3})/g)[0] || ""; // 数字开头、小数点3位
    },
    getCityRegion() {
      return this.$request
        .get(Api.getCity, { params: { level: 3 } })
        .then((res) => {
          console.log(res);
          if (res.code === 0) {
            this.cityOptions = res.data;
          }
        });
    },
    submit() {
      this.$refs["DoShippingForm"].validate((valid) => {
        if (valid) {
            const {car_no,number,province,address} = this.DoShippingForm;
          this.$emit("submit",{
            pics:this.fileList.map((item) => item.path).join(','),
            car_no,number,address,
            province_code:province[0],
            city_code:province[1],
            district_code:province[2],
          });
          this.close();
        }
      });
    },
    close() {
      this.DoShippingForm = {};
      this.fileList = [];
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
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="less" scoped>
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
    background: url("@/assets/images/supplydemand/dialog-header-bg.png")
      no-repeat;
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
