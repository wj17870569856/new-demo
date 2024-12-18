<template>
  <div class="contractManagement-page">
    <el-dialog
    @close="dialogClose"
      class="dialog-style"
      :title="formData.id?'编辑':'新增'"
      :visible.sync="dialogModelVisible"
      width="540px"
    >
      <el-form ref="formData" :model="formData" :rules="formDataRules" label-width="110px">
        <el-form-item label="合同编号" v-if="formData.contract_no">
          <el-input :value="formData.contract_no" disabled></el-input>
        </el-form-item>
        <el-form-item label="合同名称" prop="contract_title">
          <el-input v-model="formData.contract_title" placeholder="请输入"></el-input>
        </el-form-item>

        <el-form-item label="甲方名称" prop="party_a">
          <el-input v-model="formData.party_a" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="乙方名称" prop="party_b">
          <el-input v-model="formData.party_b" placeholder="请输入"></el-input>
        </el-form-item>

        <el-form-item label="合同金额" prop="amount">
          <el-input type="number" v-model="formData.amount" placeholder="请输入">
            <span slot="append">万元</span>
          </el-input>
        </el-form-item>

        <el-form-item label="合同签订日期" prop="contract_date">
          <el-date-picker
            v-model="formData.contract_date"
            style="width:100%"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="上传附件" prop="fileList">
          <el-upload
            action
            :auto-upload="false"
            :file-list="fileList"
            class="avatar-uploader"
            :on-preview="handlePreview"
            :on-change="chooseImage"
            :limit="1"
            :on-remove="handleRemove"
          >
            <el-button size="small" type="primary" plain icon="el-icon-upload">点击上传</el-button>
            <span class="upload-tips">支持上传JPG、PNG、PDF</span>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="cancel-btn" @click="dialogClose">取 消</el-button>
        <el-button type="primary" class="sure-btn" @click="dialogSubmit">保 存</el-button>
      </div>
    </el-dialog>

    <div class="search-form">
      <el-form ref="searchForm" class="search-form-inline">
        <el-form-item>
          <el-input v-model="searchForm.contract_no" placeholder="合同编号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchForm.contract_title" placeholder="合同名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchForm.party_a" placeholder="甲乙方名称"></el-input>
        </el-form-item>

        <el-form-item label="发布时间：" style="width:unset" class="time">
          <el-date-picker
            v-model="searchForm.time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="text" @click="search">搜索</el-button>
          <el-button type="text" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-wrapper">
      <div class="btn-group">
        <el-button type="primary" @click="showDialog(true)">添加合同</el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="list"
        tooltip-effect="dark"
        style="width: 100%"
        stripe
        header-row-class-name="table-header-style"
      >
        <el-table-column prop="contract_no" label="合同编号" align="center" width="100"></el-table-column>
        <el-table-column prop="contract_title" label="合同名称" align="center"></el-table-column>
        <el-table-column prop="party_a" label="甲方名称" align="center"></el-table-column>
        <el-table-column prop="party_b" label="乙方名称" align="center"></el-table-column>
        <el-table-column prop="amount" label="合同金额（万元）" align="center" width="160"></el-table-column>
        <el-table-column prop="contract_date" label="合同签订日期" align="center" width="160"></el-table-column>
        <el-table-column prop="update_time" label="更新时间" align="center" width="160">
          <template
            slot-scope="{ row }"
          >{{ $moment(row.update_time * 1000).format("yyyy-MM-DD HH:mm:ss") }}</template>
        </el-table-column>

        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              icon="el-icon-edit"
              @click="showDialog(true,scope.row)"
            >修改</el-button>
            <el-popconfirm
              :title="`删除合同 ${scope.row.contract_title} `"
              hide-icon
              confirm-button-text="取消"
              cancel-button-text="删除"
              popper-class="popper-delete"
              @cancel="deleteItem(scope.row.id)"
            >
              <el-button slot="reference" type="text" size="small" icon="el-icon-delete">删除</el-button>
            </el-popconfirm>

            <el-button
              v-if="scope.row.attach_url"
              @click="viewFiles(scope.row)"
              type="text"
              size="small"
              icon="el-icon-view"
            >查看附件</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="text-align: right; margin: 20px 0"
        small
        layout=" prev, pager, next, jumper"
        :total="total"
        :page-size="pageSize"
        :pager-count="5"
        :current-page="page"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import Api from "../../plugins/api";
import setting from "~/config";
export default {
  name: "StaffAccountAdmin",
  middleware: "auth",
  layout: "personalCenter",
  data() {
    return {
      fileList: [],
      formDataRules: {
        province: [{ contract_no: true, message: "请输入", trigger: "blur" }],
        contract_title: [
          { required: true, message: "请输入", trigger: "blur" },
        ],

        party_a: [{ required: true, message: "请输入", trigger: "blur" }],
        party_b: [{ required: true, message: "请输入", trigger: "blur" }],
        amount: [{ required: true, message: "请输入", trigger: "blur" }],
        contract_date: [{ required: true, message: "请输入", trigger: "blur" }],
        fileList: [
          {
            required: true,
            trigger: ["change", "blur"],
            validator: (rule, value, callback) => {
              if (this.fileList.length === 0) {
                callback(new Error("请上传合同附件"));
              } else {
                callback();
              }
            },
          },
        ],
      },
      formData: {},
      searchForm: {},
      list: [],
      dialogModelVisible: false,
      page: 1,
      pageSize: 20,
      total: 0,
    };
  },
  methods: {
    viewFiles(row) {
      const files = JSON.parse(row.attach_url);

      window.open(files[0].url);
    },
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    async chooseImage(file, fileList) {
      const fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1);
      const whiteList = [
        "jpg",
        "png",
        "jpeg",
        "JPG",
        "JPEG",
        "PNG",
        "PDF",
        "pdf",
        "txt",
        "doc",
        "docx",
        "xls",
        "xlsx",
        "psd",
        "crd",
        "Ai",
        "dwg",
        "cdr",
        "zip",
        "rar",
      ];

      if (!whiteList.includes(fileSuffix)) {
        fileList.pop();
        this.$message.error(
          "仅支持jpg，png，jpeg图片,pdf，txt，word，excel，psd，crd，Ai，dwg，cdr，zip，rar文件"
        );
        return false;
      }

      const formData = new FormData();
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
          url: setting.imgUrl + data.filePath,
          path: data.filePath,
          name: data.fileName,
        });
      }
    },
    handlePreview(file) {
      window.open(file.url);
    },
    deleteItem(id) {
      this.$request
        .post(Api.contractDelete, {
          id,
        })
        .then((res) => {
          if (res.code === 0) {
            this.$message.success(res.msg);
            this.getList();
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getList();
    },
    dialogSubmit() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          let d = {
            ...this.formData,
            attach_url: JSON.stringify(this.fileList),
          };
          this.$request.post(Api.contractSave, d).then((res) => {
            if (res.code === 0) {
              this.$message.success(res.msg);
              this.getList();
              this.dialogClose();
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },
    dialogClose() {
      this.formData = {};
      this.fileList = [];
      this.$refs.formData.resetFields();
      this.dialogModelVisible = false;
    },
    showDialog(type, row) {
      if (row) {
        this.formData = JSON.parse(JSON.stringify(row));
        if (row.attach_url) {
          try {
            this.fileList = JSON.parse(row.attach_url);
          } catch (error) {
            this.fileList = [];
          }
        }
      }
      this.dialogModelVisible = type;
    },
    getList() {
      const params = {
        page: this.page,
        page_size: this.pageSize,
        ...this.searchForm,
      };
      const time = params.time;
      if (time) {
        params.start_date = time[0];
        params.end_date = time[1];
        delete params.time;
      }
      this.$request.get(Api.contractList, { params }).then((res) => {
        if (res.code === 0) {
          this.list = res.data;
          this.total = res.count;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    search() {
      this.page = 1;
      this.getList();
    },
    reset() {
      this.searchForm = {};
      this.search();
    },
  },
  mounted() {
    this.search();
  },
};
</script>
<style lang="less" scoped>
.upload-tips {
  font-size: 12px;
  color: #8993a5;
  line-height: 14px;
}
.contractManagement-page {
  background-color: #fff;
  padding: 20px;
  box-sizing: border-box;
  min-height: 750px;
  .title {
    font-weight: bold;
    font-size: 18px;
    color: #0a1833;
    line-height: 21px;
    margin-bottom: 10px;
  }

  .search-form {
    height: 56px;
    display: flex;
    align-items: center;
    background: rgba(137, 147, 165, 0.06);
    border-radius: 2px;
    padding: 5px;
    box-sizing: border-box;
    :deep(.el-form-item) {
      margin: 0 5px;
      width: 120px;

      &.time {
        width: 350px;
        display: flex;
        .el-input__icon,
        .el-range__icon,
        .el-range-separator,
        .el-range__close-icon {
          display: flex;
          align-items: center;
        }
        .line {
          text-align: center;
        }

        .el-form-item__label {
          width: 120px !important;
        }

        .el-form-item__content {
          margin: 0 !important;
        }
      }

      &.search-form-btn {
        width: 150px;
        display: flex;
        justify-content: space-around;
        align-items: center;

        .el-form-item__content {
          display: flex;
          justify-content: space-around;
          align-items: center;

          .el-button {
            padding: 0;
            width: 52px;
            height: 26px;
            line-height: 26px;
            text-align: center;
            background: #2277e8;
            border-radius: 2px;
            color: #fff;
          }

          .reset-btn {
            background: #959595;
          }
        }
      }

      .el-input__inner {
        border: 1px solid #d5d5d5;
        border-radius: 2px;
        height: 32px;
        line-height: 32px;
      }
    }

    .search-form-inline {
      display: flex;

      :deep(.el-form-item) {
        margin: 0 5px;
        width: 120px;

        &.time {
          width: 350px;
          display: flex;

          .line {
            text-align: center;
          }

          .el-form-item__label {
            width: 120px !important;
          }

          .el-form-item__content {
            margin: 0 !important;
          }
        }

        &.search-form-btn {
          width: 150px;
          display: flex;
          justify-content: space-around;
          align-items: center;

          .el-form-item__content {
            display: flex;
            justify-content: space-around;
            align-items: center;

            .el-button {
              padding: 0;
              width: 52px;
              height: 26px;
              line-height: 26px;
              text-align: center;
              background: #2277e8;
              border-radius: 2px;
              color: #fff;
            }

            .reset-btn {
              background: #959595;
            }
          }
        }

        .el-input__inner {
          border: 1px solid #d5d5d5;
          border-radius: 2px;
          height: 32px;
          line-height: 32px;
        }
      }
    }
  }

  .table-wrapper {
    .btn-group {
      display: flex;
      margin-top: 10px;
      margin-bottom: 24px;
      .btn {
        padding: 0;
        width: 80px;
        height: 28px;
        line-height: 28px;
        text-align: center;
        background: #ffffff;
        border: 1px solid #d5d5d5;
        border-radius: 2px;
        margin-bottom: 10px;
        margin-right: 10px;
        font-size: 14px;
        font-family: Microsoft YaHei, Microsoft YaHei-Regular;
        font-weight: 400;
        color: #353535;

        &.blue {
          color: #2277e8;
          border: 1px solid #2277e8;
        }
      }
    }

    :deep(.table-header-style) {
      background: rgba(137, 147, 165, 0.06);

      th {
        background: transparent;
      }
    }
  }

  .dialog-style {
    :deep(.el-dialog__header) {
      background: #2277e8;
      padding: 10px;
    }

    :deep(.el-dialog__title) {
      color: #fff;
      font-size: 16px;
    }

    :deep(.el-dialog__headerbtn) {
      top: 15px;
    }

    .dialog-footer {
      .cancel-btn {
        padding: 0;
        width: 88px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        background: #ffffff;
        border: 1px solid #d5d5d5;
        border-radius: 2px;
        color: #353535;
      }

      .sure-btn {
        padding: 0;
        width: 88px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        background: #2277e8;
        border: 1px solid #2277e8;
        border-radius: 2px;
        color: #fff;
      }
    }
  }
}
</style>