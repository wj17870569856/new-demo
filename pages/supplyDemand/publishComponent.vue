<!-- 发布货源和设备 -->
<template>
  <div>
    <div class="main">
      <div class="sd-publish">
        <div>
          <div class="card">
            <div class="title">清单明细</div>
            <div class="wrap">
              <el-table
                ref="listTable"
                :data="tableData"
                v-loading="importing"
                border
                style="width: 100%"
                size="mini"
                :header-row-style="{ background: 'rgba(137,147,165,0.06)' }"
                :header-cell-style="{
                  background: 'transparent',
                  color: '#43546F',
                  fontSize: '12px',
                  fontWeight:'400'
                }"
              >
                <el-table-column prop="category" label="分类（必填）" width="240" align="center">
                  <template slot-scope="scope">
                    <el-select
                      v-model="scope.row.category"
                      size="mini"
                      filterable
                      allow-create
                      default-first-option
                      placeholder="请选择分类"
                      :disabled="status === 2 || status === 4"
                    >
                      <el-option
                        v-for="item in categoryOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name"
                      ></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="content" label="需求名称" align="center">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.content"
                      size="mini"
                      placeholder="请输入名称"
                      :disabled="status === 2 || status === 4"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="num" label="数量" width="100" align="center">
                  <template slot-scope="scope">
                    <el-input
                      type="number"
                      v-model="scope.row.num"
                      size="mini"
                      :disabled="status === 2 || status === 4"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="unit" label="单位" width="100" align="center">
                  <template slot-scope="scope">
                    <el-select
                      v-model="scope.row.unit"
                      size="mini"
                      placeholder="请选择"
                      :disabled="status === 2 || status === 4"
                    >
                      <el-option
                        v-for="item in unitOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name"
                      ></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="index"
                  label="操作"
                  width="80"
                  align="center"
                  v-if="status !== 2 && status !== 4"
                >
                  <template slot-scope="scope">
                    <el-button
                      style="color: #FF2618;"
                      icon="el-icon-delete"
                      type="text"
                      @click="deleteRow(scope.row.id, scope.$index, tableData)"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="btn-group" v-if="status !== 2 && status !== 4">
                <el-button type="text" icon="el-icon-plus" @click="addRow">添加明细</el-button>

                <el-popover
                  v-model="popoverVisible"
                  placement="bottom"
                  width="300"
                  trigger="manual"
                >
                  <div>
                    <el-upload
                      ref="uploadExcel"
                      class="upload-demo"
                      action
                      :limit="1"
                      :file-list="excelList"
                      :auto-upload="false"
                      :on-change="chooseExcel"
                      :on-remove="removeExcel"
                      :on-exceed="handleExceedExcel"
                    >
                      <el-button slot="trigger" size="small">选择文件</el-button>
                    </el-upload>
                    <div style="border-bottom: 1px solid rgba(137,147,165,0.06); margin: 5px 0"></div>
                    <el-button type="text" @click="exportTemplate">下载模版</el-button>
                    <div style="text-align: center">
                      <div class="cancel-btn" @click="popoverVisible = false">取 消</div>
                      <div class="confirm-btn" @click="sureImport">确认导入</div>
                    </div>
                  </div>
                  <el-button
                    style="margin-left:42px"
                    type="text"
                    slot="reference"
                    icon="el-icon-upload2"
                    @click="popoverVisible = true"
                  >导入明细</el-button>
                </el-popover>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="title">供需要求</div>
            <div class="wrap">
              <el-form
                ref="form"
                :model="form"
                label-width="100px"
                :rules="formRules"
                :disabled="status === 2 || status === 4"
              >
                <el-form-item label="地址" prop="province_code">
                  <el-row :gutter="10">
                    <el-col :span="11">
                      <el-select
                        style="width: 100%;"
                        v-model="form.province_code"
                        placeholder="请选择"
                        @change="provinceChange"
                      >
                        <el-option label="请选择" value></el-option>
                        <el-option
                          v-for="item in provinceOptions"
                          :key="item.id"
                          :label="item.name"
                          :value="item.citycode"
                        ></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="11">
                      <el-select style="width: 100%;" v-model="form.city_code" placeholder="请选择">
                        <el-option
                          v-for="item in cityOptions"
                          :key="item.id"
                          :label="item.name"
                          :value="item.citycode"
                        ></el-option>
                      </el-select>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label="报价有效期" prop="deadline_long">
                  <el-row :gutter="10">
                    <el-col :span="3">
                      <el-radio v-model="form.deadline_long" :label="2">指定日期</el-radio>
                    </el-col>
                    <el-col :span="9">
                      <el-date-picker
                        style="width: 100%;"
                        v-model="form.deadline"
                        :picker-options="pickerOptions"
                        @change="deadlineChange"
                        type="date"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd"
                      ></el-date-picker>
                    </el-col>
                    <el-col :span="6">
                      <el-radio
                        v-model="form.deadline_long"
                        :label="1"
                        @input="deadlineTypeChange"
                      >长期有效</el-radio>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label="附件">
                  <el-upload
                    class="upload-file"
                    action
                    :on-change="chooseFile"
                    :limit="1"
                    :on-exceed="handleExceed"
                    :file-list="fileList"
                    :auto-upload="false"
                    :on-preview="handlePreview"
                  >
                    <el-button size="small" type="primary" icon="el-icon-upload2" plain>点击上传</el-button>
                    <div
                      slot="tip"
                      class="el-upload__tip"
                    >支持jpg，png图片,pdf，txt，word，excel，psd，crd，Ai，dwg，cdr文件，压缩包，附件仅限15M</div>
                  </el-upload>
                </el-form-item>
                <el-form-item label="需求名称" prop="remark">
                  <el-input
                    v-model="form.remark"
                    style="padding: 0 5px"
                    type="textarea"
                    :rows="4"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
              </el-form>
            </div>
          </div>

          <template v-if="type == '1' && showBindGoods">
            <div class="title">1.3 关联产品</div>
            <div class="card">
              <el-table
                :data="related_goods"
                border
                style="width: 100%"
                size="mini"
                :header-row-style="{ background: 'rgba(137,147,165,0.06)' }"
                :header-cell-style="{
                  background: 'transparent',
                  color: '#353535',
                  fontSize: '12px',
                }"
              >
                <el-table-column prop="content" label="商品">
                  <template slot-scope="{ row }">
                    <div style="display: flex; align-items: baseline">
                      <el-image style="width: 60px; height: 60px" :src="row.image"></el-image>
                      <span style="margin-left: 8px">{{ row.goods_name }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="num" label="价格" width="180" align="center">
                  <template slot-scope="{ row }">
                    ￥{{ Number(row.sku_shop_price).toFixed(2) }} /
                    {{ row.unit_name }}
                  </template>
                </el-table-column>

                <el-table-column
                  prop="index"
                  label="操作"
                  width="120"
                  align="center"
                  v-if="status !== 2 && status !== 4"
                >
                  <template slot-scope="scope">
                    <el-button type="text" @click="deleteItem(scope.$index)">移除关联</el-button>
                  </template>
                </el-table-column>
              </el-table>

              <div class="btn-group" v-if="status !== 2 && status !== 4">
                <el-button type="text" @click="showGoodsDialog = true" icon="el-icon-plus">添加关联产品</el-button>
              </div>
            </div>
          </template>

          <el-dialog title="添加关联产品" @open="getGoodsList" top="10vh" :visible.sync="showGoodsDialog">
            <el-input
              size="small "
              style="width: 240px; margin-bottom: 8px"
              v-model="keyword"
              placeholder="请输入内容"
            ></el-input>
            <el-button size="small " type="primary" @click="getGoodsList">搜索</el-button>
            <el-table
              ref="goodsTable"
              :data="goods"
              height="480px"
              border
              style="width: 100%"
              size="mini"
              :header-row-style="{ background: 'rgba(137,147,165,0.06)' }"
              :header-cell-style="{
                background: 'transparent',
                color: '#353535',
                fontSize: '12px',
              }"
            >
              <el-table-column type="selection" align="center" width="45"></el-table-column>

              <el-table-column prop="content" label="商品图片" align="center" width="120">
                <template slot-scope="{ row }">
                  <el-image style="width: 60px; height: 60px" :src="row.image"></el-image>
                </template>
              </el-table-column>
              <el-table-column prop="category_name" label="商品分类" width="100" align="center"></el-table-column>

              <el-table-column prop="goods_name" label="商品名称" align="center">
                <!-- <template slot-scope="scope"> </template> -->
              </el-table-column>

              <el-table-column prop="id" label="商品编号" width="100" align="center">
                <!-- <template slot-scope="scope"> </template> -->
              </el-table-column>

              <el-table-column prop="create_time" label="发布时间" align="center">
                <!-- <template slot-scope="scope"> </template> -->
              </el-table-column>
            </el-table>
            <el-row class="row">
              <el-pagination
                background
                layout="prev, pager, next"
                @current-change="currentChange"
                :current-page="pageData.page"
                :page-size="pageData.pagesize"
                :total="goodsTotal"
              ></el-pagination>
            </el-row>
            <span slot="footer" class="dialog-footer">
              <el-button @click="showGoodsDialog = false">关 闭</el-button>
              <el-button type="primary" @click="submitByGoodsDialog">确定选择</el-button>
            </span>
          </el-dialog>
        </div>
        <div style="display: flex; width: 100%; justify-content: flex-end;margin-top:120px">
          <div class="btn" @click="back">返回</div>
          <div class="btn" @click="deleteSupplyOrder" v-if="status === 1">删除</div>
          <div class="btn" @click="closeSupplyOrder" v-if="status === 2">关闭</div>
          <div
            class="pub-btn"
            @click="publish"
            v-if="status === 1 || status === 3 || !id"
          >{{ id ? "保存" : "发布" }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import { mapState } from "vuex";
import Api from "../../plugins/api";
export default {
  name: "SdPublish",
  props: ["information_type", "type", "id", "showBindGoods"],
  data() {
    return {
      goodsTotal: 0,
      pageData: {
        page: 1,
        pagesize: 10,
      }, // 最新交易分页
      keyword: "",
      goods: [],
      related_goods: [],
      showGoodsDialog: false,
      popoverVisible: false,
      pickerOptions: {
        disabledDate: (item) => {
          return item * 1 < new Date() * 1;
        },
      },
      unitOptions: [], // 单位下拉选
      categoryOptions: [], // 分类下拉选
      provinceOptions: [], // 省份下拉选
      cityOptions: [], // 市下拉选
      tableData: [],
      form: {
        province_code: "",
        city_code: "",
        deadline_long: 1,
        deadline: "",
        remark: "",
        vehicle_model: "",
        vehicle_length: "",
        goods: "",
        number: "",
        receives: [],
      },
      status: "", // 供需单状态
      formRules: {
        province_code: [
          {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (!this.form.city_code || !this.form.province_code) {
                callback(new Error("请将地址选择完整"));
              } else {
                callback();
              }
            },
          },
        ],
        deadline_long: [
          {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              console.log(this.form.deadline_long, "this.form.deadline_long");

              if (!this.form.deadline_long) {
                callback(new Error("请选择报价有效期"));
              } else if (
                this.form.deadline_long == "2" &&
                !this.form.deadline
              ) {
                callback(new Error("请选择日期"));
              } else {
                callback();
              }
            },
          },
        ],
        remark: [
          { required: true, message: "请输入需求名称", trigger: "blur" },
        ],
      },
      fileList: [],
      excelList: [],
      importing: false,
    };
  },
  watch: {
    type() {
      this.tableData = [];
      this.getCategoryOptions();
      this.addRow();
    },
  },
  async mounted() {
    await this.getCityRegion();
    if (this.id) {
      this.getDetails();
    }
    this.getSKUStateSelect();
    this.$nextTick(() => {
      this.getCategoryOptions();
    });
  },
  computed: {
    ...mapState(["token"]),
  },
  methods: {
    currentChange(page) {
      this.pageData.page = page;
      this.getGoodsList();
    },
    deleteItem(index) {
      this.related_goods.splice(index, 1);
    },
    submitByGoodsDialog() {
      const selection = this.$refs["goodsTable"].selection;
      this.related_goods.push(...selection);
      this.showGoodsDialog = false;
    },
    // 获取单位下拉选
    getSKUStateSelect() {
      return this.$request.get(Api.getSKUStateSelect).then((res) => {
        if (res.code === 0) {
          this.unitOptions = res.data.unit;
          this.stockStatus = res.data.stock_status;
          this.OnSaleList = res.data.is_on_sale;
          this.addRow();
        }
      });
    },
    // 获取分类下拉选
    getCategoryOptions() {
      if (this.type == 1) {
        // 获取物资分类下拉选
        this.$request.get(Api.getGoodsLevel3CategoryList).then((res) => {
          if (res.code === 0) {
            this.categoryOptions = res.data.map((item) => {
              return {
                ...item,
                id: item.cate_id,
                name: item.cate_name,
              };
            });
          }
        });
      } else if (this.type == 2) {
        // 获取设备分类下拉选
        this.$request.get(Api.equipmentSelectList).then((res) => {
          if (res.code === 0) {
            this.categoryOptions = res.data;
          }
        });
      }
    },
    getGoodsList() {
      this.$request
        .get(Api.getSKULists, {
          params: { goods_name: this.keyword, ...this.pageData },
        })
        .then((res) => {
          if (res.code === 0) {
            this.goods = res.data.data;
            this.goodsTotal = res.data.total;
          }
        });
    },
    // 获取省
    getCityRegion() {
      return this.$request
        .get(Api.getCity, { params: { level: 2 } })
        .then((res) => {
          if (res.code === 0) {
            this.provinceOptions = res.data;
          }
        });
    },
    // 省改变获取市
    provinceChange(code, notClear) {
      if (!notClear) {
        this.form.city_code = "";
      }
      const city = this.provinceOptions.find((item) => item.citycode === code);
      if (city) {
        this.cityOptions = city.children;
      }
    },
    chooseExcel(file, fileList) {
      this.excelList = fileList;
    },
    removeExcel(file, fileList) {
      this.excelList = fileList;
    },
    handleExceedExcel() {
      this.$message.error("只能导入一个文件");
    },
    // 下载导入模板
    exportTemplate() {
      const h = this.$refs.listTable.columns.map((item) => item.label);
      h.splice(-1, 1); // 删除最后一个操作列
      const header = { header: h };
      const data = [];
      const xlsxName = `供需清单导入模板`;
      const ws = this.$xlsx.utils.json_to_sheet(data, header);
      const wb = this.$xlsx.utils.book_new();
      this.$xlsx.utils.book_append_sheet(wb, ws, xlsxName);
      this.$xlsx.writeFile(wb, xlsxName + ".xlsx");
    },
    sureImport() {
      const file = this.excelList[0];
      const that = this;
      const reader = new FileReader();
      reader.onload = function (e) {
        const bstr = e.target.result;
        const workbook = that.$xlsx.read(bstr, { type: "binary" });
        const wsname = workbook.SheetNames[0];
        const ws = workbook.Sheets[wsname];
        const data = that.$xlsx.utils.sheet_to_json(ws, { header: 1 });
        that.excelDataToTableData(data);
      };
      reader.readAsBinaryString(file.raw);
      this.SkuExcelFileList = [];
    },
    // excel表中的数据转成colTable组件需要的数据
    excelDataToTableData(data) {
      const that = this;
      let tableheader = this.$refs.listTable.columns.map((item) => item.label); // 页面表格上的标题
      tableheader.splice(-1, 1); // 删除最后一个操作列

      const headerIndex = {}; // excel里的标题和对应的下标
      const tableData = [];

      let hasError = false;
      this.importing = true;
      try {
        data.forEach((row, i) => {
          if (i === 0) {
            // 标题行
            row.forEach((value, j) => {
              headerIndex[value] = j;
            });
            if (
              !(
                tableheader.length === row.length &&
                tableheader.sort().toString() === row.sort().toString()
              )
            ) {
              throw new Error(`excel表头数量不对，请重新下载模板填入`);
            }
          } else {
            // 内容行
            const obj = {};
            for (const key in headerIndex) {
              // 拿出excel里
              if (Object.hasOwnProperty.call(headerIndex, key)) {
                const k = headerIndex[key];

                switch (key) {
                  case "分类":
                    obj.category = row[k];
                    break;
                  case "分类（必填）":
                    obj.category = row[k];
                    const cate = this.categoryOptions.find(
                      (i) => i.name == row[key]
                    );
                    if (cate) {
                      obj.category_id = category_id.join(",");
                    } else {
                      this.$message.error(`第${i}行分类导入异常，列表无该分类`);
                      throw new Error(`第${i}行分类导入异常，列表无该分类`);
                    }
                    break;
                  case "需求名称":
                    obj.content = row[k];
                    break;
                  case "数量":
                    if (isNaN(row[k])) {
                      throw new Error(`第${i + 1}数量不是数值`);
                    }
                    obj.num = row[k];
                    break;
                  case "单位":
                    {
                      const name = row[k];
                      const Unit = that.unitOptions.find(
                        (item) => item.name === name
                      );
                      if (Unit) {
                        obj.unit = name;
                      } else {
                        throw new Error(`第${i + 1}行单位填写错误`);
                      }
                    }
                    break;
                }
              }
            }
            tableData.push(obj);
          }
        });
      } catch (error) {
        hasError = true;
        this.importing = false;
        this.$message.error(error.message);
      }

      if (hasError) {
        return;
      }
      this.tableData = this.tableData.concat(tableData);

      let settimer = setTimeout(() => {
        settimer && clearTimeout(settimer);
        this.importing = false;
        this.popoverVisible = false;
        this.excelList = [];
      }, 500);
    },
    // 添加一行表格
    addRow() {

      this.tableData.push({
        category: "",
        content: "",
        num: 1,
        unit: this.unitOptions[0].name,
      });
    },
    // 删除一行
    deleteRow(id, index, rows) {
      rows.splice(index, 1);
    },
    // 发布按钮
    publish() {
      const data = JSON.parse(JSON.stringify(this.form));
      if (this.tableData.length === 0) {
        this.$message.error("至少添加一条供需明细！");
        return;
      }
      if (
        this.tableData.length !==
        this.tableData.filter((item) => item.category).length
      ) {
        this.$message.error("请将明细填写完整！");

        return;
      }
      data.details = this.tableData.map((item) => {
        const category_id = this.categoryOptions.find(
          (i) => i.name == item.category
        ).id_list;
        return {
          ...item,
          category_id: category_id ? category_id.join(",") : "",
        };
      });
      data.related_goods = this.related_goods.map((item) => {
        return {
          goods_id: item.goods_id,
          sku_id: item.id,
        };
      });
      data.type = this.type || 1;
      data.information_type = this.information_type || 1;
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.fileList.length > 0) {
            data.upload = this.fileList[0].url;
          }
          this.$request.post(Api.supplyOrderEdit, data).then((res) => {
            if (res.code === 0) {
              this.$message.success("发布成功");
              if (this.$route.path.indexOf("buyer") != -1) {
                this.$emit("publishSuccess", { type: this.type });
              } else {
                this.$router.back();
              }
            }
          });
        }
      });
    },
    back() {
      this.$emit("publishBack", { type: this.type });
    },
    deleteSupplyOrder() {
      this.$request
        .get(Api.deleteSupplyOrder, { params: { id: this.id } })
        .then((res) => {
          if (res.code === 0) {
            this.$message.success("删除成功");
            this.$emit("publishDelete", { type: this.type });
          }
        });
    },
    closeSupplyOrder() {
      this.$request
        .get(Api.closeOrder, { params: { id: this.id } })
        .then((res) => {
          if (res.code === 0) {
            this.$message.success("关闭成功");
            this.$emit("publishClose", { type: this.type });
          }
        });
    },
    // 获取详情
    getDetails() {
      this.$request
        .get(Api.getSupplyOrderInfo, { params: { id: this.id } })
        .then((res) => {
          if (res.code === 0) {
            const {
              id,
              status,
              province_code,
              city_code,
              deadline_long,
              deadline,
              remark,
              vehicle_model,
              vehicle_length,
              goods,
              number,
              receive,
              details,
              upload,
              upload_url,
              related_goods,
            } = res.data;
            this.related_goods = (related_goods || []).map((item) => {
              return {
                ...item,
                id: item.sku_id,
                sku_shop_price: (Number(item.sku_shop_price) / 100).toFixed(2),
                image: item.image_url,
              };
            });
            this.form = {
              id,
              province_code,
              city_code,
              deadline_long,
              deadline:
                deadline_long === 1
                  ? ""
                  : this.$moment(deadline * 1000).format("yyyy-MM-DD"),
              remark,
              vehicle_model,
              vehicle_length,
              goods,
              number,
              receives: receive,
              upload,
              upload_url,
            };
            if (upload) {
              this.fileList.push({
                url: upload,

                name: upload,
                fileUrl: res.data.upload_url,
              });
            }
            this.status = status;
            this.provinceChange(province_code, true);
            this.tableData = details;
          }
        });
    },
    async chooseFile(file, fileList) {
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
      const isLt15M = file.size / 1024 / 1024 <= 15;
      if (!isLt15M) {
        fileList.pop();
        return this.$message.error("上传文件大小不能超过 15MB!");
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
        fileList[0].url = data.filePath;
        fileList[0].fileUrl = data.fileUrl;
        this.fileList = fileList;
      } else {
        this.fileList = [];
        this.$message.error(res.msg);
      }
    },
    handleExceed() {
      this.$message.error("只能上传一个文件");
    },
    handlePreview(file) {
      window.open(file.fileUrl);
    },
    deadlineChange(value) {
      if (value) {
        this.form.deadline_long = 2;
      }
    },
    deadlineTypeChange() {
      this.form.deadline = "";
    },
  },
};
</script>

<style scoped lang="less">
::v-deep {
  .el-form-item__label {
    text-align: left;
  }
}

.row {
  margin-top: 16px;
  text-align: right;
}

.sd-publish {
  margin: 0 auto;
}
.title {
  font-size: 14px;
  font-family: Microsoft YaHei, Microsoft YaHei-Bold;
  font-weight: 700;
  color: #353535;
  line-height: 18px;
  margin-bottom: 8px;
}

.card {
  background-color: #fff;
  border: 1px solid #c3d3e2;
  margin-bottom: 20px;

  .wrap {
    padding: 0 20px;
  }

  .title {
    height: 42px;
    display: flex;
    align-items: center;
    padding-left: 20px;
    font-weight: 600;
    font-size: 15px;
    background: #c3d3e2;
    color: #0a1833;
  }

  :deep(.el-table) {
    margin-bottom: 40px;
  }

  :deep(.el-table .el-input__inner) {
    border-radius: 0;
  }

  :deep(.el-table .el-button) {
    padding: 6px 12px;
  }

  :deep(.el-upload__tip) {
    font-size: 12px;
    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
    font-weight: 400;
    text-align: left;
    color: #959595;
    line-height: 18px;
    margin-top: 0;
  }
}

.upload-file {
  padding: 0 5px;
}

.btn {
  padding: 0;
  width: 120px;
  height: 40px;
  margin: 0 10px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 2px;
  font-size: 14px;
  font-family: Microsoft YaHei, Microsoft YaHei-Regular;
  font-weight: 400;
  text-align: center;
  color: #353535;
  line-height: 40px;
  cursor: pointer;
}

.pub-btn {
  width: 120px;
  height: 40px;
  background: #2277e8;
  border-radius: 2px;
  font-size: 14px;
  font-family: Microsoft YaHei, Microsoft YaHei-Regular;
  font-weight: 400;
  text-align: center;
  color: #ffffff;
  line-height: 40px;
  cursor: pointer;
}

:deep(.el-input.is-disabled .el-input__inner) {
  color: #353535;
}

:deep(.el-checkbox__input.is-disabled + span.el-checkbox__label) {
  color: #353535;
}

:deep(.el-radio__input.is-disabled + span.el-radio__label) {
  color: #353535;
}

:deep(.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner) {
  color: #353535;
}

:deep(.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after) {
  border-color: #353535;
}
</style>
