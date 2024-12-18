<!-- 大宗商品订单详情  -->
<template>
  <div class="wrap">
    <div class="btn-group">
      <div class="back-btn btn" @click="backList">
        <i class="el-icon-arrow-left"></i> 返回
      </div>
    </div>
    <!-- 订单跟进 -->
    <div class="card">
      <div class="header">
        <div>订单跟进</div>
      </div>
      <div class="body">
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in orderInfo.order_action_list"
            :key="index"
            :timestamp="activity.create_time"
          >{{ activity.info }}</el-timeline-item>
        </el-timeline>
      </div>
    </div>
    <!-- 产品信息 -->
    <div class="card">
      <div class="header">
        <div>产品信息</div>
      </div>
      <div class="body">
        <el-table
          ref="goodsTable"
          :data="orderInfo.order_goods_list"
          border
          style="width: 100%"
          header-row-class-name="table-header-style"
        >
          <el-table-column label="商品" prop="date" width="440" align="center">
            <template slot-scope="scope">
              <div class="pro-desc" @click="gotoSkuDetails(scope.row.sku_id)">
                <img :src="scope.row.image" style="width: 64px;height: 64px;" />
                <div class="pro-name">
                  <p>{{ scope.row.goods_name }}</p>
                  <p :title="scope.row.attr_name" class="text-ellipsis-2">{{ scope.row.attr_name }}</p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="数量" prop="number" width="80" align="center"></el-table-column>
          <el-table-column label="单价" prop="shop_price" align="center">
            <template slot-scope="scope">
               {{ scope.row.shop_price }} /  {{ scope.row.unit_name }} 

            </template>
          </el-table-column>
          <el-table-column label="全部金额" prop="total_price" align="center" width="140">
            <template
              slot-scope="scope"
            >{{ (scope.row.number * scope.row.shop_price * 1).toFixed(2) }}</template>
          </el-table-column>
        </el-table>
        <div class="price-info">
          <div class="item">
            <div class="label">费用类型：</div>
            <div class="value">预计费用</div>
          </div>
          <div class="item" v-for="(cost, i) in orderInfo.order_has_cost_type_list" :key="i">
            <div class="label">
              <el-select v-if="cost.id === ''" v-model="cost.key" placeholder="请选择" size="mini">
                <el-option
                  v-for="item in CostTypeList"
                  :key="item.id"
                  :label="item.cost_type"
                  :value="item.key"
                ></el-option>
              </el-select>
              <div v-else style="position: relative;">
                {{ cost.cost_type }}：
                <el-tooltip
                  :content="`订单金额的${orderInfo.commission_rate}%计算`"
                  placement="right"
                  effect="light"
                >
                  <i
                    class="el-icon-question"
                    style="font-size: 15px;
                                    color: #959595;
                                    position: absolute;
                                    top: -6px;
                                    right:0;"
                    v-if="cost.key === 'commission'"
                  ></i>
                </el-tooltip>
              </div>
            </div>
            <div class="value" v-if="orderInfo.offline_status < 3">
              <el-input
                v-model="cost.predict_fee"
                size="mini"
                type="number"
                style="width:100px"
                :disabled="orderInfo.offline_status !== 0 || cost.is_delete === 2"
              ></el-input>
              <el-button
                type="text"
                size="mini"
                @click="delOrderCost(orderInfo.order_has_cost_type_list, i)"
                v-if="(cost.is_delete === 1 && orderInfo.offline_status === 0)"
              >删除</el-button>
            </div>
            <div class="value" v-else>￥{{ cost.predict_fee }}</div>
          </div>
          <div class="item">
            <div class="label">合计：</div>
            <div class="value heji-price">
              <span
                v-if="orderInfo.offline_status < 3"
              >{{ getTotalCost(orderInfo.order_has_cost_type_list) }}</span>
              <span v-else>{{ orderInfo.total_order_amount }}</span>
            </div>
          </div>
          <div class="item">
            <div class="label">报价有效期：</div>
            <div class="value" v-if="orderInfo.offline_status < 3">
              <el-date-picker
                style="width:130px"
                value-format="yyyy-MM-dd"
                v-model="auto_buyer_confirm_time"
                type="date"
                size="mini"
                placeholder="选择日期"
                :disabled="orderInfo.offline_status !== 0"
                :picker-options="pickerOptions"
              ></el-date-picker>
            </div>
            <div class="value" v-else>{{ auto_buyer_confirm_time }}</div>
          </div>
          <div class="item" v-if="orderInfo.offline_status === 0 && type == 'seller'">
            <div class="label btn-group" style="justify-content: flex-end;">
              <el-button size="mini" @click="addOrderCost">添加费用</el-button>
            </div>
            <div class="value btn-group">
              <el-popconfirm
                :title="`确定订单？`"
                hide-icon
                confirm-button-text="确定"
                cancel-button-text="取消"
                popper-class="popper-delete-2"
                @confirm="confirmOrder(orderInfo.id)"
              >
                <el-button
                  size="mini"
                  slot="reference"
                  type="primary"
                  class="confirm-order-btn"
                >确认订单</el-button>
              </el-popconfirm>
            </div>
          </div>

          <div class="item" v-if="orderInfo.offline_status == '1' && type == 'buyer'">
            <div class="value btn-group">
              <el-popconfirm
                :title="`确定购买？`"
                hide-icon
                confirm-button-text="确定"
                cancel-button-text="取消"
                popper-class="popper-delete-2"
                @confirm="confirmOrderForBuy"
              >
                <el-button
                  size="mini"
                  slot="reference"
                  type="primary"
                  class="confirm-order-btn"
                >确认购买</el-button>
              </el-popconfirm>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 发货信息 -->
    <div class="card">
      <div class="header">
        <div>
          发货信息 &nbsp;
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            v-if="orderInfo.offline_status === 2"
            @click="inputShippingInfo"
          >录入发货信息</el-button>
        </div>
        <div v-if="orderInfo.offline_status === 2">
          <el-button size="mini" @click="finishShippingBtn">发货完成</el-button>
        </div>
      </div>
      <div class="body">
        <el-table
          :data="orderInfo.order_shipping_list"
          border
          style="width: 100%"
          header-row-class-name="table-header-style"
        >
          <el-table-column label="车牌号" prop="car_no" width="120" align="center"></el-table-column>
          <el-table-column label="发货数量" prop="number" width="120" align="center"></el-table-column>
          <el-table-column label="收货地址" prop="pcd_address" align="center"></el-table-column>
          <el-table-column label="发货凭证" align="center" width="100">
            <template slot-scope="scope">
              <el-button type="text" @click="getviewShipping(scope.row.id)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="120"
            v-if="orderInfo.offline_status < 3"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="editShipping(scope.row)">编辑</el-button>
              <el-popconfirm
                :title="`删除发货信息？`"
                hide-icon
                confirm-button-text="取消"
                cancel-button-text="确定"
                popper-class="popper-delete"
                @cancel="delShipping(scope.row.id)"
              >
                <el-button type="text" slot="reference">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>


    <!-- 订单信息 -->
    <div class="card">
      <div class="header">
        <div>订单信息</div>
      </div>
      <div class="body">
        <div class="info-item">
          <div class="item">
            <div class="label">订单号：</div>
            <div class="value">{{ orderInfo.order_sn }}</div>
          </div>
          <div class="item" style="width:30%">
            <div class="label" style="width:85px">店铺：</div>
            <div class="value">{{ orderInfo.shop_name }}</div>
          </div>
          <div class="item">
            <div class="label">创建时间：</div>
            <div class="value">{{ orderInfo.create_time }}</div>
          </div>
          <div class="item" style="width:20%">
            <div class="label">状态：</div>
            <div class="value">{{ orderInfo.offline_status_name }}</div>
          </div>
          <div class="item">
            <div class="label">订单备注：</div>
            <div class="value">{{ orderInfo.postscript }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 采购商信息 -->
    <div class="card">
      <div class="header">
        <div>采购商信息</div>
      </div>
      <div class="body">
        <div class="info-item">
          <div class="item">
            <div class="label">创建人：</div>
            <div class="value">{{ orderInfo.order_buyer_info.username }}</div>
          </div>
          <div class="item">
            <div class="label">联系号码：</div>
            <div class="value">{{ orderInfo.order_buyer_info.user_mobile }}</div>
          </div>
          <div class="item" style="width:40%">
            <div class="label">公司名称：</div>
            <div class="value">{{ orderInfo.order_buyer_info.company_name }}</div>
          </div>
          <div class="item">
            <div class="label">联系人：</div>
            <div class="value">{{ orderInfo.order_buyer_info.company_contacts }}</div>
          </div>
          <div class="item">
            <div class="label">联系号码：</div>
            <div class="value">{{ orderInfo.order_buyer_info.company_mobile }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 供应商信息 -->
    <div class="card">
      <div class="header">
        <div>
          供应商信息 &nbsp;
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="editSupplierInfo = true"
            v-show="!editSupplierInfo"
          >修改</el-button>
          <el-button size="mini" v-show="editSupplierInfo" @click="cancelEdit">取消</el-button>
          <el-button
            size="mini"
            type="primary"
            v-show="editSupplierInfo"
            @click="saveSupplierInfo"
          >保存</el-button>
        </div>
      </div>
      <div class="body">
        <div class="info-item">
          <div class="item">
            <div class="label">联系人：</div>
            <div class="value">
              <el-input
                :disabled="!editSupplierInfo"
                size="mini"
                v-model="orderInfo.order_supplier_info.supplier_contacts"
              ></el-input>
            </div>
          </div>
          <div class="item">
            <div class="label">联系号码：</div>
            <div class="value">
              <el-input
                :disabled="!editSupplierInfo"
                size="mini"
                v-model="orderInfo.order_supplier_info.supplier_mobile"
              ></el-input>
            </div>
          </div>
          <div class="item" style="width:40%">
            <div class="label">公司名称：</div>
            <div class="value">{{ orderInfo.order_supplier_info.supplier_name }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 收货信息 -->
    <div class="card">
      <div class="header">
        <div>收货信息</div>
      </div>
      <div class="body">
        <div class="info-item">
          <div class="item">
            <div class="label">收货人：</div>
            <div class="value">{{ orderInfo.order_address.consignee }}</div>
          </div>
          <div class="item">
            <div class="label">手机号码：</div>
            <div class="value">{{ orderInfo.order_address.mobile }}</div>
          </div>
          <div class="item" style="width:40%">
            <div class="label">收货地址：</div>
            <div class="value">{{ orderInfo.order_address.pcd_address }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 发票信息 -->
    <div class="card">
      <div class="header">
        <div>发票信息</div>
      </div>
      <div class="body">
        <div class="info-item">
          <div class="item" style="width:100%" v-if="orderInfo.is_open_invoice===0">
            <div class="label">开发票：</div>
            <div class="value">
              <el-radio-group v-model="orderInfo.is_open_invoice" disabled>
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="item" style="width:50%" v-if="orderInfo.is_open_invoice === 1">
            <div class="label">发票：</div>
            <div class="value">
              <el-radio-group v-model="orderInfo.order_invoice.inv_type" disabled>
                <el-radio :label="1">普通发票</el-radio>
                <el-radio :label="2">增值税专用发票</el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="item" style="width:50%" v-if="orderInfo.is_open_invoice === 1">
            <div class="label">发票类型：</div>
            <div class="value">
              <el-radio-group v-model="orderInfo.order_invoice.is_company" disabled>
                <el-radio :label="0" :disabled="(orderInfo.order_invoice.inv_type === 2)">个人</el-radio>
                <el-radio :label="1">企业</el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="item" style="width:50%" v-if="orderInfo.is_open_invoice === 1">
            <div class="label">发票抬头：</div>
            <div class="value">
              <el-input size="mini" v-model="orderInfo.order_invoice.title" disabled></el-input>
            </div>
          </div>
          <div
            class="item"
            style="width:50%"
            v-if="orderInfo.is_open_invoice === 1"
            v-show="orderInfo.order_invoice.is_company === 1"
          >
            <div class="label">税号：</div>
            <div class="value">
              <el-input size="mini" v-model="orderInfo.order_invoice.tax_no" disabled></el-input>
            </div>
          </div>
          <div
            class="item"
            style="width:50%"
            v-if="orderInfo.is_open_invoice === 1"
            v-show="orderInfo.order_invoice.is_company === 1"
          >
            <div class="label">注册地址：</div>
            <div class="value">
              <el-input size="mini" v-model="orderInfo.order_invoice.address" disabled></el-input>
            </div>
          </div>
          <div
            class="item"
            style="width:50%"
            v-if="orderInfo.is_open_invoice === 1"
            v-show="orderInfo.order_invoice.is_company === 1"
          >
            <div class="label">开户银行：</div>
            <div class="value">
              <el-input size="mini" v-model="orderInfo.order_invoice.bank" disabled></el-input>
            </div>
          </div>
          <div
            class="item"
            style="width:50%"
            v-if="orderInfo.is_open_invoice === 1"
            v-show="orderInfo.order_invoice.is_company === 1"
          >
            <div class="label">银行账号：</div>
            <div class="value">
              <el-input size="mini" v-model="orderInfo.order_invoice.bank_no" disabled></el-input>
            </div>
          </div>
          <div class="item" style="width:50%" v-if="orderInfo.is_open_invoice === 1">
            <div class="label">{{ orderInfo.order_invoice.is_company === 1 ? '注册电话：' : '手机号：' }}</div>
            <div class="value">
              <el-input size="mini" v-model="orderInfo.order_invoice.tel" disabled></el-input>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 查看凭证 -->
    <!-- 查看凭证 -->
    <el-dialog title="凭证信息" :visible.sync="dialogVisible" width="30%" class="jcys-dialog">
      <el-image :src="images[imageIndex]" style="width:100%;height: 460px;"></el-image>
      <div class="page">
        <div class="page-btn" @click="switchImage('prev')">上一张</div>
        <div>
          <span>{{ imageIndex + 1 }}</span>
          <span>/</span>
          <span>{{ images.length }}</span>
        </div>
        <div class="page-btn" @click="switchImage('next')">下一张</div>
      </div>
    </el-dialog>

    <!-- 录入发货信息 -->
    <el-dialog
      title="录入发货信息"
      :visible.sync="DoShippingFormVisible"
      width="30%"
      class="jcys-dialog"
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
          <el-input v-model="DoShippingForm.number" @input="inputShippingNumber"></el-input>
        </el-form-item>
        <el-form-item label="发货凭证" prop="image">
          <el-upload
            class="upload-demo"
            :auto-upload="false"
            action
            :on-change="uploadShippingVoucher"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :file-list="fileList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">可上传多张图片，文件大小不超过5M</div>
          </el-upload>
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
          <el-input style="margin-top:10px" v-model="DoShippingForm.address"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="cancel-btn" @click="DoShippingFormVisible = false">取 消</el-button>
        <el-button type="primary" class="save-btn" @click="submitDoShipping">提 交</el-button>
      </div>
    </el-dialog>

    <!-- 完成发货 -->
    <el-dialog
      title="完成发货"
      :visible.sync="finishShippingTableVisible"
      width="600px"
      class="jcys-dialog finish-dialog"
      center
    >
      <div class="title">
        <div>
          <span>费用统计</span>
          <el-button type="text" icon="el-icon-circle-plus-outline" @click="addFinalCost">添加费用</el-button>
        </div>
        <div class="tips">*请确认无误后再填写</div>
      </div>
      <el-table
        :data="finishShippingTable"
        stripe
        size="mini"
        :header-cell-style="{ background: '#e9f0fa', color: '#353535' }"
      >
        <el-table-column prop="type" label="费用类型" align="center">
          <template slot-scope="scope">
            <el-select
              v-if="scope.row.id === ''"
              v-model="scope.row.key"
              placeholder="请选择"
              size="mini"
            >
              <el-option
                v-for="item in CostTypeList"
                :key="item.id"
                :label="item.cost_type"
                :value="item.key"
              ></el-option>
            </el-select>
            <div v-else>{{ scope.row.cost_type }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="predict_fee" label="预计费用" align="center">
          <template slot-scope="scope">
            <!-- <el-input v-if="scope.row.id === ''" size="mini" v-model="scope.row.predict_fee"></el-input> -->
            <span>{{ scope.row.predict_fee }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="actual_fee" label="实际费用" align="center">
          <template slot-scope="scope">
            <el-input size="mini" type="number" v-model="scope.row.actual_fee"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="handler" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              v-if="(scope.row.is_delete === 1 || scope.row.id === '')"
              @click="deleteFinalCost(scope.$index, finishShippingTable)"
            >删除</el-button>
            <div v-else>-</div>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button class="cancel-btn" @click="finishShippingTableVisible = false">取 消</el-button>
        <el-button type="primary" class="save-btn" @click="submitfinalCost">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
/* eslint-disable */

import Api from "@/plugins/api";
export default {
  name: "bulkOrderDetails",
  layout: "personalCenter",
  props: ["orderId", "type"],
  data() {
    return {
      dialogVisible: false,
      editInvoice: false,
      editSupplierInfo: false,
      DoShippingFormVisible: false,
      pickerOptions: {
        disabledDate: (item) => {
          return item * 1 < new Date() * 1;
        },
      },
      DoShippingForm: {
        province: [],
        order_id: "",
        province_code: 0,
        city_code: 0,
        district_code: 0,
        address: "",
        car_no: "",
        number: 1,
        image: [],
      },

      DoShippingFormRules: {
        address: [{ required: true, message: "请选择地址", trigger: "blur" }],
        number: [{ required: true, message: "请输入数量", trigger: "blur" }],
        car_no: [{ required: true, message: "请输入车牌号", trigger: "blur" }],
        image: [{ required: true, message: "请上传发货凭证", trigger: "blur" }],
      },
      finishShippingTableVisible: false,
      finishShippingTable: [],
      images: [],
      imageIndex: 0,
      imageUrl: "",
      fileList: [],
      orderInfo: {
        order_buyer_info: {},
        order_supplier_info: {},
        order_address: {},
        order_invoice: {},
        order_has_cost_type_list: [],
      },
      orderCostList: [],
      auto_buyer_confirm_time: "",
      cityOptions: [],
      cityProps: {
        label: "name",
        value: "citycode",
      },
      CostTypeList: [],
      cancel_reason_show: false,
      cancel_reason: "",
    };
  },
  mounted() {
    this.getInfo();
    this.getCityRegion();
    this.getCostTypeList();
  },
  methods: {
    gotoPayVoucher() {
      this.$router.push({
        path: "/payVoucher",
        query: { order_id: this.orderId, order_sn: this.orderInfo.order_sn },
      });
    },
    getCostTypeList() {
      this.$request.get(Api.getCostTypeList).then((res) => {
        if (res.code === 0) {
          this.CostTypeList = res.data;
        }
      });
    },
    getTotalCost(cost_type_list) {
      return (
        "￥" +
          cost_type_list
            .map((item) => item.predict_fee)
            .reduce((total, cur) => {
              return Number(total) + Number(cur);
            }, 0)
            .toFixed(2) || "待定"
      );
    },
    getActualTotalCost(cost_type_list) {
      return (
        "￥" +
        cost_type_list
          .map((item) => item.actual_fee)
          .reduce((total, cur) => {
            return Number(total) + Number(cur);
          }, 0)
      );
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
    // 录入发货信息
    inputShippingInfo() {
      this.DoShippingFormVisible = true;
      const { address, province_code, city_code, district_code } =
        this.orderInfo.order_address;
      this.DoShippingForm = {
        province: [province_code, city_code, district_code],
        order_id: "",
        province_code: 0,
        city_code: 0,
        district_code: 0,
        address: address,
        car_no: "",
        number: 1,
        image: [],
      };
      this.fileList = [];
    },
    inputShippingNumber(value) {
      this.DoShippingForm.number =
        value
          .replace(/\D*(\d*)(\.?)(\d{0,3})\d*/, "$1$2$3") // 只能输入数字、小数点限制3位
          .replace(/^0+(\d)/, "$1") // 第一位0开头，0后面为数字，则过滤掉，取后面的数字
          .replace(/^\./, "0.") // 如果输入的第一位为小数点，则替换成 0. 实现自动补全
          .match(/^\d*(\.?\d{0,3})/g)[0] || ""; // 数字开头、小数点3位
    },
    finishShippingBtn() {
      if (this.orderInfo.order_shipping_list.length > 0) {
        this.finishShippingTableVisible = true;
      } else {
        this.$message.warning("请先录入发货信息");
      }
    },
    // 添加费用
    addOrderCost() {
      this.orderInfo.order_has_cost_type_list.push({
        predict_fee: "",
        key: "",
        is_delete: 1,
        id: "",
      });
    },
    // 删除费用
    delOrderCost(row, i) {
      row.splice(i, 1);
    },
    addFinalCost() {
      this.finishShippingTable.push({
        actual_fee: "",
        cost_type: "",
        id: "",
        key: "",
        predict_fee: 0,
      });
    },
    submitfinalCost() {
      const data = {
        order_id: this.orderId,
      };
      data.cost_type = this.finishShippingTable.map((item) => ({
        id: item.id,
        key: item.key,
        actual_fee: item.actual_fee || 0,
      }));
      this.$request.post(Api.shippingFinished, data).then((res) => {
        if (res.code === 0) {
          this.backList();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    dateFormatter(t, formatter = "yyyy-MM-DD HH:mm:ss") {
      t = t * 1000;
      return this.$moment(t).format(formatter);
    },
    // 获取订单信息
    getInfo() {
      this.$request
        .get(Api.getSupplierOrderInfo, { params: { order_id: this.orderId } })
        .then((res) => {
          if (res.code === 0) {
            this.orderInfo = res.data;
            // if (!res.data.order_invoice) {
            //     this.orderInfo.order_invoice = {}
            // }
            if (res.data.auto_buyer_confirm_time === 0) {
              this.auto_buyer_confirm_time =
                this.$moment().format("YYYY-MM-DD");
            } else {
              this.auto_buyer_confirm_time = this.$moment(
                res.data.auto_buyer_confirm_time * 1000
              ).format("YYYY-MM-DD");
            }
            this.finishShippingTable = [];
            res.data.order_has_cost_type_list.forEach((item) => {
              if (item.key !== "commission") {
                this.finishShippingTable.push(JSON.parse(JSON.stringify(item)));
              }
            });
            this.finishShippingTable.forEach((item) => {
              item.actual_fee =
                Number(item.actual_fee) === 0
                  ? Number(item.predict_fee)
                  : Number(item.actual_fee);
            });
          }
        });
    },
    gotoSkuDetails(id) {
      const routeUrl = this.$router.resolve({
        path: "/productDetails",
        query: { id },
      });
      window.open(routeUrl.href, "_blank");
    },
    // 查看支付凭证
    getviewPayVoucher(id) {
      this.$request
        .get(Api.viewSupplierOrderPayVoucher, {
          params: { order_id: this.orderId, voucher_id: id },
        })
        .then((res) => {
          if (res.code === 0) {
            if (res.data.length > 0) {
              this.images = res.data.map((item) => item.image);
              this.dialogVisible = true;
            } else {
              this.$message.warning("没有凭证信息");
            }
          }
        });
    },
    // 查看物流凭证
    getviewShipping(id) {
      this.$request
        .get(Api.viewSupplierOrderShipping, {
          params: { order_id: this.orderId, shipping_id: id },
        })
        .then((res) => {
          if (res.code === 0) {
            if (res.data.length > 0) {
              this.images = res.data.map((item) => item.image);
              this.dialogVisible = true;
            } else {
              this.$message.warning("没有凭证信息");
            }
          }
        });
    },
    // 查看图片
    switchImage(type) {
      if (type === "prev" && this.imageIndex > 0) {
        this.imageIndex -= 1;
      } else if (type === "next" && this.imageIndex < this.images.length - 1) {
        this.imageIndex += 1;
      }
    },
    // 编辑发货信息
    editShipping(row) {
      this.DoShippingForm = {
        id: row.id,
        province: [],
        order_id: "",
        province_code: 0,
        city_code: 0,
        district_code: 0,
        address: row.address,
        car_no: row.car_no,
        number: row.number,
        image: [],
      };
      this.DoShippingForm.province[0] = row.province_code;
      this.DoShippingForm.province[1] = row.city_code || "";
      this.DoShippingForm.province[2] = row.district_code || "";

      this.fileList = row.image_url.map((url, i) => {
        return {
          img: row.image[i],
          url: url,
          name: row.image[i],
        };
      });

      this.DoShippingFormVisible = true;
    },
    // 删除物流信息
    delShipping(id) {
      this.$request
        .post(Api.delShipping, { order_id: this.orderId, shipping_id: id })
        .then((res) => {
          if (res.code === 0) {
            this.$message.success("删除成功");
            this.getInfo();
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    uploadShippingVoucher(file) {
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
        this.$message.error("上传凭证只能是图片或pdf格式");
        return false;
      }

      const formData = new FormData();
      formData.append("file", file.raw, file.name);
      formData.append("dir", "ShippingVoucher");
      const uploadConfig = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      this.$request
        .post(Api.uploadImage, formData, uploadConfig)
        .then((res) => {
          if (res.code === 0) {
            const data = res.data;
            data.url = res.data.img_path;
            data.name = res.data.img;
            this.fileList.push(data);
          } else {
            this.fileList = [];
            this.$message({
              message: res.msg,
              type: "error",
            });
          }
        });
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList);
      this.fileList = fileList;
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    // 上传发货凭证
    submitDoShipping() {
      this.DoShippingForm.image = this.fileList;
      this.$refs.DoShippingForm.validate((valid) => {
        if (valid) {
          const data = {
            id: this.DoShippingForm.id || "",
            order_id: this.orderId,
            province_code: this.DoShippingForm.province[0],
            city_code: this.DoShippingForm.province[1],
            district_code: this.DoShippingForm.province[2] || 0,
            address: this.DoShippingForm.address,
            car_no: this.DoShippingForm.car_no,
            number: this.DoShippingForm.number,
            image: this.fileList.map((item) => item.img),
          };
          this.$request.post(Api.SupplierOrderDoShipping, data).then((res) => {
            if (res.code === 0) {
              this.DoShippingFormVisible = false;
              this.getInfo();
            }
          });
        }
      });
    },
    // 编辑供应商信息
    saveSupplierInfo() {
      const data = {
        order_id: this.orderId,
        supplier_contacts: this.orderInfo.order_supplier_info.supplier_contacts,
        supplier_mobile: this.orderInfo.order_supplier_info.supplier_mobile,
      };
      this.$request.post(Api.editSupplier, data).then((res) => {
        if (res.code === 0) {
          this.getInfo();
          this.editSupplierInfo = false;
          this.$message.success("修改成功");
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    cancelEdit() {
      this.getInfo();
      this.editSupplierInfo = false;
    },
    backList() {
      this.$emit("back");
    },
    // 确认购买
    confirmOrderForBuy() {
      this.$request
        .post(Api.confirmOrder, { order_id: this.orderInfo.id })
        .then((res) => {
          if (res.code === 0) {
            this.getInfo();
            this.$emit("getOrderStatusCount");
          }
        });
    },
    // 确认订单
    confirmOrder(id) {
      const data = {
        order_id: id,
        auto_buyer_confirm_time: this.auto_buyer_confirm_time,

        cost_type: [],
      };
      data.order_goods = this.orderInfo.order_goods_list.map((item) => ({
        sku_id: item.sku_id,
        price: item.shop_price,
      }));
      this.orderInfo.order_has_cost_type_list.forEach((item) => {
        if (item.is_delete === 1) {
          data.cost_type.push({
            key: item.key,
            predict_fee: item.predict_fee,
          });
        }
      });

      if (!data.auto_buyer_confirm_time) {
        return this.$message.warning("请选择有效期");
      }

      this.$request.post(Api.confirmSupplierOrder, data).then((res) => {
        if (res.code === 0) {
          // this.backList()
          this.getInfo();
          this.$emit("getOrderStatusCount");
        }
      });
    },
    // 取消订单
    cancelOrder() {
      this.$request
        .post(Api.cancelSupplierOrder, {
          order_id: this.orderId,
          cancel_reason: this.cancel_reason,
        })
        .then((res) => {
          if (res.code === 0) {
            this.$message.success("关闭订单成功");
            this.cancel_reason_show = false;
            this.getInfo();
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    deleteFinalCost(index, rows) {
      rows.splice(index, 1);
    },
    priceChange(row) {
      let temp = row.shop_price.toString();
      temp = temp.replace(/。/g, ".");
      temp = temp.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
      temp = temp.replace(/^\./g, ""); //验证第一个字符是数字
      temp = temp.replace(/\.{2,}/g, ""); //只保留第一个, 清除多余的
      temp = temp.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
      temp = temp.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); //只能输入两个小数
      row.shop_price = temp;
      let total = 0;
      this.$refs.goodsTable.tableData.map((item) => {
        total += Number(item.shop_price) * Number(item.number);
      });
      this.orderInfo.order_has_cost_type_list[0].predict_fee = total.toFixed(2);
    },
  },
};
</script>
<style lang="less" scoped>
.wrap {
  background-color: #fff;
  padding: 20px;
  box-sizing: border-box;
}
.btn-group {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  .btn {
    padding: 0;
    height: 28px;
    line-height: 28px;
    border-radius: 2px;
    text-align: center;
    border: 1px solid #d5d5d5;
    margin: 0 5px;
    cursor: pointer;
  }

  .back-btn {
    width: 64px;
    background: #ffffff;
    color: #656565;
  }

  .cancel-order-btn {
    width: 76px;
    background: #ffffff;
    color: #656565;
  }

  .confirm-order-btn {
    width: 76px;
    background: #2277e8;
    border: 1px solid #2277e8;
    color: #fff;
  }
}

.card {
  border: 1px solid #e3e5e9;
  margin-bottom: 12px;

  .header {
    height: 36px;
    padding: 0 16px;
    box-sizing: border-box;
    background: #eff4fb;
    border-radius: 2px 2px 0px 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    font-family: Microsoft YaHei, Microsoft YaHei-Bold;
    font-weight: 700;
    color: #353535;
  }

  .body {
    padding: 12px;
    box-sizing: border-box;
  }
}

.info-item {
  display: flex;
  // justify-content: space-between;
  flex-wrap: wrap;

  .item {
    width: 25%;
    font-size: 12px;
    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
    font-weight: 400;
    color: #656565;
    padding: 5px;
    box-sizing: border-box;
    display: flex;
    align-items: center;

    .label {
      color: #000;
      width: 85px;
      text-align: left;
      font-size: 14px;
      font-weight: normal;
    }
  }
}

.price-info {
  padding: 10px;
  // width: 250px;
  color: #353535;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  .item {
    padding: 5px;
    display: flex;
    align-items: center;
    font-size: 12px;
    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
    font-weight: 400;
    text-align: right;
    color: #353535;

    .label {
      color: #000;
      text-align: right;
      width: 100px;
      font-size: 14px;
      font-weight: normal;
    }

    .value {
      padding-left: 10px;
      width: 130px;
      text-align: right;
      flex: 1;
    }
  }
}

:deep(.el-timeline-item) {
  margin-left: 150px;
}

:deep(.el-timeline-item__timestamp) {
  position: absolute;
  top: -6px;
  left: -150px;
}

:deep(.el-timeline-item__content) {
  font-size: 12px;
  color: #656565;
}

:deep(.table-header-style) {
  background: rgba(137, 147, 165, 0.06);

  th {
    background: transparent;
    font-size: 12px;
    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
    font-weight: 400;
    color: #656565;
  }
}

:deep(.el-table .cell) {
  padding-left: 2px;
  padding-right: 2px;
}

:deep(.el-table .el-table__cell) {
  padding: 6px 0;
}

.pro-desc {
  display: flex;
  align-items: center;
  cursor: pointer;
  .pro-name {
    margin: 0 5px;
    font-size: 12px;
    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
    font-weight: 400;
    text-align: left;

    p:first-child {
      color: #353535;
      padding: 0;
    }

    p:last-child {
      color: #959595;
      padding: 0;
    }
  }
}

:deep(.el-input.is-disabled .el-input__inner) {
  color: #656565;
}

:deep(.el-radio__input.is-disabled + span.el-radio__label) {
  color: #656565;
}

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
      top: 25px;
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

.finish-dialog :deep(.el-dialog__body) {
  background-color: #fff;
  padding: 10px;

  .el-form-item__label {
    text-align: left;
  }

  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;

    & > span {
      font-size: 14px;
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      font-weight: 400;
      text-align: right;
      color: #353535;
      line-height: 18px;
    }

    .tips {
      font-size: 12px;
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      font-weight: 400;
      text-align: right;
      color: #656565;
      line-height: 18px;
    }
  }
}

.page {
  margin: 10px auto 0;
  width: 300px;
  display: flex;
  justify-content: space-around;
  align-items: center;

  .page-btn {
    padding: 4px 12px;
    background: #ffffff;
    color: #656565;
    border: 1px solid #d5d5d5;
    font-size: 12px;
    text-align: center;
    cursor: pointer;
  }
}

.heji-price {
  font-size: 14px;
  font-family: Microsoft YaHei, Microsoft YaHei-Bold;
  font-weight: 700;
  color: #e84b01;
}
</style>
  