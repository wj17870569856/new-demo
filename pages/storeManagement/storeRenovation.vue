<template>
  <div class="storerenovation-page">
    <div class="title">店铺装修</div>
    <div>
      <el-form
        ref="storeForm"
        :model="storeForm"
        label-width="100px"
        class="demo-storeForm"
        style="width: 600px"
      >
        <el-form-item label="公司logo" prop="logo">
          <el-upload
            action
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemoveLogo"
            :limit="1"
            :file-list="logoFileList"
            :on-change="uploadLogo"
            accept=".pdf, .jpg, .jpeg, .png, .JPG, .JPEG, .PNG, .PDF"
            :class="{ 'disabled-hidden': logoFileList.length != 0 }"
            :on-exceed="handleAdvImageExceed"
            :auto-upload="false"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="实景图片" prop="real">
          <el-upload
            action
            list-type="picture-card"
            :file-list="realFileList"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemoveReal"
            accept=".pdf, .jpg, .jpeg, .png, .JPG, .JPEG, .PNG, .PDF"
            :on-change="uploadReal"
            :limit="5"
            :on-exceed="handleRealImageExceed"
            :auto-upload="false"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="公司介绍" prop="company_introduction">
          <el-input
            v-model="storeForm.company_introduction"
            type="textarea"
            :autosize="{ minRows: 8, maxRows: 18 }"
          ></el-input>
        </el-form-item>
        <el-form-item label="主营产品" prop="main_product">
          <el-input
            v-model="storeForm.main_product"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8 }"
          ></el-input>
        </el-form-item>
        <el-form-item label="公司优势" prop="adv" class="company-strength">
          <el-button size="mini" @click="addCompanyStrength">添加</el-button>
          <el-table :data="advTableData" border style="width: 100%">
            <el-table-column prop="img" label="图片" align="center">
              <template slot-scope="scope">
                <el-upload
                  action
                  :on-change="(file, fileList) =>
                                        uploadCompanyStrength(scope.row, file, fileList)
                                    "
                  list-type="picture-card"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="(file, fileList) =>
                            handleRemoveAdv(scope.row, file, fileList)
                        "
                  :file-list="scope.row.img"
                  accept=".pdf, .jpg, .jpeg, .png, .JPG, .JPEG, .PNG, .PDF"
                  :class="{ 'disabled-hidden': scope.row.img != '' }"
                  :limit="1"
                  :on-exceed="handleAdvImageExceed"
                  :auto-upload="false"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="描述" align="center">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.remark"
                  type="textarea"
                  :autosize="{ minRows: 4, maxRows: 8 }"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100px" align="center">
              <template slot-scope="scope">
                <span class="delete-text" @click="deleteAdv(scope.$index)">删除</span>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="热销产品" prop="hot">
          <el-button size="mini" @click="addHotProduct">添加</el-button>
          <el-table :data="hotTableData" border style="width: 100%">
            <el-table-column prop="product" label="商品" align="center">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.hot"
                  filterable
                  remote
                  placeholder="请输入关键词"
                  :remote-method="(keyword) => searchHotProduct(keyword, scope.row)
                                        "
                  style="width: 100%"
                >
                  <el-option
                    v-for="hot in scope.row.hotOptions"
                    :key="hot.id"
                    :label="hot.name"
                    :value="hot.id"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="操作" width="100px" align="center">
              <template slot-scope="scope">
                <span class="delete-btn" @click="deleteHot(scope.$index, hotTableData)">删除</span>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="店铺客服" prop="company_introduction">
          <el-select v-model="storeForm.customer_service" multiple placeholder="请选择">
            <el-option
              v-for="(customer, i) in customerServiceOptions"
              :key="i"
              :label="customer.realname"
              :value="customer.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div style="text-align: right">
        <el-button class="save-btn" @click="saveStoreRenovation">保 存</el-button>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from "vuex";
import Api from "../../plugins/api";

export default {
  name: "StoreRenovation",
  middleware: "auth",
  layout: "personalCenter",
  data() {
    return {
      storeForm: {
        logo: "",
        real: [],
        customer_service: [],
        company_introduction: "",
        main_product: "",
      },
      logoFileList: [],
      realFileList: [],
      logoUploadDisabled: false,
      advTableData: [], // 公司优势表
      hotOptions: [], // 热销产品下拉选
      hotTableData: [], // 热销产品表
      customerServiceOptions: [], // 客服下拉选
      dialogVisible: false,
      dialogImageUrl: "",
    };
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  mounted() {
    this.getCompanyMember();
    this.getRenovationInfo();
  },
  methods: {
    // 获取店铺装饰信息
    getRenovationInfo() {
      this.$request.get(Api.getRenovationInfo).then((res) => {
        console.log(res);
        const {
          company_introduction,
          main_product,
          logo,
          logo_path,
          real,
          customer_service,
          adv,
          hot,
        } = res.data;
        this.storeForm.company_introduction = company_introduction;
        this.storeForm.main_product = main_product;
        this.logoFileList = [{ url: logo_path, img: logo }];
        this.realFileList = real.map((item) => ({
          url: item.img_path,
          img: item.img,
        }));
        this.storeForm.customer_service = customer_service.map(
          (item) => item.id
        );
        this.advTableData = adv.map((item) => {
          return {
            remark: item.remark,
            img: [{ img: item.img, url: item.img_path, disable: true }],
          };
        });
        this.hotTableData = hot.map((item) => {
          const opt = {
            hot: item.id,
            name: item.goods_name,
            hotOptions: [{ id: item.id, name: item.goods_name }],
          };
          return opt;
        });
      });
    },

    uploadImage(file) {
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
      formData.append("file", file, file.name);
      formData.append("dir", "storeImage");
      const uploadConfig = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      return this.$request.post(Api.uploadImage, formData, uploadConfig);
    },
    // 公司logo
    async uploadLogo(file, fileList) {
      const res = await this.uploadImage(file.raw);
      if (res.code === 0) {
        this.storeForm.logo = res.data.img;
        file.url = res.data.img_path;
        file.img = res.data.img;
        this.logoFileList = fileList;
        this.logoUploadDisabled = true;
      } else {
        this.$message.error(res.msg);
        this.logoFileList = [];
      }
    },
    handleRemoveLogo(file, fileList) {
      this.logoFileList = fileList;
      this.logoUploadDisabled = false;
    },
    // 实景图片
    async uploadReal(file, fileList) {
      const res = await this.uploadImage(file.raw);
      if (res.code === 0) {
        file.url = res.data.img_path;
        file.img = res.data.img;
        this.realFileList = fileList;
      } else {
        fileList.forEach((item, i) => {
          if (item.uid === file.uid) {
            fileList.splice(i, 1);
          }
        });
        this.realFileList = fileList;
        this.$message.error(res.msg);
      }
    },
    handleRealImageExceed() {
      this.$message.warning("只能上传5张图片");
    },
    handleAdvImageExceed() {
      this.$message.warning("只能上传1张图片");
    },
    handleRemoveReal(file, fileList) {
      this.realFileList = fileList;
    },
    // 添加公司优势
    addCompanyStrength() {
      this.advTableData.push({
        img: [],
        remark: "",
        disable: false,
      });
    },
    deleteAdv(index) {
      this.advTableData.forEach((item, i) => {
        if (index === i) {
          this.advTableData.splice(i, 1);
        }
      });
    },
    // 上传公司优势
    async uploadCompanyStrength(row, file, fileList) {
      const res = await this.uploadImage(file.raw);
      if (res.code === 0) {
        file.url = res.data.img_path;
        file.img = res.data.img;
        row.img = fileList;
      } else {
        row.img = [];
        this.$message.error(res.msg);
      }
    },

    handleRemoveAdv(row, file, fileList) {
      row.img = fileList;
      row.disable = false;
    },
    addHotProduct() {
      this.hotTableData.push({
        hot: "",
        hotOptions: [],
      });
    },
    deleteHot(index, rows) {
      rows.splice(index, 1);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 搜索热销产品
    searchHotProduct(keywords, row) {
      this.$request
        .get(Api.searchGoods, { params: { keywords } })
        .then((res) => {
          if (res.code === 0) {
            row.hotOptions = res.data;
          } else {
            row.hotOptions = [];
          }
        });
    },
    // 获取公司客服
    getCompanyMember() {
      this.$request.get(Api.getCompanyMember).then((res) => {
        if (res.code === 0) {
          this.customerServiceOptions = res.data;
        }
      });
    },
    // 保存店铺装修
    saveStoreRenovation() {
      const params = {
        id: this.userInfo.company_id,
        company_introduction: this.storeForm.company_introduction,
        main_product: this.storeForm.main_product,
        logo: "",
        real: [],
        adv: [],
        hot: [],
        customer_service: [],
      };
      params.logo = this.logoFileList[0].img;
      params.adv = this.advTableData.map((item) => ({
        remark: item.remark,
        img: item.img[0].img,
      }));
      params.real = this.realFileList.map((item) => ({ img: item.img }));
      params.customer_service = this.customerServiceOptions.filter((item) =>
        this.storeForm.customer_service.includes(item.id)
      );
      params.hot = [];
      this.hotTableData.forEach((item) => {
        item.hotOptions.forEach((hotItem) => {
          if (hotItem.id === item.hot) {
            params.hot.push(hotItem);
          }
        });
      });
      console.log("params.hot", params.hot);
      this.$request.post(Api.saveRenovation, params).then((res) => {
        if (res.code === 0) {
          this.$message.success(res.msg);
          this.getRenovationInfo();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.disabled-hidden :deep(.el-upload--picture-card) {
  display: none !important;
}

.storerenovation-page {
  box-sizing: border-box;
  background-color: #fff;
  padding: 20px;

  .title {
    font-weight: bold;
    font-size: 18px;
    color: #0a1833;
    line-height: 21px;
    margin-bottom: 10px;
  }

  .company-strength {
    :deep(.el-upload--picture-card) {
      width: 108px;
      height: 80px;
      line-height: 88px;
    }

    .delete-text {
      cursor: pointer;
    }
  }

  .save-btn {
    color: #fff;
    padding: 10px 40px;
    background: #2277e8;
    border-radius: 2px;
    margin-right: 400px;
  }

  .delete-btn {
    cursor: pointer;
  }
}
</style>