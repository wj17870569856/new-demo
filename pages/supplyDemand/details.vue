<template>
  <div class="wrap">

    <div class=" content">

      <div class="sd-detail">
        <Breadcrumb :list="breadcrumb"/>
        <div class="bottom-container">
          <div class="left">
            <div class="card">
              <div class="card-title ">
                <div class="left-text">客户信息</div>
              </div>
              <div class="card-body">
                <div class="item" style="width: 100%">
                  <div class="label">公司</div>
                  <div class="value">{{ order.company_name }}</div>
                  <div v-if="order.status === 2" class="tag running">
                    进行中
                  </div>
                  <div v-if="order.status === 4" class="tag close">已关闭</div>
                </div>
                <div class="item-box">
                  <div class="item">
                    <div class="label">联系人</div>
                    <div class="value">
                      <span v-if="token == ''" @click="clickLogin" class="login-view">登录查看</span>
                      <span v-else>{{ order.contact_name }}</span>
                    </div>
                  </div>
                  <div class="item">
                    <div class="label">联系电话</div>
                    <div class="value">
                      <span v-if="token == ''" @click="clickLogin" class="login-view">登录查看</span>
                      <span v-if="token">
                        {{ showFullMobile ? order.mobile : halfMobile }}
                        <span @click="clickShowFullMobile" v-if="!showFullMobile && order.status !== 4"
                          class="login-view">点击查看</span>
                      </span>
                    </div>
                  </div>
                  <div class="item">
                    <div class="label">地址</div>
                    <div class="value">{{ order.region }}</div>
                  </div>
                  <div class="item">
                    <div class="label">截止时间</div>
                    <div class="value">
                      {{
                        order.status === 4
                          ? "-"
                          : order.deadline_long === 1
                            ? "长期有效"
                            :  $moment(order.deadline * 1000).format('yyyy-MM-DD')  + ' 23:59:59'
                      }}
                    </div>
                  </div>
                  <div class="item">
                    <div class="label">发布时间</div>
                    <div class="value">
                      {{ dateFormatter(order.create_time) }}
                    </div>
                  </div>
                  <div class="item">
                    <div class="label">单号</div>
                    <div class="value">{{ order.order_sn }}</div>
                  </div>
                </div>
              </div>
            </div>



            <div class="card" v-if="!(order.type == 3 && order.information_type == 1)">
              <div class="card-title">
                <div class="left-text">清单明细</div>
                <div class="right-btn" @click="downloadList">下载清单</div>
              </div>
              <div class="card-body">
                <el-table ref="listTable" :data="order.details" stripe style="width: 100%" size="mini"
                  :header-row-style="{ background: '#e9f0fa' }" :header-cell-style="{
                    background: 'transparent',
                    color: '#353535',
                    fontSize: '12px',
                  }">
                  <el-table-column type="index" label="序号" width="60" align="center">
                  </el-table-column>
                  <el-table-column prop="category" label="分类" width="160" align="center">
                  </el-table-column>
                  <el-table-column prop="content" label="需求名称" align="center">
                  </el-table-column>
                  <el-table-column prop="num" label="数量" align="center" width="160">
                    <template slot-scope="scope">
                      <span>{{ scope.row.num + scope.row.unit }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <div class="card" id="scrollView">
              <div class="card-title">
                <div class="left-text">供需要求</div>
              </div>
              <div class="card-body">
                <div class="item" style="width: 100%" v-if="order.type == 3">
                  <div class="label">收货地址</div>
                  <div class="value">
                    <span v-for="(re, i) in order.receive" :key="i">{{ re.region }}
                      <span v-if="i < order.receive.length - 1">，</span>
                    </span>
                  </div>
                </div>
                <div class="item" style="width: 100%" v-if="order.type == 3 && order.information_type == 1">
                  <div class="label">车型</div>
                  <div class="value">
                    <span v-for="(model, index) in order.vehicle_model" :key="index">{{ model }} &nbsp;</span>
                  </div>
                </div>
                <div class="item" style="width: 100%" v-if="order.type == 3 && order.information_type == 1">
                  <div class="label">车长</div>
                  <div class="value">{{ order.vehicle_length }}</div>
                </div>
                <div class="item" style="width: 100%" v-if="order.type == 3 && order.information_type == 1">
                  <div class="label">货物</div>
                  <div class="value">{{ order.goods }}</div>
                </div>
                <div class="item" style="width: 100%" v-if="order.type == 3 && order.information_type == 1">
                  <div class="label">数量</div>
                  <div class="value">{{ order.number + order.unit }}</div>
                </div>
                <div class="item" style="width: 100%">
                  <div class="label">补充说明</div>
                  <div class="value">{{ order.remark }}</div>
                </div>
                <div class="item" style="width: 100%" v-if="order.upload">
                  <div class="label">附件</div>

                  <el-image :preview-src-list="[this.order.upload_url]" style="width:240px;height:240px" fit="contain"
                    :src="this.order.upload_url" v-if="isImage(this.order.upload)"></el-image>
                  <div v-else class="value" style="color: #4186fa; cursor: pointer" @click="downLoadFile">
                    下载附件
                  </div>


                </div>
              </div>
            </div>



            <div class="card"
              v-if="order.information_type == '1' && order.status != 4 && (userInfo.realname !== order.create_user || tableData.length > 0)">
              <div class="card-title">
                <div class="left-text">我要报价</div>
                <div class="right-btn" @click="addSupply">
                  新建报价
                </div>
              </div>


              <div class="card-body" v-if="supplyDialogVisible">
                <el-table key="editTable" :data="price_details" stripe style="width: 100%" size="mini"
                  :header-row-style="{ background: '#e9f0fa' }" :header-cell-style="{
                    background: 'transparent',
                    color: '#353535',
                    fontSize: '12px',
                  }">
                  <el-table-column type="index" label="序号" width="60" align="center">
                  </el-table-column>
                  <el-table-column prop="category" label="分类" width="160" align="center">
                    <template slot-scope="{ row }">
                      {{ row.category || row.goods_name }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="content" label="需求名称" align="center" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="num" label="数量" align="center" width="80">
                  </el-table-column>
                  <el-table-column prop="unit" label="单位" align="center" width="80">
                  </el-table-column>
                  <el-table-column label="单价/元" align="center" width="100">
                    <template slot-scope="{ row }">
                      <el-input maxlength="12" v-model="row.unit_price" size="mini" placeholder="请输入"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="amount" label="小计/元" align="center" width="120">
                    <template slot-scope="{ row }">
                      <el-input :value="getAmount(row)" disabled size="mini"></el-input>
                    </template>
                  </el-table-column>
                </el-table>
                <el-row style="margin-top: 12px">
                  <el-form label-width="140px" size="mini">
                    <el-form-item label="报价有效时间：" required>
                      <el-date-picker value-format="timestamp" v-model="formData.exp_date" type="datetime"
                        placeholder="选择报价有效时间" :picker-options="{
                          disabledDate: (time) => {
                            return this.getStatus(time);
                          },
                        }">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item label="发货日期：" required>
                      <el-date-picker value-format="timestamp" v-model="formData.take_confirm_time" type="date"
                        placeholder="请选择">
                      </el-date-picker>
                      <el-tooltip content="预计生产完毕装车发货的日期

" placement="top">
                        <i class="el-icon-question"></i>
                      </el-tooltip>
                    </el-form-item>
                    <el-form-item label="订单备注：">
                      <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="formData.remark"></el-input>
                    </el-form-item>
                    <el-form-item label="订单总金额：">
                      {{ getTotalAmount }}元
                    </el-form-item>
                  </el-form>
                </el-row>


                <el-row style="text-align:right;margin:20px" class="dialog-footer">
                  <el-button @click="closeBySupplyDialog" size="mini">关 闭</el-button>
                  <el-button type="primary" size="mini" @click="submitBySupplyDialog">提交报价</el-button>
                </el-row>

              </div>




              <div class="card" style="padding: 20px 16px" id="mySupply" ref="mySupply" v-if="token">
                <!-- 我的报价列表 -->
                <el-tabs v-model="activeName" @tab-click="handleClick">
                  <el-tab-pane label="全部" name="0"></el-tab-pane>
                  <el-tab-pane :label="'已下单(' + countInfo.order_num + ')'" name="3"></el-tab-pane>
                  <el-tab-pane :label="'已选中(' + countInfo.checked_num + ')'" name="2"></el-tab-pane>
                  <el-tab-pane :label="'报价中(' + countInfo.process_num + ')'" name="1"></el-tab-pane>
                </el-tabs>

                <el-table :data="tableData" stripe @row-click="rowClick" :empty-text="token ? '暂无数据' : '登录查看'"
                  size="mini" ref="tabTable" :header-row-style="{ background: '#e9f0fa' }" :header-cell-style="{
                    background: 'transparent',
                    color: '#353535',
                    fontSize: '12px',
                  }">
                  <el-table-column type="expand">
                    <template slot-scope="{ row }">
                      <div class="card-body">
                        <el-table key="editTable" :data="row.price_details" stripe style="width: 100%" size="mini"
                          :header-row-style="{ background: '#e9f0fa' }" :header-cell-style="{
                            background: 'transparent',
                            color: '#353535',
                            fontSize: '12px',
                          }">
                          <el-table-column type="index" label="序号" width="60" align="center">
                          </el-table-column>
                          <el-table-column prop="category" label="分类" width="160" align="center">
                            <template slot-scope="{ row }">
                              {{ row.category || row.goods_name }}
                            </template>
                          </el-table-column>
                          <el-table-column prop="content" label="需求名称" align="center" show-overflow-tooltip>
                          </el-table-column>
                          <el-table-column prop="num" label="数量" align="center" width="80">
                          </el-table-column>
                          <el-table-column prop="unit" label="单位" align="center" width="80">
                          </el-table-column>
                          <el-table-column label="单价/元" align="center" width="100">
                            <template slot-scope="{ row }">
                              <span>{{ formatMoney(row.unit_price) }}</span>
                            </template>
                          </el-table-column>
                          <el-table-column prop="amount" label="小计/元" align="center" width="120">
                            <template slot-scope="{ row }">
                              <span>{{ formatMoney(row.total_price) }}</span>
                            </template>
                          </el-table-column>
                        </el-table>
                        <el-row style="margin-top: 12px">
                          <el-form label-width="140px" size="mini">
                            <el-form-item label="报价有效时间：">
                              <span>
                                {{
                                  $moment(row.exp_date * 1000).format(
                                    "yyyy-MM-DD HH:mm"
                                  )
                                }}
                              </span>
                            </el-form-item>
                            <el-form-item label="发货日期：">
                              <span>
                                {{
                                  $moment(row.take_confirm_time * 1000).format(
                                    "yyyy-MM-DD"
                                  )
                                }}
                              </span>
                            </el-form-item>
                            <el-form-item label="订单备注：">
                              <span>{{ row.remark }}</span>
                            </el-form-item>
                          </el-form>
                        </el-row>
                      </div>
                    </template></el-table-column>

                  <el-table-column label="状态" prop="status_name" align="center">
                    <template slot-scope="{ row }">
                      <el-tag :type="row.price_status_name === '报价结束'
                        ? 'info'
                        : row.price_status_name === '已下单' ||
                          row.price_status_name === '已选中'
                          ? 'success'
                          : 'warning'
                        ">
                        {{ row.price_status_name }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="报价时间" prop="create_time" align="center">
                    <template slot-scope="{ row }">
                      {{
                        $moment(row.create_time * 1000).format(
                          "yyyy/MM/DD HH:mm:ss"
                        )
                      }}
                    </template>
                  </el-table-column>



                  <el-table-column label="报价有效截止时间" prop="exp_date" align="center">
                    <template slot-scope="{ row }">
                      {{
                        $moment(row.exp_date * 1000).format(
                          "yyyy/MM/DD HH:mm:ss"
                        )
                      }}
                    </template>
                  </el-table-column>








                  <el-table-column label="订单总金额" prop="money" align="center">
                    <template slot-scope="{ row }">
                      {{ formatMoney(row.money) }}
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" align="center">
                    <template slot-scope="{ row }">
                      <el-button v-if="row.price_status_name === '报价中' || row.price_status_name === '报价结束'" type="text"
                        @click.stop="showEdit(row)">编辑
                      </el-button>
                      <el-button type="text" v-if="row.rel_order_id"
                        @click="navOrder(row.rel_order_id)">查看订单</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-pagination style="text-align: right; margin: 20px 0" small layout="prev, pager, next, jumper"
                  :total="total" :page-size="4" :pager-count="5" :current-page="pageData.page"
                  @current-change="handleCurrentChange">
                </el-pagination>
              </div>
              <div class="login-btn" v-else style="text-align:center;margin:40px">
                <el-button type="primary" @click="navLoginPage">登录查看</el-button>
              </div>
            </div>




            <div class="card" v-if="order.related_goods && order.related_goods.length">
              <div class="card-title">
                <div class="left-text">关联产品</div>
              </div>
              <div class="card-body">
                <el-table :data="order.related_goods" border style="width: 100%" size="mini"
                  :header-row-style="{ background: '#e9f0fa' }" :header-cell-style="{
                    background: 'transparent',
                    color: '#353535',
                    fontSize: '12px',
                  }">
                  <el-table-column prop="content" label="商品">
                    <template slot-scope="{ row }">
                      <div style="display: flex; align-items: baseline">
                        <el-image style="width: 60px; height: 60px" :src="row.image_url"></el-image>
                        <span style="margin-left: 8px">{{
                          row.goods_name
                        }}</span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="num" label="价格" width="180" align="center">
                    <template slot-scope="{ row }">
                      ￥{{ (Number(row.sku_shop_price) / 100).toFixed(2) }} /
                      {{ row.unit_name }}
                    </template>
                  </el-table-column>

                  <el-table-column prop="index" label="操作" width="120" align="center">
                    <template slot-scope="{ row }">
                      <el-button type="text">
                        <a target="_blank" style="color: #4186fa" :href="'/productDetails?id=' + row.sku_id">
                          查看产品详情
                        </a>
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import utils from "@/utils/index.js";
import { mapState } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Api from "../../plugins/api";
import config from "~/config";
import axios from "axios";

export default {
  name: "SdDetails",
  layout:'supply',
  components: {
    Breadcrumb
  },
  async asyncData({ query, route }) {
    let url = config.baseUrl + Api.shopIndex;
    let url2 = config.baseUrl + Api.getSupplyOrderInfo;
    let url3 = config.baseUrl + Api.getSupplyOrderList;
    let url4 = config.baseUrl + Api.getRecommendSearchWordList;
    let order = {};

    const res1 = await axios.get(url2, { params: { id: query.id } });
    if (res1.data.code === 0) {
      order = res1.data.data;

    }

    return axios.all([axios.get(url), axios.get(url4)]).then(
      axios.spread(function (res, res2) {
        return {
          config,
          productSortList: res.data.data.category_list,
          keywordArr: res2.data.data,
          breadcrumb: [
            { name: "供需大厅", path: "/supplyDemand" },
            { name: "供需详情", },
          ],
          order: order,
        };
      })
    );
  },
  data() {
    return {
      userInfo: {},
      price_details: [],
      formData: {},
      countInfo: {
        checked_num: 0,
        order_num: 0,
        process_num: 0,
      },
      activeName: "0",
      tableData: [],
      total: 0,
      pageData: {
        page: 1,
        page_size: 4,
      },
      supplyDialogVisible: false,
      id: "",
      order: {
        details: [],
        create_user: "",
      },
      rightList: [],
      showFullMobile: false,
      halfMobile: "",
      breadcrumb: [
        { name: "供需大厅", path: "/supplyDemand" },
        { name: "供需详情", },
      ],
      productSortList: [],
      config: {},
      keywordArr: [],
    };
  },


  computed: {
    ...mapState(["token"]),
    getTotalAmount() {
      const order = this.price_details;
      var amount = 0;
      order.forEach((element) => {
        let rowAmount = this.getAmount(element);
        amount = utils.performOperation("add", rowAmount, amount);
      });
      return amount;
    },
  },
  watchQuery: ["id"],
  mounted() {
    this.id = this.$route.query.id;
    this.getDetails(this.id);
    if (this.token) {
      this.userInfo = sessionStorage.getItem("userInfo")
        ? JSON.parse(sessionStorage.getItem("userInfo"))
        : {
          realname: "",
        };
      this.addSupplyOrderLog(2);
    }
  },
  methods: {
    isImage(filename) {
      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];
      const extension = filename.split('.').pop().toLowerCase();
      return imageExtensions.includes(extension);
    },
    navLoginPage() {
      window.$nuxt.$store.commit('setToken', '')
      window.$nuxt.$Cookies.remove('cloud_token')
      window.$nuxt.$Cookies.remove('welfare_token')
      window.$nuxt.$Cookies.remove('userInfo')
      window.$nuxt.$router.push('/login')
    },
    navOrder(id) {
      this.$router.push('/personalCenter/sellerList?order_id=' + id)
    },
    getStatus(time) {
      if (this.order.deadline_long === 1) {
        return false;
      } else {
        return this.order.deadline * 1000 < time.getTime() || time.getTime() < Date.now() - 8.64e7;
        // return time.getTime() > this.order.deadline * 1000;
      }
    },
    handleClick() {
      this.pageData = {
        page: 1,
        page_size: 4,
      };
      this.getMyQuotes();
    },
    handleCurrentChange(val) {
      this.pageData.page = val;
      this.getMyQuotes();
    },
    getMyQuotes(num) {
      this.$request
        .get(Api.getMyPrices, {
          params: {
            supply_order_id: this.id,
            ...this.pageData,
            status: this.activeName,
          },
        })
        .then((res) => {
          if (res.code === 0) {
            this.tableData = res.data.data || [];
            this.total = res.data.total;
            this.countInfo = res.data.summary;
            this.$nextTick(() => {
              if (this.tableData.length > 0) {
                this.rowClick(this.tableData[0]);
              }
              if (num == '1' && this.tableData.length == '0' && this.token) {
                this.supplyDialogVisible = true;
              }
            })
          }
        });
    },
    addSupply() {
      if (this.token) {
        this.closeBySupplyDialog();
        this.supplyDialogVisible = true;
      } else {
        window.$nuxt.$message.warning('请先登录')
        this.navLoginPage();
      }

    },
    submitBySupplyDialog() {
      var details = [];
      for (let i = 0; i < this.price_details.length; i++) {
        const element = this.price_details[i];
        if (!element.unit_price || isNaN(Number(element.unit_price))) {
          return this.$message.error("请输入正确的单价");
        }
        details.push({
          order_detail_id: element.req_order_detail_id || element.id,
          unit_price: element.unit_price,
        });
      }

      let d = {
        ...this.formData,
        supply_order_id: this.id,
        details,
      };

      if (d.exp_date) {
        d.exp_date = d.exp_date / 1000;
      } else {
        return this.$message.error("请选择报价有效时间");
      }

      if (d.take_confirm_time) {
        d.take_confirm_time = d.take_confirm_time / 1000;
      } else {
        return this.$message.error("请选择发货日期");
      }

      const loading = this.$loading();
      this.$request
        .post(Api.addPrice, d)
        .then((res) => {
          if (res.code === 0) {
            this.getDetails(this.id);
            this.$message.success(res.msg);
          } else {
            this.$message.error(res.msg);
          }
          this.closeBySupplyDialog();
          loading.close();
        })
        .catch(() => {
          loading.close();
        });
    },
    rowClick(row) {
      this.$refs['tabTable']&&this.$refs['tabTable'].toggleRowExpansion(row)
    },
    closeBySupplyDialog() {
      var price_details = this.price_details;
      price_details.forEach(element => {
        this.$set(element, 'unit_price', '');
      });
      this.formData = {};
      this.supplyDialogVisible = false;
    },
    showEdit(row) {
      var price_details = this.price_details;




      price_details.forEach(element => {




        let now = row.price_details.find((item) => item.category_id == element.category_id);
        if (now) {
          this.$set(element, 'unit_price', this.formatMoney(now.unit_price))
        }
      });






      this.formData = {
        take_confirm_time: row.take_confirm_time * 1000,
        exp_date: row.exp_date * 1000,
        remark: row.remark,
        id: row.id
      }


      this.supplyDialogVisible = true;
      document.getElementById('scrollView').scrollIntoView({ behavior: "smooth", block: 'start' });
    },
    getAmount(row) {
      if (
        !row.num ||
        isNaN(row.num) ||
        !row.unit_price ||
        isNaN(row.unit_price)
      )
        return 0;
      return utils.performOperation("multiply", row.unit_price, row.num);
    },
    clickLogin() {
      this.$router.push({
        path: "/login",
        query: {
          backPage: `/supplyDemand/details?id=${this.$route.query.id}`,
        },
      });
    },
    getDays(t) {
      t = t * 1000;
      const days = this.$moment(t).diff(this.$moment(), "days");
      return days;
    },
    gotoPage(nav, query) {
      this.$router.push({ path: nav.path, query });
    },
    // 记录用户行为
    addSupplyOrderLog(is_phone = 2) {
      this.$request
        .get(Api.addSupplyOrderLog, { params: { id: this.id, is_phone } })
        .then((res) => {
          console.log(res);
        });
    },
    clickShowFullMobile() {
      this.showFullMobile = true;
      this.addSupplyOrderLog(1);
    },
    formatMoney(num) {
      return utils.performOperation("divide", num, 100, 2);
    },
    // 获取详情
    getDetails(id) {
      this.$request
        .get(Api.getSupplyOrderInfo, { params: { id } })
        .then((res) => {
          if (res.code === 0) {
            this.order = res.data;
            this.price_details = this.order.details;
            this.halfMobile = this.order.mobile.substr(0, 7) + "****";
            if (this.token) {
              this.getMyQuotes(1);
            }
            //this.getOtherList(this.order.id, this.order.type, this.order.information_type)
          }
        });
    },
    gotoDetails(id) {
      this.$router.replace({ path: "/supplyDemand/details", query: { id } });
      this.rightList = [];
      this.getDetails(id);
    },
    // 获取右侧列表
    getOtherList(id, type, information_type) {
      this.$request
        .get(Api.getSupplyOrderList, {
          params: { unshow_id: id, page: 1, limit: 3, type, information_type },
        })
        .then((res) => {
          if (res.code === 0) {
            this.rightList = res.data;
          }
        });
    },
    async downLoadFile() {
      if (!this.token) {
        this.$router.push({
          path: "/login",
          query: { backPage: this.$route.fullPath },
        });
      } else {



        fetch(this.order.upload_text)
          .then(response => response.blob())
          .then(blob => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = this.order.upload_text;
            link.target = "_blank";
            link.click();
          });
      }
    },
    downloadList() {
      if (!this.token) {
        this.$router.push({
          path: "/login",
          query: { backPage: this.$route.fullPath },
        });
        return;
      }
      // const h = this.$refs.listTable.columns.map((item) => item.label)
      // const header = { header: h }
      const data = this.order.details.map((item, i) => ({
        序号: i + 1,
        分类: item.category,
        需求名称: item.content,
        数量: item.num,
      }));
      const xlsxName = `清单列表`;
      const ws = this.$xlsx.utils.json_to_sheet(data);
      const wb = this.$xlsx.utils.book_new();
      this.$xlsx.utils.book_append_sheet(wb, ws, xlsxName);
      this.$xlsx.writeFile(wb, xlsxName + ".xlsx");
    },
    dateFormatter(t) {
      t = t * 1000;
      return this.$moment(t).format("yyyy-MM-DD");
    },
  },
};
</script>

<style scoped lang="less">

.main {
  background-color: #fff;
 
}

.sd-detail {
  padding: 20px 12px;
  margin: 0 auto;
  position: relative;
  padding-bottom: 120px;
}

.login-view {
  color: #4186fa;
  cursor: pointer;
}

.bottom-container {
  display: flex;
  width: 100%;
  .left {
    width: 100%;
    
    .card {
      margin-bottom: 20px;
      border: 1px solid #e5e5e5;

      .card-title {
height: 46px;
background: #C3D3E2;
display: flex;
align-items: center;
justify-content: space-between;
padding:0 20px;
box-sizing: border-box;

        .left-text {
font-weight: 500;
font-size: 16px;
color: #0A1833;
line-height: 23px;
        }

        .right-btn {
          width: 58px;
          height: 20px;
          line-height: 20px;
          background: #4186fa;
          border: 1px solid #4186fa;
          border-radius: 2px;
          font-size: 12px;
          font-family: Microsoft YaHei, Microsoft YaHei-Regular;
          font-weight: 400;
          text-align: center;
          color: #ffffff;
          cursor: pointer;
        }
      }

      .card-body {
        padding: 20px 16px;
        box-sizing: border-box;
        min-height: 100px;

        .item-box {
          display: flex;
          flex-wrap: wrap;
        }

        .item {
          width: 33.33%;
          margin-bottom: 16px;
          display: flex;
          align-items: center;

          .tag {
            font-size: 10px;
            font-family: Microsoft YaHei, Microsoft YaHei-Regular;
            font-weight: 400;
            text-align: center;

            width: 46px;
            height: 18px;
            line-height: 18px;
            background: #ffffff;

            border-radius: 10px;
            margin-left: 8px;
          }

          .running {
            color: #e84b01;
            border: 1px solid #e84b01;
          }

          .close {
            color: #ffffff;
            background: #959595;
          }

          .label {
            font-size: 14px;
            font-family: Microsoft YaHei, Microsoft YaHei-Regular;
            font-weight: 400;
            text-align: right;
            color: #959595;
            width: 80px;
            padding: 0 10px;
            box-sizing: border-box;
          }

          .value {
            font-size: 14px;
            font-family: Microsoft YaHei, Microsoft YaHei-Regular;
            font-weight: 400;
            color: #353535;
          }
        }
      }
    }
  }

  .right {
    width: 284px;
    background: #ffffff;
    padding: 11px;
    box-sizing: border-box;
    border: 1px solid #e5e5e5;

    .sub-title {
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      height: 19px;
      font-size: 14px;
      font-weight: 400;
      text-align: left;
      color: #353535;
      line-height: 18px;
      display: flex;
      align-items: center;
      padding: 9px;
      // border-bottom: 2px solid #efefef;

      &::before {
        content: "";
        display: block;
        height: 12px;
        border: 2px solid #4186fa;
        margin-right: 5px;
      }
    }

    .card {
      width: 260px;
      height: 170px;
      border: 1px solid #fcf1e2;
      margin-bottom: 10px;
      cursor: pointer;

      // border: 1px solid #efd7ae;
      .top {
        background-color: #fff9f0;
        padding: 0 10px;

        .main-pro {
          font-size: 14px;
          font-weight: 700;
          color: #353535;
          font-family: Microsoft YaHei, Microsoft YaHei-Regular;
          padding: 13px 0;
          border-bottom: 1px solid #e5e5e5;
        }

        .company {
          font-size: 13px;
          font-family: Microsoft YaHei, Microsoft YaHei-Regular;
          font-weight: 400;
          text-align: center;
          color: #353535;
          padding: 13px 0;
        }
      }

      .bottom {
        display: flex;
        justify-content: space-around;
        align-items: center;
        height: 80px;

        &>div {
          width: 130px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          .label {
            font-size: 12px;
            font-family: Microsoft YaHei, Microsoft YaHei-Regular;
            font-weight: 400;
            text-align: center;
            color: #959595;
          }

          .value {
            font-size: 14px;
            font-family: Microsoft YaHei, Microsoft YaHei-Regular;
            font-weight: 400;
            text-align: center;
            color: #353535;
          }
        }

        &>.v-line {
          width: 0;
          height: 60%;
          border-left: 1px solid #e5e5e5;
        }
      }
    }
  }
}

:deep(.el-table__row--striped) {
  background-color: rgba(137, 147, 165, 0.06);
}
</style>
