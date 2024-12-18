<template>
  <!--  列表  -->
  <div class="product-list">
    <!--   表头   -->
    <div class="header">
      <div style="margin-right: 278px">商品信息</div>
      <div style="margin-right: 165px">加购价</div>
      <div style="margin-right: 353px">供应商</div>
      <div>采购数量</div>
    </div>
    <div
      v-for="(pro, i) in list"
      :key="i"
      :class="i % 2 == 0 ? 'content content-even' : 'content content-odd'"
    >
      <a
        style="display: flex; width: 550px"
        :alt="pro.name"
        :href="config.link_domain + `/productDetails?id=${pro.sku_id}`"
        target="_blank"
      >
        <!--    商品信息    -->
        <div class="info">
          <div class="image">
            <el-image
              style="width: 64px; height: 64px; border: 1px solid #d5d5d5"
              fit="contain"
              :src="pro.image_url"
            ></el-image>
          </div>
          <div class="text">
            <div class="title text-ellipsis">{{ pro.name }}</div>
            <div class="describe">{{ pro.brief }}</div>
          </div>
        </div>
        <!--    商品价格    -->
        <div class="price">
          <span v-show="pro.sku_shop_price != 0">¥</span>
          <span class="num">{{
            pro.sku_shop_price == 0 ? "电议" : pro.sku_shop_price
          }}</span>
          <span v-show="pro.sku_shop_price != 0" class="unit"
            >/{{ pro.unit_name }}</span
          >
        </div>
      </a>
      <!--    供应商    -->
      <div class="supplier">
        <div class="company" style="">
          <div class="type">
            <el-image
              v-if="pro.store_type !== 1 && pro.store_level"
              style="width: 32px; height: 20px"
              :src="level[pro.store_level - 1]"
              fit="fit"
            ></el-image>
            <span v-if="pro.store_type === 1" class="self-support">自营</span>
          </div>
          <a
            class="name"
            :alt="pro.shop_name"
            :href="
              pro.store_type == 1
                ? config.link_domain + `/productList?sort1=-1`
                : config.link_domain + '/company?id=' + pro.shop_id
            "
            target="_blank"
          >
            <span>{{ pro.shop_name }}</span>
          </a>
          <div>
            <el-popover
              class="item"
              effect="light"
              placement="bottom"
              :popper-class="token ? 'my-tooltip' : 'my-tooltip-login'"
              trigger="hover"
            >
              <div @click="clicktooltip">
                {{
                  token
                    ? `${pro.service_realname} ${pro.service_mobile}`
                    : "登录查看"
                }}
              </div>
              <div slot="reference" style="font-size: 16px">
                <el-image
                  style="width: 62px; height: 20px"
                  :src="customer_service"
                  fit="fit"
                ></el-image>
              </div>
            </el-popover>
          </div>
        </div>
        <el-tooltip
          :content="pro.main_product"
          placement="bottom"
          effect="light"
          :disabled="!pro.main_product"
        >
          <div class="main-business text-ellipsis">
            主营：{{ pro.main_product }}
          </div>
        </el-tooltip>
      </div>
      <!--    采购数量    -->
      <div class="quantity">
        <div @click.stop.prevent>
          <el-input-number
            v-model="pro.num"
            size="small"
            :min="pro.min_sale"
            :max="999999"
            :precision="3"
          ></el-input-number>
        </div>

        <button
          @click.stop="add(pro)"
          :class="pro.store_type === 1 ? 'btn btn-orange' : 'btn btn-blue'"
        >
          加&nbsp;购
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

import lv1 from "~/assets/images/level/lv1@2x.png";
import lv2 from "~/assets/images/level/lv2@2x.png";
import lv3 from "~/assets/images/level/lv3@2x.png";

import service from "~/assets/images/cust_service@2x.png";

export default {
  name: "ProductTransverse",
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    config: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      level: [lv1, lv2, lv3],
      level1: lv1,
      level2: lv2,
      level3: lv3,
      customer_service: service,
    };
  },
  mounted() {},
  computed: {
    ...mapState(["token"]),
  },
  methods: {
    add(pro) {
      this.$emit("add", { number: pro.num, sku_id: pro.sku_id });
    },
    handleChange() {},
    clicktooltip() {
      console.log("登录查看");
      if (!this.token) {
        this.$router.push({
          path: "login",
          query: { backPage: this.$route.fullPath },
        });
      }
    },
    gotoCompany(pro) {
      this.$router.push({ path: "/company", query: { id: pro.shop_id } });
    },
    gotoDetail(id) {
      window.open(`/productDetails?id=${id}`);
      // this.$router.push({ path: '/productDetails', query: { id } })
    },
  },
};
</script>

<style lang="less" scoped>
.product-list {
  margin-bottom: 8px;

  .header {
    display: flex;
    padding: 10px 40px;
    background: #e9f0fa;
    font-size: 12px;
    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
    font-weight: 400;
    text-align: left;
    color: #353535;
    line-height: 18px;
  }

  .content {
    display: flex;
    padding: 16px;

    &:hover {
      box-shadow: 0px 8px 16px 0px rgba(23, 36, 63, 0.16);
      transform: scale(1.01);
      z-index: 999;
    }

    .info {
      width: 350px;
      display: flex;
      align-items: center;

      .text {
        padding-left: 8px;
        font-size: 14px;
        font-family: Microsoft YaHei, Microsoft YaHei-Bold;
        text-align: left;
        color: #353535;

        .title {
          width: 230px;
          height: 19px;
          font-weight: 700;
          line-height: 18px;
          margin-bottom: 8px;
          cursor: pointer;
        }

        .describe {
          height: 19px;
          font-weight: 400;
          line-height: 18px;
        }
      }
    }

    .price {
      color: #e84b01;
      line-height: 66px;
      width: 200px;

      span {
        font-size: 12px;
      }

      .num {
        font-size: 18px;
        font-weight: 600;
      }

      .unit {
        font-size: 14px;
      }
    }

    .supplier {
      width: 390px;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .company {
        font-family: Microsoft YaHei, Microsoft YaHei-Regular;
        margin-bottom: 8px;
        display: flex;
        align-items: center;

        .type {
          margin-right: 4px;
          display: flex;
          align-items: center;
        }

        .self-support {
          display: inline-block;
          padding: 2px 8px;
          height: 16px;
          line-height: 16px;
          background: linear-gradient(158deg, #2263e8 0%, #35aeff 97%);
          border-radius: 10px;
          font-size: 12px;
          font-weight: 400;
          text-align: center;
          color: #ffffff;
        }

        .name {
          margin-right: 4px;
          font-size: 14px;
          text-align: center;
          font-weight: 400;
          line-height: 22px;
          color: #353535;
          cursor: pointer;
        }
      }

      .main-business {
        width: 320px;
        font-size: 12px;
        font-family: Microsoft YaHei, Microsoft YaHei-Regular;
        font-weight: 400;
        color: #656565;
      }
    }

    .quantity {
      display: flex;
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      padding: 18px 0px;

      .btn {
        padding: 0;
        margin-left: 8px;
        width: 60px;
        height: 32px;
        border-radius: 2px;
        border: 0px;
        font-size: 14px;
        font-weight: 400;
        text-align: center;
        color: #ffffff;
        cursor: pointer;
      }
    }
  }
}
</style>

<style scoped>
.btn-orange {
  background: #e84b01;
}

.btn-orange:hover {
  background: #f57032;
}

.btn-blue {
  background: #2263e8;
}

.btn-blue:hover {
  background: #4781f7;
}

.content-even {
  background: white;
}

.content-odd {
  background: rgba(137, 147, 165, 0.06);
}
</style>
