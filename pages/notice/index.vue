<template>
  <div>
    <NavSearch :show-list="false" :keywordArr="keywordArr"></NavSearch>
    <Seo :productSortList="productSortList" :config="config"></Seo>
    <div class="main">
      <div class="notice-page">
        <div class="h-nav">
          <span @click="gotoHome()">首页
            <svg-icon icon-class="more_icon" />
          </span>
          <span>公告列表 </span>
        </div>
        <div class="bottom-wrapper">
          <div class="left-list">
            <div class="tabs">
              <div class="tab-title">{{ parentTabName }} |</div>
              <div v-for="(tab, index) in tabList" :key="index" class="tab-item"
                :class="cate_id == tab.cate_id ? 'active' : ''" @click="clickTab(tab.cate_id)">
                {{ tab.cate_name }}
              </div>
            </div>
            <div class="content">
              <div v-for="(article, index) in articleList" :key="index" class="card" style="cursor: pointer">
                <a :alt="article.title" :href="config.link_domain + '/notice/details?' + `id=${article.id}`
                  " target="_blank">

                  <div class="title">
                    <span class="left-text"> <img v-if="article.is_important == '2'" class="icon"
                        src="@/assets/images/totop.png" alt="">{{ article.title }}</span>
                    <span class="right-text">{{ article.create_time }}</span>
                  </div>
                  <div class="desc text-ellipsis">{{ article.desc }}</div>
                </a>
              </div>
              <!-- 分页 -->
              <el-pagination style="text-align: right; margin: 20px 0" small layout="prev, pager, next" :total="total"
                :pager-count="5" :current-page="page" :page-size="limit" @current-change="handleCurrentChange">
              </el-pagination>
            </div>
          </div>
          <div class="right-help">
            <div v-for="(list, index) in rightArticleList" :key="index" style="margin-bottom: 20px">
              <div class="right-sub-title">
                <span style="flex: 1">{{ list.cate_info.cate_name }}</span>
                <div class="more" @click="rightArticleMore(list.cate_info.cate_id)">
                  <span>更多</span>
                  <svg-icon style="font-size: 12px" icon-class="more_icon" />
                </div>
              </div>
              <div class="question-list">
                <ul>
                  <li class="text-ellipsis" style="cursor: pointer" v-for="(art, i) in list.article_list" :key="i">
                    <a :alt="art.title" :href="config.link_domain + '/notice/details?' + `id=${art.id}`
                      " target="_blank">{{ art.title }}</a>
                  </li>
                </ul>
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
import NavSearch from "../../components/NavSearch.vue";
import Api from "../../plugins/api";
import Seo from "~/components/Seo";
import config from "~/config";
import axios from "axios";

export default {
  name: "NoticePage",
  components: {
    NavSearch,
    Seo,
  },
  async asyncData({ query, params, route }) {
    const data = {};
    let url = config.baseUrl + Api.shopIndex;
    let url2 = config.baseUrl + Api.getArticleList;
    let url3 = config.baseUrl + Api.getOtherCateAriticleList;
    let url4 = config.baseUrl + Api.getRecommendSearchWordList;

    let res = await axios.get(config.baseUrl + Api.getArticleCateList, {
      params: {
        cate_id: query.cate_id,
      },
    });
    if (res.data.code === 0) {
      data.tabList = res.data.data.child;
      data.parentTabName = res.data.data.parent_cate_info.cate_name;
      if (data.tabList.length > 0) {
        data.cate_id = data.tabList[0].cate_id;
      }

      return axios
        .all([
          axios.get(url),
          axios.get(url2, {
            params: {
              cate_id: data.cate_id,
              page: 1,
              limit: 10,
            },
          }),
          axios.get(url3, {
            params: {
              cate_id: query.cate_id,
            },
          }),
          axios.get(url4),
        ])
        .then(
          axios.spread(function (res, res2, res3, res4) {
            return {
              config,
              productSortList: res.data.data.category_list,
              articleList: res2.data.data,
              total: res2.data.count,
              rightArticleList: res3.data.data,
              keywordArr: res4.data.data,
              ...data,
            };
          })
        );
    }
  },
  data() {
    return {
      page: 1,
      limit: 10,
      total: 0,
      cate_id: "",
      parentTabName: "",
      tabActiveIndex: '',
      tabList: [],
      articleList: [],
      rightArticleList: [],
      productSortList: [],
      config: {},
      keywordArr: [],
    };
  },
  mounted() {
    this.cate_id = this.$route.query.cate_id || '';
    this.clickTab(this.cate_id);
    // this.getArticleCateList(this.$route.query.cate_id)
    // this.getOtherCateAriticleList(this.$route.query.cate_id)
  },
  methods: {
    gotoHome() {
      this.$router.push("/");
    },
    clickTab(cate_id) {
      this.total = 0;
      this.page = 1;
      this.cate_id = cate_id;
      this.getArticleList();
    },
    handleCurrentChange(val) {
      this.page = val;
      console.log(this.page,'pagw');
      this.getArticleList();
    },
    rightArticleMore(id) {
      this.getArticleCateList(id);
      this.getOtherCateAriticleList(id);
      this.$router.push({ path: this.$route.path, query: { cate_id: id } });
    },
    // 获取分类列表
    getArticleCateList(pid) {
      this.$request
        .get(Api.getArticleCateList, { params: { pid } })
        .then((res) => {
          if (res.code === 0) {
            this.tabList = res.data.child;
            this.parentTabName = res.data.parent_cate_info.cate_name;
            if (this.tabList.length > 0) {
              this.cate_id = this.tabList[0].cate_id;
            }
            this.getArticleList();
          }
        });
    },
    // 获取其他分类列表
    getOtherCateAriticleList(pid) {
      this.$request
        .get(Api.getOtherCateAriticleList, { params: { cate_id: pid } })
        .then((res) => {
          if (res.code === 0) {
            this.rightArticleList = res.data;
          }
        });
    },
    getArticleList() {
      const data = {
        cate_id: this.cate_id,
        page: this.page,
        limit: this.limit,
      };
      this.$request.get(Api.getArticleList, { params: data }).then((res) => {
        if (res.code === 0) {
          this.total = res.count;
          this.articleList = res.data;
        }
      });
    },
    // 去查看详情
    gotoDetails(id) {
      const routeUrl = this.$router.resolve({
        path: "/notice/details",
        query: { id },
      });
      window.open(routeUrl.href, "_blank");
    },
  },
};
</script>
<style lang="less" scoped>


.main {
  background-color: #fff;
  box-shadow: 0px 8px 16px 0px rgba(23, 36, 63, 0.1) inset;
}

.notice-page {
  width: 1184px;
  margin: 0 auto;
  position: relative;
  padding-bottom: 120px;
}

.bottom-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  .left-list {
    width: 865px;

    .tabs {
      display: flex;
      align-items: center;
      height: 45px;
      border-bottom: 2px solid #efefef;

      .tab-title {
        font-size: 16px;
        font-family: Microsoft YaHei, Microsoft YaHei-Bold;
        font-weight: 700;
        text-align: left;
        color: #353535;
        padding: 0 20px 0 0;
      }

      .tab-item {
        font-size: 14px;
        font-family: Microsoft YaHei, Microsoft YaHei-Regular;
        font-weight: 400;
        text-align: left;
        color: #353535;
        padding: 0 20px;
        position: relative;
        cursor: pointer;

        &:hover {
          color: #2263e8;
        }

        &.active::after {
          content: "";
          display: block;
          position: absolute;
          border-bottom: 2px solid #2263e8;
          width: 100%;
          height: 0;
          left: 0;
          bottom: -15px;
        }
      }
    }

    .content {
      .card {
        padding: 15px 0;
        border-bottom: 2px solid #efefef;

        .title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 8px 0;

          .left-text {
            font-size: 16px;
            font-family: Microsoft YaHei, Microsoft YaHei-Bold;
            font-weight: 700;
            text-align: left;
            color: #353535;

            .icon {
              width: 36px;
              height: 20px;
              margin-right: 5px;
              vertical-align: middle;
              margin-top: -3px;
            }
          }

          .right-text {
            font-size: 14px;
            font-family: Microsoft YaHei, Microsoft YaHei-Regular;
            font-weight: 400;
            text-align: right;
            color: #959595;
          }
        }

        .desc {
          font-size: 14px;
          font-family: Microsoft YaHei, Microsoft YaHei-Regular;
          font-weight: 400;
          text-align: left;
          color: #656565;
        }
      }
    }
  }

  .right-help {
    width: 284px;
    // border: 1px solid #efefef;

    .right-sub-title {
      border: 1px solid #efefef;
      border-bottom: 2px solid #efefef;
      padding: 9px 8px;

      .more {
        font-size: 12px;
        font-family: Microsoft YaHei, Microsoft YaHei-Regular;
        font-weight: 400;
        text-align: center;
        color: #353535;
        // margin-left: 160px;
        cursor: pointer;
      }
    }

    .question-list {
      padding: 13px 12px 0;
      border: 1px solid #efefef;
      border-top: none;

      li {
        font-size: 14px;
        font-family: Microsoft YaHei, Microsoft YaHei-Regular;
        font-weight: 400;
        text-align: left;
        color: #353535;
        margin-bottom: 11px;
        cursor: pointer;
      }
    }
  }
}
</style>
