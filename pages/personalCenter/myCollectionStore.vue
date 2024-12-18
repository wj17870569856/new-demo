<template>
  <div class="myCollectionStore">
    <div class="top-title">收藏的店铺</div>
    <div class="collection-box">
      <el-table :data="collectLists" tooltip-effect="dark" style="width: 100%" stripe
                header-row-class-name="table-header-style">
        <el-table-column label="店铺" align="center">
          <template slot-scope="scope">
            <div class="left">
              <img
                :src="scope.row.logo"
                class="company-logo"
              />
              <div class="company-info">
                <div class="company-name">
                  <span class="tag">
                    <span v-if="scope.row.store_level == 0" class="ziying">
                      自营
                    </span>
                    <!-- <svg-icon v-if="item.store_level == 1" icon-class="lv1" />
                    <svg-icon v-if="item.store_level == 2" icon-class="lv2" />
                    <svg-icon v-if="item.store_level == 3" icon-class="lv3" /> -->
                    <img
                      v-if="scope.row.store_level == 1"
                      :src="lv1"
                      alt="LV1"
                      class="level-img"
                    />
                    <img
                      v-if="scope.row.store_level == 2"
                      :src="lv2"
                      alt="LV2"
                      class="level-img"
                    />
                    <img
                      v-if="scope.row.store_level == 3"
                      :src="lv3"
                      alt="LV3"
                      class="level-img"
                    />
              </span>
                  <span class="name">{{ scope.row.company_name }}</span>
                </div>
                <div class="desc">
                  <p>主营：{{ scope.row.main_product }}</p>
                </div>
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
                       @click="gotoCompany(scope.row.id)">进入店铺
              </el-link>
              <!--            <el-button size="mini" type="text" @click="cancelCollection(scope.row.id)">取消收藏</el-button>-->
              <!--            <el-button size="mini" type="text" @click="gotoCompany(scope.row.shop_id)">进入店铺</el-button>-->
              <!--            <el-button size="mini" type="text" @click="addOrder({ number: 1, sku_id: scope.row.id })">加入采购单</el-button>-->
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--    <div v-for="(item,index) in collectLists" :key="index" class="collection-box">-->
    <!--      <div class="left">-->
    <!--        <img-->
    <!--          :src="item.logo"-->
    <!--          class="company-logo"-->
    <!--        />-->
    <!--        <div class="company-info">-->
    <!--          <div class="name">-->
    <!--            <span class="tag">-->
    <!--                    <span v-if="item.store_level == 0" class="ziying">-->
    <!--                      自营-->
    <!--                    </span>-->
    <!--              &lt;!&ndash; <svg-icon v-if="item.store_level == 1" icon-class="lv1" />-->
    <!--              <svg-icon v-if="item.store_level == 2" icon-class="lv2" />-->
    <!--              <svg-icon v-if="item.store_level == 3" icon-class="lv3" /> &ndash;&gt;-->
    <!--                    <img-->
    <!--                      v-if="item.store_level == 1"-->
    <!--                      :src="lv1"-->
    <!--                      alt="LV1"-->
    <!--                      class="level-img"-->
    <!--                    />-->
    <!--                    <img-->
    <!--                      v-if="item.store_level == 2"-->
    <!--                      :src="lv2"-->
    <!--                      alt="LV2"-->
    <!--                      class="level-img"-->
    <!--                    />-->
    <!--                    <img-->
    <!--                      v-if="item.store_level == 3"-->
    <!--                      :src="lv3"-->
    <!--                      alt="LV3"-->
    <!--                      class="level-img"-->
    <!--                    />-->
    <!--              </span>-->
    <!--            <span class="name">{{ item.company_name }}</span>-->
    <!--          </div>-->
    <!--          <div class="desc">-->
    <!--            <p>主营：{{ item.main_product }}</p>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      <div>-->
    <!--        <el-button size="mini" type="text" @click="cancelCollection(item.id)">取消收藏</el-button>-->
    <!--        <el-button size="mini" type="text" @click="gotoCompany(item.id)">进入店铺</el-button>-->
    <!--      </div>-->
    <!--    </div>-->
    <el-pagination style="text-align: right; margin: 20px 0" small layout="prev, pager, next, jumper"
                   :total="search.total" :page-count="10" :pager-count="5" :current-page="search.page"
                   @current-change="handleCurrentChange"></el-pagination>
  </div>
</template>

<script>
/* eslint-disable */
import Api from "~/plugins/api";
import lv1 from "~/assets/images/level/lv1@2x.png";
import lv2 from "~/assets/images/level/lv2@2x.png";
import lv3 from "~/assets/images/level/lv3@2x.png";

export default {
  layout: 'personalCenter',
  name: "myCollectionStore",
  middleware: "auth",
  data() {
    return {
      lv1,
      lv2,
      lv3,
      collectLists: [],
      search: {
        total: 0,
        page: 1,
      }
    }
  },
  mounted() {
    this.getCollectionCompany()
  },
  methods: {
    getCollectionCompany() {
      this.$request
        .get(Api.getCompanyCollectLists, {params: {page: this.search.page, pagesize: 10}})
        .then((res) => {
          this.collectLists = res.data.data
          this.search.total = res.data.total
        })
    },
    handleCurrentChange(val) {
      this.search.page = val
      this.getCollectionCompany()
    },
    cancelCollection(id) {
      this.$request.get(Api.cancelCompanyCollect, {params: {cid: id}}).then(res => {
        if (res.code === 0) {
          this.getCollectionCompany()
          this.$message.success('取消收藏成功')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    gotoCompany(id) {
      window.open(`/company?id=${id}`)
    }
  }
}
</script>

<style lang="less" scoped>
.myCollectionStore {
  background-color: #fff;
    padding: 20px;
    min-height: 750px;
    box-sizing: border-box;

  :deep(.table-header-style) {
    background: rgba(137,147,165,0.06);

    th {
      background: transparent;
    }
  }

  .top-title {
    font-weight: bold;
font-size: 18px;
color: #0A1833;
line-height: 21px;
margin-bottom: 10px;
  }

  .collection-box {
    .left {
      display: flex;
      align-items: center;
      padding: 4px;

      .company-logo {
        width: 64px;
        height: 64px;
      }

      .company-info {
        margin-left: 12px;

        .company-name {
          margin-bottom: 10px;
          display: flex;
          align-items: center;

          .tag {
            display: flex;
            align-items: center;
            padding: 0 4px;
          }

          .name {
            font-size: 14px;
            font-family: Microsoft YaHei, Microsoft YaHei-Bold;
            font-weight: 700;
            color: #353535;
          }
        }

        .desc {
          font-size: 12px;
          font-family: Microsoft YaHei, Microsoft YaHei-Regular;
          font-weight: 400;
          text-align: left;
          color: #353535;
          line-height: 18px;
        }
      }
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
}

.level-img {
  width: 32px;
  height: 20px;
}

.ziying {
  display: inline-block;
  width: 40px;
  text-align: center;
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  color: #fff;
  background: linear-gradient(158deg, #2263e8 0%, #35aeff 97%);
  border-radius: 10px;
}
</style>
