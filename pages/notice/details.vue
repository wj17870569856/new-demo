<template>
  <div class="wrap">
    <div class="content main">
      <div class="notice-page">
        <Breadcrumb :list="[
        {
          name: '文章详情',
        }
      ]" />

        <div class="bottom-wrapper">
          <div class="left-details">
            <div class="title">
              <div class="name">{{ article.title }}</div>
              <div class="time">{{ article.create_time }}</div>
            </div>
            <div class="content html-style ql-editor" v-html="article.content"></div>
          </div>
          <!-- <div class="right-help" v-if="rightArticleList.length">
            <div v-for="(list, index) in rightArticleList" :key="index" style="margin-bottom: 20px">
              <div class="right-sub-title">
                <span style="width: 215px">{{ list.cate_info.cate_name }}</span>
                <div class="more" @click="rightArticleMore(list.cate_info.cate_id)">
                  <span>更多</span>
                  <svg-icon style="font-size: 12px" icon-class="more_icon" />
                </div>
              </div>
              <div class="question-list">
                <ul>
                  <li
                    class="text-ellipsis"
                    v-for="(art, i) in list.article_list"
                    :key="i"
                    @click="gotoDetails(art.id)"
                  >{{ art.title }}</li>
                </ul>
              </div>
            </div>
          </div>-->

          <div class="file" v-if="article.file_url_url">
            <span>附件：</span>
            <a target="_blank" :href="article.file_url_url">点击查看</a>
          </div>
        </div>
      </div>
    </div>
    <client-only>
      <vue-editor v-show="false" v-model="empty"></vue-editor>
    </client-only>
  </div>
</template>
<script>
/* eslint-disable */
import axios from "axios";
import Api from "../../plugins/api";
import NavSearch from "../../components/NavSearch.vue";
import Seo from "~/components/Seo";
import config from "~/config";

export default {
  name: "NoticeDetails",
  layout:'index',
  components: {
    NavSearch,
    Seo,
  },
  asyncData({ query }) {
    const url = config.baseUrl + Api.getArticleDetail;
    let url2 = config.baseUrl + Api.shopIndex;
    let url3 = config.baseUrl + Api.getRecommendSearchWordList;

    return axios
      .all([
        axios.get(url, {
          params: {
            id: query.id,
          },
        }),
        axios.get(url2),
        axios.get(url3),
      ])
      .then(
        axios.spread(function (res, res2, res3) {
          return {
            config,
            productSortList: res2.data.data.category_list,
            article: res.data.data,
            keywordArr: res3.data.data,
          };
        })
      );
  },
  data() {
    return {
      id: "",
      article: {},
      tabActiveIndex: 0,
      empty: "",
      rightArticleList: [],
      productSortList: [],
      config: {},
      keywordArr: [],
    };
  },
  mounted() {
    this.id = this.$route.query.id;
    // this.getArticleDetail(this.id)
  },
  methods: {
    clickTab(i) {
      this.tabActiveIndex = i;
    },
    gotoPage(path) {
      this.$router.push(path);
    },
    rightArticleMore(id) {
      this.$router.push({ path: "/notice", query: { cate_id: id } });
    },
    // 获取其他分类列表
    getOtherCateAriticleList() {
      this.$request
        .get(Api.getOtherCateAriticleList, { params: { cate_id: 0 } })
        .then((res) => {
          if (res.code === 0) {
            this.rightArticleList = res.data;
          }
        });
    },
    gotoDetails(id) {
      this.getArticleDetail(id);
      this.$router.push({ path: "/notice/details", query: { id } });
    },
    getArticleDetail(id) {
      this.$request
        .get(Api.getArticleDetail, { params: { id } })
        .then((res) => {
          if (res.code === 0) {
            this.article = res.data;
            this.getOtherCateAriticleList(this.article.cate_id);
          }
        });
    },
  },
};
</script>
<style lang="less" scoped>
.wrap {
  margin-top: 80px;
}
.ql-editor {
  min-height: 550px;
}
.main {
  background-color: #fff;
}

.notice-page {
  min-height: 750px;
}
.file {
  font-size: 14px;
  a {
    color: #257FF8;
  }
}
.bottom-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
  box-sizing: border-box;
  .left-details {
    width: 100%;

    .title {
      border-bottom: 1px solid #efefef;

      .name {
        font-size: 24px;
        font-family: Microsoft YaHei, Microsoft YaHei-Bold;
        font-weight: 700;
        text-align: left;
        color: #353535;
        margin-bottom: 12px;
      }

      .time {
        font-size: 14px;
        font-family: Microsoft YaHei, Microsoft YaHei-Regular;
        font-weight: 400;
        text-align: left;
        color: #959595;
        margin-bottom: 19px;
      }
    }

    .content {
      padding: 20px 0;
    }
  }

  .right-help {
    width: 284px;
    // border: 1px solid #efefef;

    .right-sub-title {
      border: 1px solid #efefef;
      border-bottom: 2px solid #efefef;
      padding: 9px 8px;

      // border-bottom: none;
      .more {
        font-size: 12px;
        font-family: Microsoft YaHei, Microsoft YaHei-Regular;
        font-weight: 400;
        text-align: center;
        color: #353535;
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
