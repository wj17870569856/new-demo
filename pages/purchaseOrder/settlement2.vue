<template>
  <div class="wrap">
    <div class="content">
      <div class="settlement-page">
        <!-- 收货人信息 -->
        <el-collapse v-model="receiveNames">
          <el-collapse-item title="收货人信息" name="1">
            <template slot="title">
              <div>
                <span>收货人信息</span>
              </div>
              <div v-show="receiveNames !== '1'">
                <span>{{ addressSelected.pcd_address }}</span>
                <span style="padding: 0 20px"></span>
                <span>{{ addressSelected.consignee }}</span>
                <span>{{ addressSelected.mobile }}</span>
              </div>
            </template>
            <div class="receive-info-container">
              <div
                class="receive-info"
                :class="addressSelected.id === address.id ? 'active' : ''"
                v-for="(address, i) in addressList"
                :key="i"
                @click="selectAddress(i, address)"
              >
                <div class="text-ellipsis-2">{{ address.pcd_address }}</div>
                <div class="name-tel">
                  <div>{{ address.consignee }}</div>
                  <div>{{ address.mobile }}</div>
                </div>
                <div class="edit-btn" @click.stop="editAddress(address)">修改></div>
              </div>

              <div class="btn">
                <el-button type="text" @click="addNewAddress">新增收货地址</el-button>
                <el-button type="text" @click="chooseOtherAddress">选择其他地址</el-button>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
        <!-- 发票信息 -->
        <el-collapse v-model="invoiceNames">
          <el-collapse-item title="发票信息" name="1" disabled>
            <template slot="title">
              <div>
                <span>发票信息</span>
                <el-checkbox
                  v-model="is_open_invoice"
                  :true-label="1"
                  :false-label="0"
                  style="margin-left: 40px"
                  @change="openInvoice"
                >开发票</el-checkbox>
              </div>
              <!-- <div v-show="is_open_invoice===1">
                <span>{{ billHeaderSelected.inv_type_name }}</span>
                <span style="padding: 0 20px"></span>
                <span>{{ billHeaderSelected.title }}</span>
              </div>-->
            </template>
            <div class="invoice-info-container">
              <div
                class="invoice-info"
                :class="billHeaderSelected.id === billHeader.id ? 'active' : ''"
                v-for="(billHeader, i) in billHeaderList"
                :key="i"
                @click="selectbillHeader(i, billHeader)"
              >
                <div class="type">{{ billHeader.inv_type_name }}</div>
                <div class="text-ellipsis-2">{{ billHeader.title }}</div>
                <!-- <div>{{ billHeader.address }}</div> -->
                <div class="edit-btn" @click.stop="editInvoiceEdit(billHeader)">修改></div>
              </div>
              <div class="btn">
                <el-button type="text" @click="addBillHeader">新增发票抬头</el-button>
                <el-button type="text" @click="chooseOtherBillHeader">选择其他发票抬头</el-button>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
        <!-- 产品信息 -->
        <el-collapse v-model="productNames">
          <el-collapse-item title="产品信息" name="1" disabled>
            <div v-for="(store, i) in orderProductList" :key="i" class="store-item">
              <div class="header">
                <div class="store">
                  店铺：
                  <span @click="gotoStoreDetails(store.shop_id)">
                    {{
                    store.shop_name
                    }}
                  </span>
                </div>
                <div>
                  商品金额：
                  <span class="price">￥{{ store.goods_amount }}</span>
                </div>
                <div>
                  运费：
                  <span class="price">
                    {{
                    store.shipping_amount != 0
                    ? `￥${store.shipping_amount}`
                    : "待定"
                    }}
                  </span>
                </div>
              </div>
              <div class="product-list">
                <div class="left">
                  <div
                    v-for="pro in store.children"
                    :key="pro.id"
                    class="row"
                    :class="addressSelected.pcd &&pro.market_area_name.includes(addressSelected.pcd[0])? '': 'gray_row'"
                  >
                    <img
                      :src="pro.image"
                      alt
                      style="width: 64px; height: 64px"
                      @click="gotoDetails(pro.sku_id)"
                    />
                    <div class="summary" @click="gotoDetails(pro.sku_id)">
                      <div class="desc">{{ pro.goods_name }}</div>
                      <div class="type">{{ pro.attr_name }}</div>
                    </div>
                    <div
                      class="price-single"
                      v-if="
                        addressSelected.pcd &&
                        pro.market_area_name.includes(addressSelected.pcd[0])
                      "
                    >￥{{ pro.sku_shop_price }}</div>
                    <div
                      class="count"
                      v-if="
                        addressSelected.pcd &&
                        pro.market_area_name.includes(addressSelected.pcd[0])
                      "
                    >
                      x
                      {{ Number(pro.number) }}
                    </div>
                    <div
                      class="price-total"
                      v-if="
                        addressSelected.pcd &&
                        pro.market_area_name.includes(addressSelected.pcd[0])
                      "
                    >
                      <span v-if="pro.sku_shop_price != 0">
                        ￥{{
                        (pro.sku_shop_price * pro.number * 1).toFixed(2)
                        }}
                      </span>
                      <span v-else>电议</span>
                    </div>
                    <div
                      style="text-align: center; line-height: 7; width: 300px"
                      v-if="
                        addressSelected.pcd &&
                        !pro.market_area_name.includes(addressSelected.pcd[0])
                      "
                    >商品不支持配送该区域</div>
                  </div>
                </div>
                <div class="right">
                  <el-input type="textarea" v-model="store.postscript" placeholder="请输入内容"></el-input>
                </div>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
        <div class="total-msg">
          <div>
            <span>总商品金额：</span>
            <span class="num">{{ proTotalPrice }}</span>
          </div>
          <div>
            <span>运费：</span>
            <span class="num">
              {{
              shippingPrice != 0 ? `￥${shippingPrice}` : "待定"
              }}
            </span>
          </div>
        </div>
        <!-- 底部按钮 -->
        <div class="bottom-btn-group">
          <div class="total-info">
            <div>
              <span class="total-count">{{ proTotalCount }}</span>
              <span>件商品 预估价:</span>
              <span class="total-price">￥{{ orderTotalPrice }}</span>
            </div>
            <div>订单费用按照实际发货计算</div>
          </div>
          <el-tooltip
            class="item"
            effect="dark"
            content="请提交公司认证信息"
            placement="top-start"
            v-if="
              userInfo.status == 3 ||
              userInfo.status == 4 ||
              userInfo.status == 5
            "
          >
            <div class="submit-order-btn-disable" @click="submitOrder">提交订单</div>
          </el-tooltip>
          <div v-else class="submit-order-btn" @click="submitOrder">提交订单</div>
        </div>
      </div>
    </div>

    <!-- 弹框 -->
    <!-- 新增地址弹框 -->
    <el-dialog
    :close-on-click-modal="false"
      title="新增收货地址"
      :visible.sync="newAddressFormVisible"
      width="540px"
      center
      class="add-new-address-dialog"
    >
      <el-form
        ref="newAddressForm"
        :model="newAddressForm"
        :rules="newAddressFormRules"
        label-width="100px"
      >
        <el-form-item label="所在地区" prop="region">
          <el-cascader
            style="width: 100%"
            v-model="newAddressForm.region"
            :options="options"
            @change="handleRegionChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="newAddressForm.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="收货人" prop="consignee">
          <el-input v-model="newAddressForm.consignee" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系号码" prop="mobile">
          <el-input v-model="newAddressForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="设为默认地址" prop="is_default">
          <el-radio-group v-model="newAddressForm.is_default">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="cancel-btn" @click="newAddressFormVisible = false">取 消</el-button>
        <el-button type="primary" class="save-btn" @click="postAddress">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 新增发票抬头 -->
    <el-dialog
    :close-on-click-modal="false"
      title="新增发票抬头"
      :visible.sync="newBillHeaderFormVisible"
      width="540px"
      center
      class="add-new-billheader-dialog"
    >
      <el-form
        ref="newBillHeaderForm"
        :model="newBillHeaderForm"
        :rules="newBillHeaderFormRules"
        label-width="80px"
      >
        <el-form-item label="发票" prop="inv_type">
          <el-radio-group v-model="newBillHeaderForm.inv_type" @input="invTypeChange">
            <el-radio :label="1">普通发票</el-radio>
            <el-radio :label="2">增值税专用发票</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="类型" prop="is_company">
          <el-radio-group v-model="newBillHeaderForm.is_company" @input="comTypeChange">
            <el-radio :label="0" :disabled="newBillHeaderForm.inv_type === 2">个人</el-radio>
            <el-radio :label="1">企业</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发票抬头" prop="title">
          <el-input v-model="newBillHeaderForm.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="tel" v-if="newBillHeaderForm.is_company === 0">
          <el-input v-model="newBillHeaderForm.tel" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="税号" prop="tax_no" v-if="newBillHeaderForm.is_company === 1">
          <el-input v-model="newBillHeaderForm.tax_no" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="注册地址" prop="address" v-if="newBillHeaderForm.is_company === 1">
          <el-input v-model="newBillHeaderForm.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="开户银行" prop="bank" v-if="newBillHeaderForm.is_company === 1">
          <el-input v-model="newBillHeaderForm.bank" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="银行账号" prop="bank_no" v-if="newBillHeaderForm.is_company === 1">
          <el-input v-model="newBillHeaderForm.bank_no" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="注册电话" prop="tel" v-if="newBillHeaderForm.is_company === 1">
          <el-input v-model="newBillHeaderForm.tel" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="cancel-btn" @click="newBillHeaderFormVisible = false">取 消</el-button>
        <el-button type="primary" class="save-btn" @click="postInvoiceEdit">保 存</el-button>
      </div>
    </el-dialog>

    <!-- 选择其他地址 -->
    <el-dialog
    :close-on-click-modal="false"
      title="选择收货地址"
      :visible.sync="otherAddressTableVisible"
      width="860px"
      center
      class="other-address-dialog"
    >
      <el-table
        :data="addressTableData"
        @row-click="clickRowAddress"
        style="width: 100%"
        stripe
        :header-row-style="{ background: 'rgba(137,147,165,0.06)' }"
        height="450"
        :header-cell-style="{
          background: 'transparent',
          color: '#353535',
          fontSize: '14px',
        }"
        align="center"
      >
        <el-table-column prop="pcd_address" label="收货地址" align="center"></el-table-column>
        <el-table-column prop="consignee" label="收货人" align="center" width="120px"></el-table-column>
        <el-table-column prop="mobile" label="联系电话" align="center" width="150px"></el-table-column>
        <el-table-column prop="is_default" label="是否默认地址" align="center" width="120px">
          <template slot-scope="scope">
            <span>{{ scope.row.is_default == 1 ? "是" : "否" }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              style="color: #353535"
              @click.native.prevent.stop="editAddress(scope.row)"
            >修改</el-button>
            <el-popconfirm
              :title="`确定删除？`"
              hide-icon
              confirm-button-text="取消"
              cancel-button-text="删除"
              popper-class="popper-delete"
              @cancel="deleteAddress(scope.row.id)"
            >
              <el-button
                slot="reference"
                @click.stop
                size="mini"
                type="text"
                style="color: #353535"
              >删除</el-button>
            </el-popconfirm>
            <el-button
              v-if="scope.row.is_default === 0"
              type="text"
              size="small"
              @click.native.prevent.stop="setDefaultAddress(scope.row)"
              style="color: #353535"
            >设为默认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 选择其他发票抬头 -->
    <el-dialog
    :close-on-click-modal="false"
      title="选择发票抬头"
      :visible.sync="otherBillHeaderTableVisible"
      width="660px"
      center
      class="other-billheader-dialog"
    >
      <el-table
        :data="billHeaderTableData"
        @row-click="clickRowBillHeader"
        style="width: 990px"
        stripe
        :header-row-style="{ background: 'rgba(137,147,165,0.06)' }"
        height="450"
        :header-cell-style="{
          background: 'transparent',
          color: '#353535',
          fontSize: '14px',
        }"
        align="center"
      >
        <el-table-column prop="inv_type_name" label="发票类型" align="center"></el-table-column>
        <el-table-column prop="is_company_name" label="类型" align="center" width="80px"></el-table-column>
        <el-table-column prop="title" label="发票抬头" align="center"></el-table-column>
        <!-- <el-table-column prop="tax_no" label="税号" align="center" width="250px">
        </el-table-column>
        <el-table-column prop="address" label="注册地址" align="center" width="150px">
        </el-table-column>
        <el-table-column prop="bank" label="开户银行" align="center" width="150px">
        </el-table-column>
        <el-table-column prop="bank_no" label="银行账号" align="center" width="250px">
        </el-table-column>
        <el-table-column prop="tel" label="注册电话" align="center" width="150px">
        </el-table-column>-->
        <el-table-column fixed="right" label="操作" width="130" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              style="color: #353535"
              @click.native.prevent.stop="editInvoiceEdit(scope.row)"
            >修改</el-button>
            <el-popconfirm
              :title="`确定删除？`"
              hide-icon
              confirm-button-text="取消"
              cancel-button-text="删除"
              popper-class="popper-delete"
              @cancel="deleteInvoice(scope.row.id)"
            >
              <el-button
                slot="reference"
                size="mini"
                @click.stop
                type="text"
                style="color: #353535"
              >删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import logoSrc from "@/assets/images/logo.png";
// import NavSearch from '@/components/NavSearch.vue'
import Api from "@/plugins/api";
import { mapState } from "vuex";

export default {
  name: "SettlementPage",
  layout:'hall',
  middleware: "auth",
  components: {
    // NavSearch,
  },
  data() {
    return {
      logoSrc,
      receiveNames: "1",
      invoiceNames: "",
      is_open_invoice: 0,
      productNames: "1",
      newAddressFormVisible: false,
      newAddressForm: {
        region: [],
        province_code: "",
        city_code: "",
        district_code: "",
        address: "",
        consignee: "",
        mobile: "",
        is_default: 0,
      },
      newAddressFormRules: {
        region: [{ required: true, message: "请选择地区", trigger: "blur" }],
        address: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
        ],
        consignee: [
          { required: true, message: "请输入联系人", trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入联系号码", trigger: "blur" },
        ],
      },
      newBillHeaderFormVisible: false,
      newBillHeaderForm: {
        is_company: 0, // 1企业 0个人
        inv_type: 1, // 1普通发票 2增值税专用发票
        title: "", // 发票抬头
        tax_no: "", // 发票税号
        address: "", // 地址
        bank: "", // 银行
        bank_no: "", // 开户银行账号
        tel: "", // 手机号
      },
      newBillHeaderFormRules: {
        is_company: [{ required: true, message: "请选择", trigger: "blur" }],
        inv_type: [{ required: true, message: "请选择", trigger: "blur" }],
        title: [{ required: true, message: "请输入发票抬头", trigger: "blur" }],
        tax_no: [{ required: true, message: "请输入税号", trigger: "blur" }],
        address: [{ required: true, message: "请输入地址", trigger: "blur" }],
        bank: [{ required: true, message: "请输入开户银行", trigger: "blur" }],
        bank_no: [
          { required: true, message: "请输入开户银行账号", trigger: "blur" },
        ],
      },
      otherAddressTableVisible: false,
      addressTableData: [],
      addressActiveIndex: 0,
      addressSelected: {},
      addressList: [],
      billHeaderList: [],
      billHeaderActiveIndex: 0,
      billHeaderSelected: {},
      billHeaderTableData: [],
      otherBillHeaderTableVisible: false,
      options: [],
      orderProductList: [],
      postscript: [],
      type: 1,
      sku_id: [],
      number: {},
    };
  },
  computed: {
    ...mapState(["userInfo"]),
    proTotalCount() {
      let count = 0;
      this.orderProductList.forEach((store) => {
        count += store.children.length;
      });
      return count;
    },
    proTotalPrice() {
      let price = 0;
      this.orderProductList.forEach((store) => {
        price += store.goods_amount * 1;
      });
      return price.toFixed(2);
    },
    shippingPrice() {
      let price = 0;
      this.orderProductList.forEach((store) => {
        price += store.shipping_amount * 1;
      });
      return price;
    },
    orderTotalPrice() {
      return (this.shippingPrice + this.proTotalPrice * 1).toFixed(2);
    },
  },
  async mounted() {
    await this.getAddress();

 if(this.$route.query.price_id) {
      this.getPreOrder();

    }
    this.getInvoice();
    this.getselectCityRegion();
  },
  methods: {
    openInvoice(val) {
      if (val === 1) {
        if (this.billHeaderList.length === 0) {
          this.$message.warning("请添加发票信息");
        } else {
          this.billHeaderActiveIndex = 0;
          this.billHeaderSelected = this.billHeaderList[0];
        }
        this.invoiceNames = "1";
      } else {
        this.billHeaderActiveIndex = -1;
        this.billHeaderSelected = {};
        this.invoiceNames = "";
      }
    },
    gotoDetails(id) {
      window.open(`/productDetails?id=${id}`);
    },
    gotoStoreDetails(id) {
      window.open(`/company?id=${id}`);
    },
    getPreOrder() {
      if(this.$route.query.price_id) {
      this.$request
        .get(Api.getPreOrder, {
          params: {
            price_id: this.$route.query.price_id,
          },
        })
        .then((res) => {
          if (res.code === 0) {
          this.orderProductList = res.data;
          this.orderProductList.forEach((store) => {
            this.$set(store, "postscript", "");
          });
        } else {
          this.$message.error(res.msg);
        }
         
        });


      }



    },

    // 提交订单
    submitOrder() {
      if (
        this.userInfo.status === 3 ||
        this.userInfo.status === 4 ||
        this.userInfo.status === 5
      ) {
        setTimeout(() => {
          this.$router.push({
            path: "/register",
            query: { status: this.userInfo.status },
          });
        }, 3000);
        return;
      }
      let sku_id = []
      let numbers = {};
      

      this.orderProductList.forEach((element) => {
        if(element.children) {
          element.children.forEach(item => {
            sku_id.push(item.sku_id)
            numbers[item.sku_id] = item.number;
          });
         
        }
      })

     
    

      const data = {
        type: 2,
        is_open_invoice: this.is_open_invoice,
        address_id: this.addressSelected.id,
        invoice_id: this.billHeaderSelected.id || "",
        sku_id,
        number: numbers,
        referer_type: 1, // 订单来源 1-PC,2-APP,3-小程序，4-H5
        postscript: {},
      };

      this.orderProductList.forEach((store) => {
        data.postscript[store.union_id] = store.postscript;
      });
      this.$request.post(Api.postDoOrder, data).then((res) => {
        if (res.code === 0) {
          this.$router.push("/purchaseorder/resultorder");





          this.$request
        .get(Api.callbackorder, {
          params: {
            price_id: this.$route.query.price_id,
            ret_order_id:res.data.order_id
          },
        })






        } else {
          this.$message.warning(res.msg);
        }
      });
    },

    // 选择其他地址按钮
    chooseOtherAddress() {
      this.getAddressTableData();
      this.otherAddressTableVisible = true;
    },
    clickRowAddress(row) {
      //
      let flag = false;
      this.addressList.forEach((item) => {
        // 如果点击的是展示出的前五个
        if (item.id === row.id) {
          this.addressSelected = row;
          this.otherAddressTableVisible = false;
          flag = true;
        }
      });
      if (!flag) {
        // 如果显示出来的前五个里没有,用选择的替换第一个
        this.addressList.splice(0, 1, row);
        this.addressSelected = row;
        this.otherAddressTableVisible = false;
      }

      this.getPreOrder();
    },
    // 选择其他发票抬头按钮
    chooseOtherBillHeader() {
      this.getInvoiceTableData();
      this.otherBillHeaderTableVisible = true;
    },
    clickRowBillHeader(row) {
      let flag = false;
      this.billHeaderList.forEach((item) => {
        // 如果点击的是展示出的前五个
        if (item.id === row.id) {
          this.billHeaderSelected = row;
          this.otherBillHeaderTableVisible = false;
          flag = true;
        }
      });
      if (!flag) {
        // 如果显示出来的前五个里没有,用选择的替换第一个
        this.billHeaderList.splice(0, 1, row);
        this.billHeaderSelected = row;
        this.otherBillHeaderTableVisible = false;
      }
    },
    // 区域选择
    handleRegionChange(value) {
      this.newAddressForm.province_code = value[0];
      this.newAddressForm.city_code = value[1];
      this.newAddressForm.district_code = value[2] || "";
    },
    /** *****************************************  选择发票抬头增删改查 ************************************/
    // 获取发票抬头列表
    getInvoice(isSelectFirst) {
      this.$request
        .get(Api.getOrderInvoice, {
          params: {
            page: 1,
            limit: 5,
          },
        })
        .then((res) => {
          this.billHeaderList = res.data;
          if (isSelectFirst) {
            this.billHeaderActiveIndex = 0;
            this.billHeaderSelected = res.data[0];
          }
        });
    },
    // 选择发票抬头
    selectbillHeader(i, header) {
      this.billHeaderActiveIndex = i;
      this.billHeaderSelected = header;
    },
    addBillHeader() {
      this.newBillHeaderForm = {
        is_company: 0, // 1企业 0个人
        inv_type: 1, // 1普通发票 2增值税专用发票
        title: "", // 发票抬头
        tax_no: "", // 发票税号
        address: "", // 地址
        bank: "", // 银行
        bank_no: "", // 开户银行账号
        tel: "", // 手机号
      };
      this.newBillHeaderFormVisible = true;
    },
    invTypeChange(val) {
      if (val === 2) {
        this.newBillHeaderForm.is_company = 1;
      }
      this.$refs.newBillHeaderForm.clearValidate();
    },
    comTypeChange() {
      this.$refs.newBillHeaderForm.clearValidate();
    },
    // 获取发票列表按钮
    getInvoiceTableData() {
      this.$request
        .get(Api.getOrderInvoice, {
          params: {
            page: this.page,
            limit: this.limit,
          },
        })
        .then((res) => {
          this.billHeaderTableData = res.data;
        });
    },
    // 编辑发票按钮
    editInvoiceEdit(row) {
      const {
        id,
        is_company,
        inv_type,
        title,
        tax_no,
        address,
        bank,
        bank_no,
        tel,
      } = row;

      this.newBillHeaderForm = {
        id,
        is_company,
        inv_type,
        title,
        tax_no,
        address,
        bank,
        bank_no,
        tel,
      };

      this.newBillHeaderFormVisible = true;
    },
    // 删除发票确定按钮
    deleteInvoice(id) {
      this.$request.post(Api.postOrderInvoiceDelete, { id }).then((res) => {
        if (res.code === 0) {
          this.getInvoiceTableData();
          this.getInvoice();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 添加发票保存按钮
    postInvoiceEdit() {
      this.$refs.newBillHeaderForm.validate((valid) => {
        if (valid) {
          const data = JSON.parse(JSON.stringify(this.newBillHeaderForm));
          this.$request.post(Api.postOrderInvoiceEdit, data).then((res) => {
            if (res.code === 0) {
              this.$message.success(res.msg);
              this.newBillHeaderFormVisible = false;
              this.getInvoiceTableData();
              if (!data.id) {
                // 说明是新增的
                this.getInvoice(true);
              } else {
                this.getInvoice();
              }
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },

    /** *****************************************  选择发票抬头增删改查 ************************************/

    /** *****************************************  选择地址增删改查 ************************************/
    // 获取地址列表
    getAddress() {
      return this.$request
        .get(Api.getOrderAddress, {
          params: {
            page: 1,
            limit: 5,
          },
        })
        .then((res) => {
          this.addressList = res.data;
          this.addressList.forEach((item, i) => {
            if (item.is_default === 1) {
              // this.selectAddress(i, item)
              this.addressActiveIndex = i;
              this.addressSelected = item;
            }
          });
        });
    },
    selectAddress(i, address) {
      this.addressActiveIndex = i;
      this.addressSelected = address;
      this.getPreOrder();
    },
    addNewAddress() {
      this.newAddressForm = {
        region: [],
        province_code: "",
        city_code: "",
        district_code: "",
        address: "",
        consignee: "",
        mobile: "",
        is_default: 0,
      };
      this.newAddressFormVisible = true;
    },
    // 获取地址列表按钮
    getAddressTableData() {
      this.$request
        .get(Api.getOrderAddress, {
          params: {
            page: 1,
            limit: 200,
          },
        })
        .then((res) => {
          this.addressTableData = res.data;
        });
    },

    // 新增收货地址添加保存按钮
    postAddress() {
      this.$refs.newAddressForm.validate((valid) => {
        if (valid) {
          const data = JSON.parse(JSON.stringify(this.newAddressForm));
          if (this.addressList.length === 0) {
            data.is_default = 1;
          }
          this.$request.post(Api.postOrderAddressEdit, data).then((res) => {
            if (res.code === 0) {
              this.$message.success(res.msg);
              this.newAddressFormVisible = false;
              this.getAddress();
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },
    // 获取省市区下拉选
    getselectCityRegion() {
      this.$request.get(Api.selectAllRegion).then((res) => {
        this.options = res.data;
      });
    },

    // 设为默认地址按钮
    setDefaultAddress(row) {
      const {
        id,
        province_code,
        city_code,
        district_code,
        address,
        consignee,
        mobile,
      } = row;

      const data = {
        id,
        province_code,
        city_code,
        district_code,
        address,
        consignee,
        mobile,
        is_default: 1,
      };
      this.$request.post(Api.postOrderAddressEdit, data).then((res) => {
        if (res.code === 0) {
          this.$message.success(res.msg);
          this.getAddressTableData();
          this.getAddress();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 删除确定按钮
    deleteAddress(id) {
      this.$request.post(Api.postOrderAddressDelete, { id }).then((res) => {
        if (res.code === 0) {
          this.getAddressTableData();
          this.getAddress();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 编辑地址按钮
    editAddress(row) {
      const {
        id,
        province_code,
        city_code,
        district_code,
        address,
        consignee,
        mobile,
        is_default,
      } = row;

      this.newAddressForm = {
        id,
        province_code,
        city_code,
        district_code,
        address,
        consignee,
        mobile,
        is_default,
      };
      this.newAddressForm.region = [province_code, city_code, district_code];

      this.newAddressFormVisible = true;
    },

    /** *****************************************  选择地址增删改查 ************************************/
  },
};
</script>
<style lang="less" scoped>
.main {
  background-color: #fff;
  min-height: calc(100vh - 205px);
  box-shadow: 0px 8px 16px 0px rgba(23, 36, 63, 0.1) inset;
  padding-bottom: 80px;
}

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

.settlement-page {
  margin: 0 auto;
  padding-top: 80px;
  min-height: 750px;
  .el-collapse {
    margin-bottom: 12px;
  }

  :deep(.el-collapse) {
    border: 1px solid #e5e5e5;
  }

  :deep(.el-collapse-item__header) {
    height: unset;
    line-height: 28px;
    padding: 0 16px;
    box-sizing: border-box;
    background: rgba(137, 147, 165, 0.06);
    font-size: 12px;
    font-family: Microsoft YaHei, Microsoft YaHei-Bold;
    font-weight: 700;
    text-align: left;
    color: #353535;
    flex-direction: column;
    // justify-content: center;
    align-items: flex-start;
    position: relative;

    .el-collapse-item__arrow {
      position: absolute;
      top: 38%;
      right: 10px;
    }
  }

  :deep(.el-collapse-item__content) {
    padding: 20px 16px;
  }

  .receive-info-container,
  .invoice-info-container {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    padding-bottom: 30px;

    .btn {
      position: absolute;
      bottom: -10px;
      left: 0;
    }
  }

  .receive-info,
  .invoice-info {
    width: 216px;
    height: 98px;
    line-height: 18px;
    border: 1px solid #e5e5e5;
    padding: 16px 12px 0;
    box-sizing: border-box;
    font-size: 12px;
    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
    font-weight: 400;
    color: #353535;
    margin: 0 14px 16px 0;
    cursor: pointer;
    position: relative;

    .edit-btn {
      position: absolute;
      top: 0px;
      right: 0px;
      padding: 0px 5px;
      font-size: 12px;
      height: 18px;
      line-height: 17px;
      color: #fff;
      background-color: #38383852;
      display: none;
    }

    &:hover {
      & .edit-btn {
        display: block;
      }
    }

    .name-tel {
      display: flex;
      justify-content: space-between;
      margin-top: 14px;
    }

    .type {
      font-size: 14px;
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      font-weight: 400;
      text-align: left;
      color: #353535;
      margin-bottom: 14px;
    }

    &.active {
      border: 1px solid #2263e8;
      position: relative;

      &::after {
        content: "";
        width: 16px;
        height: 16px;
        display: block;
        position: absolute;
        background: url("@/assets/images/price/checked.png") no-repeat;
        bottom: 0;
        right: 0;
      }
    }
  }

  .store-item {
    margin-bottom: 22px;
  }

  .header {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    font-family: Microsoft YaHei, Microsoft YaHei-Bold;
    font-weight: 400;
    text-align: left;
    color: #353535;
    margin-bottom: 11px;

    .store {
      font-size: 12px;
      font-weight: 700;

      span {
        cursor: pointer;
      }

      span:hover {
        color: #2277e8;
      }
    }

    .price {
      color: #e84b01;
    }
  }

  .product-list {
    display: flex;
    justify-content: space-between;
    border: 1px solid #e5e5e5;

    .left {
      width: 868px;

      .gray_row {
        background-color: #e5e5e5;
      }

      .row {
        display: flex;
        justify-content: space-around;
        border-bottom: 2px solid #e5e5e5;

        &:last-child {
          border-bottom: none;
        }

        img {
          margin: 20px 8px 15px 24px;
        }

        .summary {
          flex: 1;
          margin: 20px 24px 15px 0;
          cursor: pointer;

          .desc {
            font-size: 12px;
            font-family: Microsoft YaHei, Microsoft YaHei-Regular;
            font-weight: 400;
            text-align: left;
            color: #353535;
            line-height: 18px;
            margin-bottom: 10px;
          }

          .type {
            font-size: 12px;
            font-family: Microsoft YaHei, Microsoft YaHei-Regular;
            font-weight: 400;
            text-align: left;
            color: #959595;
            line-height: 18px;
          }
        }

        .price-single,
        .count {
          width: 80px;
          font-size: 12px;
          font-family: Microsoft YaHei, Microsoft YaHei-Regular;
          font-weight: 400;
          text-align: left;
          color: #656565;
          line-height: 18px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .price-total {
          width: 80px;
          font-size: 12px;
          font-family: Microsoft YaHei, Microsoft YaHei-Bold;
          font-weight: 700;
          text-align: left;
          color: #e84b01;
          line-height: 18px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }

    .right {
      width: 247px;
      padding: 16px;

      :deep(.el-textarea) {
        .el-textarea__inner {
          height: 100%;
        }
      }
    }
  }

  .bottom-btn-group {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 80px;
    background: rgba(137, 147, 165, 0.06);
    border: 1px solid #e5e5e5;
    padding: 20px;
    box-sizing: border-box;

    .total-info {
      font-size: 12px;
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      font-weight: 400;
      color: #656565;
      line-height: 20px;
      text-align: right;

      .total-count {
        font-size: 14px;
        font-family: Roboto, Roboto-Regular;
        font-weight: 400;
        color: #2263e8;
      }

      .total-price {
        font-size: 16px;
        font-family: Roboto, Roboto-Bold;
        font-weight: 700;
        color: #e84b01;
      }
    }

    .submit-order-btn {
      width: 124px;
      height: 52px;
      line-height: 52px;
      background: #2263e8;
      font-size: 18px;
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      font-weight: 400;
      text-align: center;
      color: #ffffff;
      margin-left: 20px;
      cursor: pointer;
    }

    .submit-order-btn-disable {
      width: 124px;
      height: 52px;
      line-height: 52px;
      background: #999;
      font-size: 18px;
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      font-weight: 400;
      text-align: center;
      color: #ffffff;
      margin-left: 20px;
      cursor: pointer;
    }
  }
}

:deep(.el-checkbox__label) {
  font-size: 12px;
  font-family: Microsoft YaHei, Microsoft YaHei-Regular;
  font-weight: 400;
  color: #656565;
}

.total-msg {
  font-size: 12px;
  font-family: Microsoft YaHei, Microsoft YaHei-Regular;
  font-weight: 400;
  text-align: right;
  color: #353535;
  line-height: 28px;
  margin-bottom: 10px;

  .num {
    width: 180px;
    display: inline-block;
  }
}

.other-address-dialog,
.other-billheader-dialog,
.add-new-address-dialog,
.add-new-billheader-dialog {
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
      top: 25px;
    }

    .el-dialog__headerbtn .el-dialog__close {
      color: #fff;
    }
  }

  :deep(.el-dialog__body) {
    background-color: #fff;

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

:deep(.el-textarea) {
  height: 100%;
}
</style>
