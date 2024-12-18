<template>
  <div class="card-body">
    <div
      v-for="(pro, i) in list"
      :key="i"
      class="card"
    >
      <a :alt="pro.name"
         :href="config.link_domain + `/productDetails?id=${pro.sku_id}`"
         target="_blank">
        <div class="image">
          <span v-if="pro.store_type === 1" class="type">自营</span>
          <el-image
            style="width: 100%; height: 194px; border: 1px solid #d5d5d5"
            fit="contain"
            :src="pro.image_url"
          ></el-image>
        </div>
        <!--    价格    -->
        <div class="price">
          <span v-show="pro.sku_shop_price != 0">¥</span>
          <span class="num">{{
              pro.sku_shop_price == 0 ? '电议' : pro.sku_shop_price
            }}</span>
          <span v-show="pro.sku_shop_price != 0" class="unit"
          >/{{ pro.unit_name }}</span
          >
        </div>
        <!--    信息     -->
        <div class="info">
          <div class="title text-ellipsis-2">{{ pro.name }}</div>
          <div class="describe">
            {{ pro.brief }}
          </div>
        </div>
      </a>
      <!--   公司     -->
      <div class="company">
        <div style="display: flex">
          <div v-if="pro.store_type !== 1 && pro.store_level" class="type">
            <el-image
              style="width: 32px; height: 20px"
              :src="level[pro.store_level - 1]"
              fit="fit"
            ></el-image>
          </div>
          <a class="name"
             :alt="pro.shop_name"
             :href=" pro.store_type == 1 ? config.link_domain + `/productList?sort1=-1` : config.link_domain +'/company?id='+pro.shop_id "
             target="_blank">
            <span>{{  pro.shop_name }}</span>
          </a>
        </div>
        <el-popover
          class="item"
          effect="light"
          placement="bottom"
          :popper-class="token ? 'my-tooltip' : 'my-tooltip-login'"
          trigger="hover"
          width="50"
        >
          <div @click="clicktooltip">
            {{
              token
                ? `${pro.service_realname}  ${pro.service_mobile}`
                : '登录查看'
            }}
          </div>
          <div slot="reference" style="font-size: 16px">
            <svg-icon icon-class="contact_icon"></svg-icon>
          </div>
        </el-popover>
      </div>
    </div>
    <div class="card-empty"></div>
    <div class="card-empty"></div>
    <div class="card-empty"></div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import lv1 from '~/assets/images/level/lv1@2x.png'
import lv2 from '~/assets/images/level/lv2@2x.png'
import lv3 from '~/assets/images/level/lv3@2x.png'

export default {
  name: 'ProductTransverse',
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    config: {
      type: Object,
      default: () => {
        return {}
      },
    }
  },
  data() {
    return {
      level: [lv1, lv2, lv3],
      num: 1,
    }
  },
  computed: {
    ...mapState(['token']),
  },
  mounted() {
  },
  methods: {
    clicktooltip() {
      if (!this.token) {
        this.$router.push({
          path: '/login',
          query: {backPage: this.$route.fullPath},
        })
      }
    },
    gotoCompany(pro) {
      this.$router.push({path: '/company', query: {id: pro.shop_id}})
    },
    gotoDetail(id) {
      window.open(`/productDetails?id=${id}`)
      // this.$router.push({ path: '/productDetails', query: { id } })
    },
  },
}
</script>

<style lang="less" scoped>
.card-body {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .card {
    width: 16.5%;
    padding: 16px;
    margin-bottom: 12px;
    background: #ffffff;
    border-radius: 4px;

    &:hover {
      box-shadow: 0px 8px 16px 0px rgba(23, 36, 63, 0.16);
      transform: scale(1.01);
      z-index: 999;
    }

    .image {
      position: relative;
      margin-bottom: 8px;

      .type {
        position: absolute;
        top: -4px;
        right: -4px;
        padding: 4px 12px;
        height: 16px;
        line-height: 16px;
        background: linear-gradient(158deg, #2263e8 0%, #35aeff 97%);
        border-radius: 13px;
        font-size: 12px;
        font-weight: 400;
        text-align: center;
        color: #ffffff;
        z-index: 888;
      }
    }

    .price {
      margin-bottom: 8px;
      color: #e84b01;

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

    .info {
      margin-bottom: 11px;
      font-size: 14px;
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      font-weight: 400;
      text-align: left;
      color: #353535;

      .title {
        margin-bottom: 4px;
        line-height: 18px;
        cursor: pointer;
        height: 36px;
      }

      .describe {
        line-height: 18px;
      }
    }

    .company {
      display: flex;
      justify-content: space-between;

      .type {
        margin-right: 4px;
      }

      .name {
        margin-right: 4px;
        font-size: 12px;
        font-family: Microsoft YaHei, Microsoft YaHei-Regular;
        font-weight: 400;
        text-align: left;
        color: #959595;
        line-height: 19px;
        cursor: pointer;
      }
    }
  }

  .card-empty {
    width: 16.5%;
    padding: 16px;
    margin-bottom: 12px;
    background-color: transparent;
  }
}
</style>
