<!-- 我收藏的商品  -->
<template>
  <div class="myCollectionGoods">
    <div class="title">收藏的商品</div>
    <el-table :data="collectLists" tooltip-effect="dark" style="width: 100%" stripe
              header-row-class-name="table-header-style">
      <el-table-column label="商品" align="center">
        <template slot-scope="scope">
          <div class="goods">
            <img :src="scope.row.image" style="width: 64px;height: 64px;">
            <div class="right">
              <p class="name">{{ scope.row.name }}</p>
              <p class="sku-attr">{{ scope.row.goods_sku_attr }}</p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="价格" align="center" width="250">
        <template slot-scope="scope">
          <div>
            <div class="new-price">
              {{ scope.row.sku_shop_price != 0 ? '¥' + scope.row.sku_shop_price : '电议' }}
            </div>
            <div class="prevailing-price">
              当时收藏价格：{{ scope.row.collect_price != 0 ? '¥' + scope.row.collect_price : '电议' }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="250">
        <template slot-scope="scope">
          <div class="action">
            <el-link class="distance" size="mini" type="info" :underline="false"
                     @click="cancelCollection(scope.row.id)">取消收藏
            </el-link>
            <el-link class="distance" size="mini" type="info" :underline="false"
                     @click="gotoCompany(scope.row.shop_id)">进入店铺
            </el-link>
            <el-link size="mini" type="primary" :underline="false"
                     @click="addOrder({ number: 1, sku_id: scope.row.id })">加入购物车
            </el-link>
            <!--            <el-button size="mini" type="text" @click="cancelCollection(scope.row.id)">取消收藏</el-button>-->
            <!--            <el-button size="mini" type="text" @click="gotoCompany(scope.row.shop_id)">进入店铺</el-button>-->
            <!--            <el-button size="mini" type="text" @click="addOrder({ number: 1, sku_id: scope.row.id })">加入采购单</el-button>-->
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="text-align: right; margin: 20px 0" small layout="prev, pager, next, jumper"
                   :total="search.total" :page-count="10" :pager-count="5" :current-page="search.page"
                   @current-change="handleCurrentChange">
    </el-pagination>
  </div>
</template>

<script>
/* eslint-disable */

import Api from "~/plugins/api";

export default {
  layout: 'personalCenter',
  name: "myCollectionGoods",
  middleware: "auth",
  data() {
    return {
      collectLists: [],
      search: {
        total: 0,
        page: 1,
      }
    }
  },
  mounted() {
    this.getCollectionGoods()
  },
  methods: {
    getCollectionGoods() {
      this.$request
        .get(Api.getGoodsCollectLists, {params: {page: this.search.page, pagesize: 10}})
        .then((res) => {
          this.collectLists = res.data.data
          this.search.total = res.data.total
        })
    },
    handleCurrentChange(val) {
      this.search.page = val
      this.getCollectionGoods()
    },
    cancelCollection(sku_id) {
      this.$request.get(Api.cancelGoodsCollect, {params: {sku_id: sku_id}}).then(res => {
        if (res.code === 0) {
          this.getCollectionGoods()
          this.$message.success(res.msg)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    gotoCompany(id) {
      window.open(`/company?id=${id}`)
    },
    // 加到购物车
    addOrder(data) {
      // const data = {
      //   number: this.count,
      //   sku_id: this.id
      // }
      this.$request.post(Api.addGoodsCart, data).then(res => {
        if (res.code === 0) {
          this.$message.success('加购成功')
          this.$request.get(Api.getGoodsCartCount).then(res => {
            this.$store.commit('setGoodsCartCount', res.data)
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
  }
}
</script>
<style lang="less" scoped>
.myCollectionGoods {
  background-color: #fff;
    padding: 20px;
    box-sizing: border-box;
    min-height: 750px;
    .title {
      font-weight: bold;
font-size: 18px;
color: #0A1833;
line-height: 21px;
margin-bottom: 10px;
    }
  :deep(.table-header-style) {
    background: rgba(137,147,165,0.06);

    th {
      background: transparent;
    }
  }

  .goods {
    display: flex;
    align-items: center;

    .right {
      margin: 0 10px;
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      font-weight: 400;
      text-align: left;
      line-height: 18px;

      p:first-child {
        font-size: 14px;
        color: #353535;
        margin-bottom: 8px;
        padding: 0;
      }

      p:last-child {
        font-size: 12px;
        color: #959595;
      }
    }
  }

  .new-price {
    font-weight: 600;
    font-size: 16px;
    color: black;
    margin-bottom: 10px;
  }

  .prevailing-price {
    font-size: 12px;
    color: black;
  }

  .action {
    .distance {
      margin-right: 20px;
    }

    :deep(.el-link) {
      font-size: 12px;
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      font-weight: 400;
    }
  }
}
</style>
