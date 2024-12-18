<template>
  <div class="publish-product-page">
    <div class="title">发布商品</div>
    <div class="step">
      <div class="step-item" :class="stepIndex >= 1 ? 'active' : ''">1.选择商品分类</div>
      <div class="step-item" :class="stepIndex >= 2 ? 'active' : ''">2.完善商品信息</div>
      <div class="step-item" :class="stepIndex >= 3 ? 'active' : ''">3.发布商品</div>
    </div>
    <div v-if="stepIndex === 1" class="container">
      <div class="choose-sort">
        <div class="level level1">
          <ul>
            <li
              v-for="(level1, i) in GoodsCategoryLevel1"
              :key="i"
              :class="level1ActiveId === level1.id ? 'active' : ''"
              @click="selectGoodsCategory(level1.id, i, 1)"
            >
              {{ level1.name }}
              <i class="el-icon-arrow-right"></i>
            </li>
          </ul>
        </div>
        <div class="level level2">
          <ul>
            <li
              v-for="(level2, i) in GoodsCategoryLevel2"
              :key="i"
              :class="level2ActiveId === level2.id ? 'active' : ''"
              @click="selectGoodsCategory(level2.id, i, 2)"
            >
              {{ level2.name }}
              <i class="el-icon-arrow-right"></i>
            </li>
          </ul>
        </div>
        <div class="level level3">
          <ul>
            <li
              v-for="(level3, i) in GoodsCategoryLevel3"
              :key="i"
              :class="level3ActiveId === level3.id ? 'active' : ''"
              @click="selectGoodsCategory(level3.id, i, 3)"
            >{{ level3.name }}</li>
          </ul>
        </div>
      </div>
      <div class="sort-res">
        <div>
          <span>选择分类：</span>
          <span v-if="level1ActiveName">
            {{ level1ActiveName }}
            <i class="el-icon-arrow-right"></i>
          </span>
          <span v-if="level2ActiveName">
            {{ level2ActiveName }}
            <i class="el-icon-arrow-right"></i>
          </span>
          <span v-if="level3ActiveName">{{ level3ActiveName }}</span>
        </div>
        <div class="btn-group">
          <el-popover v-model="popoverVisible" placement="bottom" width="300" trigger="manual">
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
              <div
                style="
                  border-bottom: 1px solid rgba(137, 147, 165, 0.06);
                  margin: 5px 0;
                "
              ></div>
              <ul>
                <li>1. 表头红色字段为必填</li>
                <li>2. 导入后，若商品资料未完善，需要在店铺产品上传图片</li>
              </ul>
              <el-button type="text" @click="exportTemplate">下载模板</el-button>

              <div style="text-align: center">
                <div class="cancel-btn" @click="popoverVisible = false">取 消</div>
                <div class="confirm-btn" @click="sureImport">确认导入</div>
              </div>
            </div>
            <div slot="reference" class="many-publish" @click="manyPublish">批量发布</div>
          </el-popover>
          <div class="next" @click="nestStep()">下一步</div>
        </div>
      </div>
    </div>
    <div v-if="stepIndex === 2" class="container">
      <div>
        <div class="detail-title">2.1 基本信息</div>
        <el-form
          ref="productDetailForm"
          :model="productDetailForm"
          :rules="productDetailFormRules"
          label-width="90px"
          class="detail-form"
        >
          <el-form-item label="商品分类" prop="name">
            <span v-if="level1ActiveName">
              {{ level1ActiveName }}
              <i class="el-icon-arrow-right"></i>
            </span>
            <span v-if="level2ActiveName">
              {{ level2ActiveName }}
              <i class="el-icon-arrow-right"></i>
            </span>
            <span v-if="level3ActiveName">{{ level3ActiveName }}</span>
            <el-popover
              v-model="showChangeSort"
              placement="bottom"
              width="200"
              trigger="manual"
              popper-class="change-sort-popper"
            >
              <div class="change-sort-tips">
                <p class="title">是否修改商品分类？</p>
                <p class="tips">之前填写商品信息将不再保存</p>
                <div class="change-sort-btn">
                  <div class="yes" @click="resetPage()">是</div>
                  <div class="no" @click="showChangeSort = false">否</div>
                </div>
              </div>
              <span slot="reference" class="change-sort-btn" @click="showChangeSort = true">
                去修改商品分类
                <i class="el-icon-arrow-right"></i>
              </span>
            </el-popover>
          </el-form-item>
          <el-form-item label="商品名称" prop="name">
            <el-input v-model="productDetailForm.name" placeholder="请输入30字以内" :maxlength="30"></el-input>
          </el-form-item>
          <el-form-item label="商品描述" prop="brief">
            <el-input
              v-model="productDetailForm.brief"
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 20 }"
              placeholder="请输入50字以内"
              :maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item label="商品图片" prop="image" style="width: 800px">
            <client-only>
              <el-upload
                class="upload-demo"
                name="image"
                action
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :file-list="fileList"
                :show-file-list="true"
                :on-change="uploadProductImage"
                accept=".pdf, .jpg, .jpeg, .png, .JPG, .JPEG, .PNG, .PDF"
                list-type="picture-card"
                :limit="5"
                :on-exceed="handleProductImageExceed"
                :auto-upload="false"
              >
                <div slot="tip" class="el-upload__tip">
                  <p>
                    1.
                    最多上传5张图片，建议尺寸为360px*360px，单张图片大小不超过10M；2.
                    第1张图为商品主图；
                  </p>
                </div>
                <i class="el-icon-plus"></i>
              </el-upload>
            </client-only>
          </el-form-item>
          <!-- <el-form-item label="发货地" prop="province">
            <el-cascader
              v-model="productDetailForm.province"
              placeholder="请选择"
              size="large"
              style="width: 100%"
              :options="cityOptions"
              :props="cityProps"
            ></el-cascader>
          </el-form-item>-->

          <el-form-item label="交付方式" prop="jf_mode">
            <el-select v-model="productDetailForm.jf_mode">
              <el-option :value="1" label="人工交付"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="计费方式" prop="charge_mode">
            <el-input
              v-model="productDetailForm.charge_mode"
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 20 }"
              placeholder="请输入"
            ></el-input>
          </el-form-item>

          <el-form-item label="交付信息" prop="jf_info">
            <el-input
              v-model="productDetailForm.jf_info"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 20 }"
              placeholder="请输入"
            ></el-input>
          </el-form-item>

          <!-- <el-form-item label="物流配送说明" prop="shipping">
            <el-input
              v-model="productDetailForm.shipping"
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 20 }"
              placeholder="请输入50字以内"
              :maxlength="50"
            ></el-input>
          </el-form-item>-->
          <!-- <el-form-item label="价格说明" prop="price_desc">
            <el-input
              v-model="productDetailForm.price_desc"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 20 }"
              placeholder="是否包含运费，是否含税"
              :maxlength="50"
            ></el-input>
          </el-form-item>-->
          <el-form-item label="是否支持线上支付" prop="is_online_pay">
            <el-checkbox
              v-model="productDetailForm.is_online_pay"
              true-label="1"
              false-label="0"
            >是（允许采购商使用微信、支付宝支付订单）</el-checkbox>
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input v-model="productDetailForm.sort" placeholder="请输入排序号" :maxlength="30"></el-input>
          </el-form-item>
        </el-form>
        <div class="detail-title">2.2 商品详情</div>
        <client-only>
          <vue-editor
            id="describe"
            v-model="productDetailForm.describe"
            use-custom-image-handler
            :editor-toolbar="customToolbar"
            @image-added="handleImageAdded"
          ></vue-editor>
        </client-only>

        <el-form label-width="90px" style="margin:20px 0">
          <el-form-item label="产品资质" prop="image" style="width: 800px">
            <client-only>
              <el-upload
                class="upload-demo"
                name="image"
                action
                :on-preview="handlePreview"
                :on-remove="handleRemove2"
                :file-list="fileList2"
                :show-file-list="true"
                :on-change="uploadProductImage2"
                accept=".pdf, .jpg, .jpeg, .png, .JPG, .JPEG, .PNG, .PDF"
                list-type="picture-card"
                :limit="1"
                :auto-upload="false"
              >
                <div slot="tip" class="el-upload__tip">支持上传JPG、PNG、PDF，可上传1张</div>
                <i class="el-icon-plus"></i>
              </el-upload>
            </client-only>
          </el-form-item>
        </el-form>

        <div class="detail-title">2.3 各规格型号</div>
        <div>
          <el-form ref="typeForm" :model="typeForm" label-width="100px" class="demo-typeForm">
            <el-form-item label="商品属性" prop="type">
              <el-checkbox-group v-model="typeForm.attr">
                <el-checkbox
                  v-for="(attr, i) in productAttr"
                  :key="i"
                  :label="attr.attr_id"
                  name="attr"
                >
                  {{
                  attr.attr_name }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="其他属性" prop="type">
              <el-checkbox-group v-model="typeForm.otherAttr">
                <el-checkbox
                  v-for="(attr, i) in otherAttr"
                  :key="i"
                  :label="attr.attr_id"
                  name="attr"
                >
                  {{ attr.attr_name
                  }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label class="flex">
              <el-input style="width: 220px" v-model="newAttrName" placeholder="请输入"></el-input>

              <el-button class="AddOtherAttr" type="text" @click="AddOtherAttr">
                <i class="el-icon-plus"></i>
                添加
              </el-button>
              <el-button type="primary" @click="addSkuAttrCol">生成商品</el-button>
            </el-form-item>
          </el-form>

          <div>
            <el-button type="text" @click="addSku">+ 添加规格型号</el-button>
            <el-upload
              class="upload-demo"
              style="display: inline"
              action
              :on-change="chooseSkuExcel"
              :auto-upload="false"
              :limit="1"
              :on-exceed="handleExceedExcel"
              :file-list="SkuExcelFileList"
              :show-file-list="false"
            >
              <el-button type="text">导入SKU</el-button>
            </el-upload>
            <el-button type="text" @click="downloadSkuTemp">下载导入模板</el-button>
            <colTable
              ref="colTable"
              v-loading="importing"
              :table-data="SkuTableData"
              :attr-header="AllAttrList"
              element-loading-text="数据导入中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.5)"
            ></colTable>
          </div>
        </div>
        <div class="detail-title">2.4 销售区域及运费设置</div>
        <div>
          <el-form
            ref="sellAreaAndFeeForm"
            :model="sellAreaAndFeeForm"
            :rules="sellAreaAndFeeFormRules"
            label-width="130px"
            class="sellarea-fee-form"
          >
            <el-form-item label="销售区域：">
              <el-checkbox v-model="allCountry" @change="allArea">全国</el-checkbox>
              <el-select
                v-model="sellAreaAndFeeForm.area"
                multiple
                placeholder="请选择"
                style="width: 100%"
                @change="areaChange"
                @remove-tag="removeArea"
              >
                <el-option
                  v-for="item in areaOption"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="运费设置：" prop="freight_type">
              <el-radio-group v-model="sellAreaAndFeeForm.freight_type" @change="freightTypeChange">
                <el-radio :label="1">待定</el-radio>
                <el-radio :label="2">按销售区域设置运费</el-radio>
                <el-radio :label="3">统一运费</el-radio>
                <el-input v-model="sellAreaAndFeeForm.freight_price" @input="freightPriceChange"></el-input>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="sellAreaAndFeeForm.freight_type == 2">
              <el-table :data="areafeeData" border style="width: 350px" height="300px">
                <el-table-column prop="name" label="区域" align="center"></el-table-column>
                <el-table-column prop="price" label="运费" align="center">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.price"></el-input>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div
        style="
          text-align: right;
          margin-top: 10px;
          margin-bottom: 20px;
          width: 100%;
        "
      >
        <el-button class="save-btn" @click="saveSku">保 存</el-button>
        <el-button class="pub-btn" @click="publishSku">发 布</el-button>
      </div>
    </div>
    <div v-if="stepIndex === 3" class="container">
      <div class="publish-success">
        <div class="img"></div>
        <div class="text">发布成功</div>
        <div class="tips">{{ seconds }}s后自动跳转发布商品页</div>
      </div>
      <div class="btn-group">
        <div class="normal-btn" @click="gotoStore">查看产品库</div>
        <div class="normal-btn" @click="continuRelease">继续发布</div>
      </div>
    </div>
    <el-dialog :visible.sync="previewVisible">
      <img width="100%" :src="previewImageUrl" alt />
    </el-dialog>
  </div>
</template>
<script>
/* eslint-disable */
import { mapState } from "vuex";
import colTable from "../../components/colTable.vue";
import Api from "../../plugins/api";

export default {
  name: "PublishProductPage",
  layout: "personalCenter",
  middleware: "auth",
  data() {
    return {
      previewVisible: false,
      showChangeSort: false,
      previewImageUrl: "",
      stepIndex: 1,
      seconds: 5,
      timer: null,
      productDetails: {},
      excelList: [], // 上传文件列表
      fileList: [],
      fileList2: [],
      cityOptions: [],
      cityProps: {
        label: "name",
        value: "id",
      },
      productDetailForm: {
        id: "",
        name: "",
        company_name: "",
        province: [],
        province_id: "",
        city_id: "",
        shipping: "", // 配送说明
        image: [],
        brief: "",
        describe: "",
        price_desc: "",
        sku: [],
        is_online_pay: "0",
        sort: "",
        jf_mode: "",
        jf_info: "",
        charge_mode: "",
        // self_company_id: '',
      },
      productDetailFormRules: {
        name: [{ required: true, message: "请输入", trigger: "blur" }],
        brief: [{ required: true, message: "请输入", trigger: "blur" }],
        company_name: [{ required: true, message: "请输入", trigger: "blur" }],
        image: [{ required: true, message: "请输入", trigger: "blur" }],
        // province: [{ required: true, message: "请输入", trigger: "blur" }],
        jf_mode: [{ required: true, message: "请选择", trigger: "blur" }],
        jf_info: [{ required: true, message: "请输入", trigger: "blur" }],
        charge_mode: [{ required: true, message: "请输入", trigger: "blur" }],
        shipping: [
          { required: true, message: "请输入", trigger: "blur" },
          { min: 1, max: 50, message: "请输入50个字符以内", trigger: "change" },
        ],
        // is_online_pay: [{ required: true, message: '请选择', trigger: 'blur' }],
        // self_company_id: [
        //   { required: true, message: '请选择', trigger: 'blur' },
        // ],
      },
      typeForm: {
        // 选中的属性
        attr: [],
        otherAttr: [],
      },
      GoodsCategoryLevel1: [],
      level1ActiveId: 0,
      level1ActiveName: "",
      GoodsCategoryLevel2: [],
      level2ActiveId: 0,
      level2ActiveName: "",
      GoodsCategoryLevel3: [],
      level3ActiveId: 0,
      level3ActiveName: "",
      productAttr: [], // 商品属性
      newAttrName: "",
      otherAttr: [], // 其他属性
      AllAttrList: [], // 选中的属性
      unitList: [], // 单位列表
      stockStatus: [], // 库存状态
      OnSaleList: [], //
      SkuTableData: [],
      popoverVisible: false,
      customToolbar: [
        [{ header: [false, 1, 2, 3, 4, 5, 6] }],
        [
          "bold",
          "italic",
          "underline",
          "strike",
          { align: "" },
          { align: "center" },
          { align: "right" },
          { align: "justify" },
        ],
        [{ background: [] }, { color: [] }],
        ["image"],
      ],
      SkuExcelFileList: [],
      attrHeader: [],
      importing: false,
      areaOption: [], // 销售区域列表
      selectedAreaList: [], //已选的区域列表
      feeSet: 1,
      sellAreaAndFeeForm: {
        area: [],
        freight_price: "",
        freight_type: 1,
      }, // 区域和运费表单
      sellAreaAndFeeFormRules: {},
      areafeeData: [],
      selfStoreOptions: [], // 自营店铺下拉选
      allCountry: true,
    };
  },
  components: { colTable },
  computed: {
    ...mapState(["token", "userInfo"]),
  },
  async mounted() {
    await this.getCityRegion();
    await this.getselectSelfCompany();
    await this.getGoodsSaleArea(this.$route.query.id);
    if (this.$route.query.id) {
      this.stepIndex = 2;
      await this.getSKUStateSelect();
      await this.getProductDetails(this.$route.query.id);
    } else {
      this.selectGoodsCategory("", 0, 0);
      // 默认选择全国
      this.allArea(true);
    }

    this.productDetailForm.company_id = this.userInfo.company_id;
    this.productDetailForm.company_name = this.userInfo.company_name;
  },
  methods: {
    getProductDetails(id) {
      return this.$request
        .get(Api.goodsGetDetailsInfo, { params: { id } })
        .then(async (res) => {
          console.log(res);
          if (res.code === 0) {
            const {
              name,
              brief,
              category_title,
              cat_id,
              describe,
              image,
              province_id,
              city_id,
              shipping,
              sku,
              id,
              price_desc,
              is_online_pay,
              freight_type,
              freight_price,
              market_area,
              sort,
              jf_mode,
              jf_info,
              charge_mode,
              goods_cert_arr,
              // self_company_id
            } = res.data;
            this.productDetailForm.jf_mode = jf_mode;
            this.productDetailForm.jf_info = jf_info;
            this.productDetailForm.charge_mode = charge_mode;
            this.productDetailForm.id = id;
            this.productDetailForm.name = name;
            this.productDetailForm.brief = brief;
            this.productDetailForm.describe = describe;
            this.productDetailForm.price_desc = price_desc;
            this.productDetailForm.is_online_pay = is_online_pay + "";
            this.productDetailForm.sort = sort;
            // 回显销售区域表单
            this.sellAreaAndFeeForm.freight_type = freight_type;
            this.sellAreaAndFeeForm.freight_price = freight_price;
            // this.sellAreaAndFeeForm.self_company_id = self_company_id
            if (market_area) {
              this.sellAreaAndFeeForm.area = market_area.map(
                (item) => item * 1
              );
            }
            this.areaChange(this.sellAreaAndFeeForm.area);

            const titleArr = category_title.split(">");
            if (titleArr.length === 3) {
              this.level1ActiveName = titleArr[0];
              this.level2ActiveName = titleArr[1];
              this.level3ActiveName = titleArr[2];
              this.level3ActiveId = cat_id;
            }

            this.fileList = (image || []).map((item) => ({
              ...item,
              url: item.img_url,
            }));

            this.fileList2 = (goods_cert_arr || []).map((item) => ({
              ...item,
              url: item.img_url,
            }));

            this.productDetailForm.province = [province_id, city_id];
            this.productDetailForm.shipping = shipping;
            this.SkuTableData = sku;
            await this.selelctGoodsAttribute(cat_id);
            await this.selelctGoodsOtherAttribute(id);
            let settimer = setTimeout(() => {
              this.$refs.colTable.setTableData();
              settimer && clearTimeout(settimer);
            }, 500);
            // 回填勾选属性
            if (
              this.SkuTableData.length > 0 &&
              this.SkuTableData[0] &&
              this.SkuTableData[0].sku_attr
            ) {
              const AllAttrName = this.SkuTableData[0].sku_attr.map(
                (item) => item.attr_name
              );

              const AllAttrId = this.SkuTableData[0].sku_attr.map(
                (item) => item.attr_id
              );

              this.AllAttrList = this.SkuTableData[0].sku_attr;

              // 分类属性
              this.productAttr.forEach((item) => {
                if (AllAttrId.includes(item.attr_id)) {
                  this.typeForm.attr.push(item.attr_id);
                }
              });
              this.otherAttr.forEach((item) => {
                if (AllAttrName.includes(item.attr_name)) {
                  this.typeForm.otherAttr.push(item.attr_id);
                }
              });
            }
          }
        });
    },
    // 获取商品销售区域
    getGoodsSaleArea(id) {
      return this.$request
        .get(Api.getSalesArea, { params: { goods_id: id } })
        .then((res) => {
          this.areaOption = res.data;
        });
    },
    getselectSelfCompany() {
      return this.$request.get(Api.selectSelfCompany).then((res) => {
        if (res.code === 0) {
          this.selfStoreOptions = res.data;
        }
      });
    },
    getCityRegion() {
      return this.$request
        .get(Api.getCity, { params: { level: 2 } })
        .then((res) => {
          console.log(res);
          if (res.code === 0) {
            this.cityOptions = res.data;
          }
        });
    },
    // 获取三级商品分类
    selectGoodsCategory(id = "", i, level) {
      return this.$request
        .get(Api.selectGoodsCategory, { params: { category_id: id } })
        .then((res) => {
          if (res.code === 0) {
            if (level === 0) {
              this.GoodsCategoryLevel1 = res.data;
            }
            if (level === 1) {
              this.level1ActiveId = id;
              this.level1ActiveName = this.GoodsCategoryLevel1.find(
                (item) => item.id === id
              ).name;
              this.GoodsCategoryLevel2 = res.data;
              this.GoodsCategoryLevel3 = [];
              this.level2ActiveId = -1;
              this.level2ActiveName = "";
              this.level3ActiveId = -1;
              this.level3ActiveName = "";
            }
            if (level === 2) {
              this.level2ActiveId = id;
              this.level2ActiveName = this.GoodsCategoryLevel2.find(
                (item) => item.id === id
              ).name;
              this.GoodsCategoryLevel3 = res.data;
              this.level3ActiveId = -1;
              this.level3ActiveName = "";
            }
            if (level === 3) {
              this.level3ActiveId = id;
              this.level3ActiveName = this.GoodsCategoryLevel3.find(
                (item) => item.id === id
              ).name;
            }
          }
        });
    },
    // 获取商品属性
    selelctGoodsAttribute(id) {
      return this.$request
        .get(Api.selelctGoodsAttribute, { params: { category_id: id } })
        .then((res) => {
          if (res.code === 0) {
            this.productAttr = res.data.map((item) => ({
              attr_id: item.id,
              attr_name: item.name,
            }));
          }
        });
    },
    // 获取商品其他属性
    selelctGoodsOtherAttribute(id) {
      return this.$request
        .get(Api.selelctGoodsOtherAttribute, { params: { goods_id: id } })
        .then((res) => {
          if (res.code === 0) {
            this.otherAttr = res.data.map((item) => ({
              attr_id: item.id,
              attr_name: item.other_attr_name,
            }));
          }
        });
    },
    // 获取下拉选
    getSKUStateSelect() {
      return this.$request.get(Api.getSKUStateSelect).then((res) => {
        if (res.code === 0) {
          this.unitList = res.data.unit;
          this.stockStatus = res.data.stock_status;
          this.OnSaleList = res.data.is_on_sale;
        }
      });
    },
    // 批量发布按钮
    manyPublish() {
      if (this.level3ActiveName !== "") {
        this.popoverVisible = true;
      } else {
        this.$message.warning("请选择分类");
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
    // 确认导入按钮
    sureImport() {
      if (this.excelList.length === 0) {
        this.$message.error("请选择文件");
        return;
      }
      const file = this.excelList[0].raw;
      const formData = new FormData();
      formData.append("file", file, file.name);
      const uploadConfig = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      this.$request
        .post(
          Api.goodsGoodsImport + "?category_id=" + this.level3ActiveId,
          formData,
          uploadConfig
        )
        .then((res) => {
          if (res.code === 0) {
            this.$message.success(res.msg);
            this.popoverVisible = false;
            this.excelList = [];
          } else {
            this.$message.error(res.msg);
            this.excelList = [];
          }
        });
    },
    exportTemplate() {
      const link = document.createElement("a");
      link.style.display = "none";
      link.href = `${
        this.$request.defaults.baseURL + Api.goodsGoodsDownload
      }?category_id=${this.level3ActiveId}&token=${this.token}`;
      link.target = "download";
      link.setAttribute("download", "模板.xls");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    addSkuAttrCol() {
      // 勾选的所有属性
      const checkAttr = this.productAttr.filter((item) => {
        return this.typeForm.attr.includes(item.attr_id);
      });
      const checkOtherAttr = this.otherAttr.filter((item) => {
        return this.typeForm.otherAttr.includes(item.attr_id);
      });
      this.AllAttrList = [...checkAttr, ...checkOtherAttr];

      const uncheckAttr = this.productAttr.filter((item) => {
        return !this.typeForm.attr.includes(item.attr_id);
      });
      const uncheckOtherAttr = this.otherAttr.filter((item) => {
        return !this.typeForm.otherAttr.includes(item.attr_id);
      });

      const unAttrList = [...uncheckAttr, ...uncheckOtherAttr];

      console.log("unAttrList", unAttrList);

      this.$refs.colTable.createHeader(this.AllAttrList);

      this.$refs.colTable.clearCol(unAttrList);

      // this.AllAttrList.forEach((item) => {
      //   this.$refs.colTable.addCol(item.attr_name, item.attr_id, item.id)
      // })

      // this.$refs.colTable.addCol(this.AllAttrList)
    },
    // 添加规格型号
    addSku() {
      this.$refs.colTable.addRow();
    },
    deleteSku(row) {
      this.SkuTableData.forEach((item, i) => {
        if (item.id === row.id) {
          this.SkuTableData.splice(i, 1);
        }
      });
    },
    // 下一步
    nestStep() {
      if (this.level3ActiveId <= 0) {
        this.$message.warning("请选择三级分类");
        return;
      }
      this.stepIndex = 2;
      this.selelctGoodsAttribute(this.level3ActiveId);
      this.getSKUStateSelect();
      this.getTemplate();
      setTimeout(() => { //默认添加一行数据
        this.addSku();
      }, 1500);
    },
    //上传产品资质
    uploadProductImage2(file, fileList) {
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
      formData.append("file", file.raw, file.name);
      formData.append("dir", "SpuImage");
      const uploadConfig = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      this.$request
        .post(Api.uploadImage, formData, uploadConfig)
        .then((res) => {
          if (res.code === 0) {
            file.url = res.data.img_path;
            file.img = res.data.img;
            file.name = res.data.img;
            file.status = "success";
            this.fileList2 = fileList;
          } else {
            fileList.forEach((item, i) => {
              if (item.uid === file.uid) {
                fileList.splice(i, 1);
              }
            });
            this.fileList2 = fileList;
            this.$message({
              message: res.msg,
              type: "error",
            });
          }
        });
    },
    // 上传商品图片
    uploadProductImage(file, fileList) {
      console.log(file, fileList);
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
      formData.append("file", file.raw, file.name);
      formData.append("dir", "SpuImage");
      const uploadConfig = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      this.$request
        .post(Api.uploadImage, formData, uploadConfig)
        .then((res) => {
          if (res.code === 0) {
            // const data = res.data
            // data.uid = file.uid
            file.url = res.data.img_path;
            file.img = res.data.img;
            file.name = res.data.img;
            file.status = "success";
            this.fileList = fileList;
          } else {
            fileList.forEach((item, i) => {
              if (item.uid === file.uid) {
                fileList.splice(i, 1);
              }
            });
            this.fileList = fileList;
            this.$message({
              message: res.msg,
              type: "error",
            });
          }
        });
    },
    // 商品图片超出限制
    handleProductImageExceed() {
      this.$message.warning(`最多上传5张商品图片`);
    },
    // 删除
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    handleRemove2(file, fileList) {
      this.fileList2 = fileList;
    },
    // 预览已上传的文件
    handlePreview(file) {
      console.log(file, "file");

      this.previewImageUrl = file.url;
      this.previewVisible = true;
    },
    AddOtherAttr() {
      if (this.newAttrName === "") {
        this.$message.warning("请输入属性名称");
        return;
      }

      const uid = Math.floor(Math.random() * 1000);
      const new_attr_uid = `new_other_${uid}`;

      this.otherAttr.push({
        attr_name: this.newAttrName,
        attr_id: new_attr_uid,
      });

      this.newAttrName = "";
    },
    getTemplate() {
      this.$request.get(Api.getGoodsBriefTpl).then((res) => {
        this.productDetailForm.describe = res.data.desc;
      });
    },
    handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      console.log(file);
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
      formData.append("dir", "SpuImage");

      const uploadConfig = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      this.$request
        .post(Api.uploadImage, formData, uploadConfig)
        .then((result) => {
          const url = result.data.img_path; // Get url from response
          Editor.insertEmbed(cursorLocation, "image", url);
          resetUploader();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    areaChange(value) {
      let currAreaId = [];
      currAreaId = this.areafeeData.map((item) => item.id);
      currAreaId.forEach((id, i) => {
        if (!value.includes(id)) {
          this.areafeeData.splice(i, 1);
        }
      });
      value.forEach((id) => {
        if (!currAreaId.includes(id)) {
          var provinceObj = this.areaOption.find((item) => item.id === id);
          if (this.sellAreaAndFeeForm.freight_type == 3) {
            this.areafeeData.push({
              id: provinceObj.id,
              name: provinceObj.name,
              price: this.sellAreaAndFeeForm.freight_price,
            });
          } else {
            this.areafeeData.push({
              id: provinceObj.id,
              name: provinceObj.name,
              price: provinceObj.price,
            });
          }
        }
      });
    },
    // 销售区域选择
    allArea(val) {
      if (val) {
        this.sellAreaAndFeeForm.area = this.areaOption.map((item) => item.id);
        this.areaChange(this.sellAreaAndFeeForm.area);
      } else {
        this.sellAreaAndFeeForm.area = [];
        this.areafeeData = [];
      }
    },
    removeArea(value) {
      this.allCountry = false;
      let currAreaId = [];
      currAreaId = this.areafeeData.map((item) => item.id);
      currAreaId.forEach((id, i) => {
        if (id === value) {
          this.areafeeData.splice(i, 1);
        }
      });
    },
    // 获取页面全部数据
    getSpuData() {
      const params = this.productDetailForm;

      const SkuData = this.$refs.colTable.getData();
      params.area = this.areafeeData.map((item) => {
        // 销售区域
        return {
          id: item.id,
          price: item.price,
        };
      });
      params.freight_price = this.sellAreaAndFeeForm.freight_price; // 运费价格
      params.freight_type = this.sellAreaAndFeeForm.freight_type; // 运费类型
      params.delete_sku_ids = this.$refs.colTable.delete_sku_ids;
      params.cat_id = this.level3ActiveId;
      if (params.province.length !== 0) {
        params.province_id = params.province[0];
        params.city_id = params.province[1];
      } else {
        params.province_id = "";
        params.city_id = "";
      }

      params.image = this.fileList.map((item) => item.img);
      params.goods_cert = this.fileList2.map((item) => item.img).join(",");
      SkuData.forEach((item) => {
        if (item.sku_attr) {
          item.sku_attr.forEach((item) => {
            delete item.id;
          });
        } else {
          this.$set(item, "sku_attr", []);
        }
      });
      params.sku = SkuData;
      console.log("params==>", params);
      return params;
    },

    saveSku() {
      const params = this.getSpuData();
      if (
        params.name ||
        params.province_id ||
        params.city_id ||
        params.shipping ||
        params.image.length !== 0 ||
        params.brief ||
        params.describe ||
        params.sku.length !== 0
      ) {
        if (params) {
          this.$request.post(Api.goodsSave, params).then((res) => {
            if (res.code === 0) {
              this.$message.success(res.msg);
              this.SkuTableData = [];
              this.getProductDetails(res.data);
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      } else {
        return this.$message.warning("保存时至少填写一项");
      }
    },
    publishSku() {
      const params = this.getSpuData();
      if (params.name === "") {
        this.$message.error("请输入商品名称");
        return;
      }
      if (params.brief === "") {
        this.$message.error("请输入商品描述");
        return;
      }

      if (params.image.length === 0) {
        this.$message.error("请添加商品图片");
        return;
      }

      if (!params.jf_mode) {
        this.$message.error("请选择交付方式");
        return;
      }
      if (!params.jf_info) {
        this.$message.error("请输入交付信息");
        return;
      }
      if (!params.charge_mode) {
        this.$message.error("请输入计费方式");
        return;
      }

      if (!params.image.length) {
        this.$message.error("请添加商品资质");
        return;
      }

      if (params.sku.length === 0) {
        this.$message.error("请添加商品规格型号");
        return false;
      }
      if (params.area.length === 0) {
        this.$message.error("请选择销售区域");
        return false;
      }
      if (params) {
        this.$request.post(Api.goodsRelease, params).then((res) => {
          if (res.code === 0) {
            this.$message.success(res.msg);
            this.stepIndex = 3;
            this.timer = setInterval(() => {
              this.seconds--;
              if (this.seconds <= 0) {
                this.timer && clearInterval(this.timer);
                this.timer = null;
                this.seconds = 5;

                // 重置页面数据
                this.resetPage();
              }
            }, 1000);
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    },

    continuRelease() {
      window.location.reload();
    },
    gotoStore() {
      this.$router.push("/storeManagement/productStore");
    },
    freightPriceChange(value) {
      if (this.sellAreaAndFeeForm.freight_type == 3) {
        this.areafeeData.forEach((item) => {
          item.price = value;
        });
      }
    },
    freightTypeChange(value) {
      if (value == 2) {
        this.areafeeData.forEach((selectedCity) => {
          var provinceObj = this.areaOption.find(
            (item) => item.id === selectedCity.id
          );
          selectedCity.price = provinceObj.price;
        });
      }
      if (value == 3) {
        this.freightPriceChange(this.sellAreaAndFeeForm.freight_price);
      }
    },
    resetPage() {
      this.previewVisible = false;
      this.showChangeSort = false;
      this.previewImageUrl = "";
      this.stepIndex = 1;
      this.seconds = 5;
      this.timer = null;
      this.productDetails = {};
      this.excelList = []; // 上传文件列表
      this.fileList = [];
      this.fileList2 = [];
      this.productDetailForm = {
        id: "",
        name: "",
        company_name: "",
        province: [],
        province_id: "",
        city_id: "",
        shipping: "", // 配送说明
        image: [],
        brief: "",
        describe: "",
        sku: [],
      };
      this.typeForm = {
        // 选中的属性
        attr: [],
        otherAttr: [],
      };
      this.productAttr = []; // 商品属性
      this.newAttrName = "";
      this.otherAttr = []; // 其他属性
      this.AllAttrList = []; // 选中的属性
      this.SkuTableData = [];
      this.popoverVisible = false;
      this.selectGoodsCategory("", 0, 0);
      this.getCityRegion();
      this.productDetailForm.company_id = this.userInfo.company_id;
      this.productDetailForm.company_name = this.userInfo.company_name;
    },
    downloadSkuTemp() {
      // console.log(this.$refs.colTable.$refs.table.columns);
      let h = this.$refs.colTable.$refs.table.columns.map((item) => item.label);
      h.splice(-1, 1); // 删除最后一个操作列
      const header = { header: h };
      const data = [];
      const xlsxName = `${this.level3ActiveName}导入模板`;
      const ws = this.$xlsx.utils.json_to_sheet(data, header);
      const wb = this.$xlsx.utils.book_new();
      this.$xlsx.utils.book_append_sheet(wb, ws, xlsxName);
      this.$xlsx.writeFile(wb, xlsxName + ".xlsx");
    },
    chooseSkuExcel(file, fileList) {
      const that = this;
      const reader = new FileReader();
      reader.onload = function (e) {
        const bstr = e.target.result;
        const workbook = that.$xlsx.read(bstr, { type: "binary" });
        const wsname = workbook.SheetNames[0];
        const ws = workbook.Sheets[wsname];
        console.log(ws);
        const data = that.$xlsx.utils.sheet_to_json(ws, { header: 1 });
        // console.log('data', data);
        that.excelDataToTableData(data);
      };
      reader.readAsBinaryString(file.raw);
      this.SkuExcelFileList = [];
    },
    // excel表中的数据转成colTable组件需要的数据
    excelDataToTableData(data) {
      const that = this;
      let tableheader = this.$refs.colTable.$refs.table.columns.map(
        (item) => item.label
      ); // 页面表格上的标题
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
            console.log(tableheader);
            console.log(row);
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
            const obj = {
              sku_attr: [],
            };
            for (const key in headerIndex) {
              // 拿出excel里
              if (Object.hasOwnProperty.call(headerIndex, key)) {
                const k = headerIndex[key];
                switch (key) {
                  case "销售价":
                    if (isNaN(row[k])) {
                      throw new Error(`第${i + 1}行销售价不是数值`);
                    }
                    obj.sku_shop_price = row[k];
                    break;
                  case "成本价":
                    if (isNaN(row[k])) {
                      throw new Error(`第${i + 1}行成本价不是数值`);
                    }
                    obj.sku_cost_price = row[k];
                    break;
                  case "起订量":
                    if (isNaN(row[k])) {
                      throw new Error(`第${i + 1}行起订量不是数值`);
                    }
                    obj.min_sale = row[k];
                    break;
                  case "单位":
                    {
                      const name = row[k];
                      const Unit = that.unitList.find(
                        (item) => item.name === name
                      );
                      if (Unit) {
                        obj.unit = Unit.id;
                      } else {
                        throw new Error(`第${i + 1}行单位填写错误`);
                      }
                    }
                    break;
                  case "库存状态":
                    {
                      const name = row[k];
                      const status = that.stockStatus.find(
                        (item) => item.name === name
                      );
                      if (status) {
                        obj.stock_status = status.id;
                      } else {
                        throw new Error(`第${i + 1}行库存状态填写错误`);
                      }
                    }
                    break;
                  case "上架状态":
                    {
                      const name = row[k];
                      const onSale = that.OnSaleList.find(
                        (item) => item.name === name
                      );
                      if (onSale) {
                        obj.is_on_sale = onSale.id;
                      } else {
                        throw new Error(`第${i + 1}行上架状态填写错误`);
                      }
                    }
                    break;
                  default:
                    {
                      // 如果不是以上固定列，则是属性
                      if (tableheader.includes(key)) {
                        const attr = that.AllAttrList.find(
                          (all) => all.attr_name === key
                        );
                        if (attr) {
                          obj.sku_attr.push({
                            attr_id: attr.attr_id,
                            attr_name: key,
                            attr_value: row[k],
                          });
                        }
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
      this.SkuTableData = this.SkuTableData.concat(tableData);

      let settimer = setTimeout(() => {
        this.$refs.colTable.setTableData();
        settimer && clearTimeout(settimer);
        this.importing = false;
      }, 500);
    },
  },
};
</script>
<style lang="less" scoped>
.publish-product-page {
  background-color: #fff;
  padding: 20px;
  box-sizing: border-box;

  .title {
    font-weight: bold;
    font-size: 18px;
    color: #0a1833;
    line-height: 21px;
  }

  .choose-sort {
    display: flex;

    .level {
      width: 260px;
      height: 460px;
      overflow-y: auto;
      background: #ffffff;
      border: 1px solid #eaebf0;
      border-right: none;

      &:nth-last-of-type(1) {
        border-right: 1px solid #eaebf0;
      }

      li {
        font-size: 16px;
        color: #0a1833;
        line-height: 24px;
        margin-top: 10px;
        padding: 13px;
        display: flex;
        justify-content: space-between;
        cursor: pointer;

        &.active {
          background: rgba(37, 127, 248, 0.06);
        }
      }
    }
  }

  .sort-res {
    margin: 20px 0;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .container {
    width: 950px;
    display: flex;
    flex-direction: column;
  }

  .detail-title {
    font-size: 14px;
    font-family: Microsoft YaHei, Microsoft YaHei-Bold;
    font-weight: 700;
    text-align: left;
    color: #353535;
    border-bottom: 1px solid #efefef;
    padding: 10px;
    margin-bottom: 20px;
  }

  .detail-form {
    width: 420px;
  }

  .publish-success {
    .img {
      width: 120px;
      height: 120px;
      background-image: url("../../assets/images/seller/success.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }

    .text {
      font-size: 16px;
      font-family: Microsoft YaHei, Microsoft YaHei-Bold;
      font-weight: 700;
      text-align: center;
      color: #ffbd07;
      margin: 10px 0;
    }

    .tips {
      font-size: 12px;
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      font-weight: 400;
      text-align: center;
      color: #353535;
      margin: 0 0 50px;
    }
  }

  .btn-group {
    display: flex;

    .normal-btn {
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
      margin: 0 10px;
    }

    .many-publish {
      width: 120px;
      height: 40px;
      background: #ffffff;
      border: 1px solid #4186fa;
      border-radius: 2px;
      font-size: 14px;
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      font-weight: 400;
      text-align: center;
      color: #2277e8;
      line-height: 40px;
      margin-right: 20px;
      cursor: pointer;
    }

    .next {
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
      border: 1px solid #4186fa;
      cursor: pointer;
    }
  }

  .newAttrInput {
    width: 88px;

    :deep(.el-input__inner) {
      width: 88px;
      height: 24px;
      background: #ffffff;
      border: 1px solid #d5d5d5;
      border-radius: 2px;
    }
  }

  .createProduct {
    padding: 6px 8px;
    text-align: center;
    background: #fff;
    border: 1px solid #d5d5d5;
    border-radius: 2px;
    color: #353535;
    font-size: 12px;
    margin-left: 10px;
  }

  :deep(.el-table .cell) {
    padding-left: 2px;
    padding-right: 2px;
  }
}

.step {
  margin-top: 17px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 20px;

  .step-item {
    width: 313px;
    height: 46px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url("../../assets/images/register/step_arrow@2x.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    font-size: 16px;
    color: #353535;
    margin-right: 20px;

    &.active {
      background-image: url("../../assets/images/register/step_arrow_active@2x.png");
      color: #ffffff;
      line-height: 18px;
    }
  }
}

.save-btn {
  padding: 10px 40px;
  background: #ffffff;
  border: 1px solid #d5d5d5;
  border-radius: 2px;
  color: #353535;
  line-height: unset;
}

.pub-btn {
  padding: 10px 40px;
  border-radius: 2px;
  color: #fff;
  background: #2277e8;
  border-radius: 2px;
  line-height: unset;
}

.change-sort-btn {
  color: #4186fa;
  font-size: 12px;
  cursor: pointer;
  margin-left: 10px;
}

.sellarea-fee-form {
  :deep(.el-radio-group) {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 600px;
  }
}
</style>
