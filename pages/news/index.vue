<template>
  <div class="news-page">
    <div class="content">
      <div class="banner">
        <el-image style="width:100%" :src="require('../../assets/imgs/banner_news.png')"></el-image>
      </div>
      <div class="wrap activity">
        <div class="news_content">
          <div class="tabs flex">
            <div
              class="tab row-center col-center flex1"
              :class="newsActive == item.cate_id?'active':''"
              v-for="(item, index) in category_list"
              :key="item.cate_id"
              @click="setNewsActive(item.cate_id, index)"
            >
              <img :src="item.icon" />
              <p>{{ item.cate_name }}</p>
            </div>
          </div>
          <div class="list">
            <div class="none" v-if="topNewsList.length == 0">
              <img :src="require('../../assets/imgs/none.png')" />
              <p>暂无置顶信息</p>
            </div>
            <div class="item row-sw" v-else>
              <div class="left">
                <el-carousel
                  ref="carousel"
                  height="540px"
                  arrow="never"
                  :autoplay="false"
                  indicator-position="none"
                  @change="changeCarousel"
                >
                  <el-carousel-item v-for="item in topNewsList" :key="item.id">
                    <el-image
                      @click="navDetail(item)"
                      fit="cover "
                      :src="showImg(item)"
                      style="width: 100%;height:100%"
                    ></el-image>
                    <div v-if="Number(newsActive) !== 20 || (curIndex && curIndex !== 3)" class="text text-ellipsis">{{item.title}}</div>
                  </el-carousel-item>
                </el-carousel>
              </div>
              <div class="right">
                <div
                  @click="setNewTopActive(index)"
                  :class="carouselIndex == index?'active':''"
                  class="column"
                  v-for="(item,index) in topNewsList"
                  :key="item.id"
                >
                  <h4 class="title text-ellipsis-2">{{ item.title }}</h4>
                  <p class="create_time">{{ item.create_time }}</p>
                  <span class="nav" @click="navDetail(item)">点击进入</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="search_bar">
        <el-input placeholder="请输入关键字" v-model="keyword"></el-input>
        <div class="icon" @click="search">
          <el-image
            :src="require('../../assets/imgs/search_icon.png')"
            style="width:100%;height:100%"
          ></el-image>
        </div>
      </div>
      <div class="news_list">
        <div class="list-item flex" v-for="item in newsList" :key="item.id">
          <div class="left">
            <el-image style="width:100%;height:100%" :src="item.cover_pic_url"></el-image>
          </div>
          <div class="right">
            <h4 class="title text-ellipsis-2">{{ item.title }}</h4>
            <p class="create_time">{{ item.create_time }}</p>
            <span class="nav" @click="navDetail(item)">点击进入</span>
          </div>
        </div>

        <div class="none" v-if="newsList.length == 0">
          <img :src="require('../../assets/imgs/none.png')" />
          <p>暂无置顶信息</p>
        </div>

        <!-- <el-empty description="暂无数据" v-if="newsList.length == '0'"></el-empty> -->
        <!-- 分页 -->
        <el-pagination
          style="position: absolute;bottom:20px;right:20px"
          small
          layout="prev, pager, next, jumper"
          :page-size="8"
          :total="total"
          :pager-count="5"
          :current-page="page"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Api from "@/plugins/api";
import { mapState } from "vuex";
const red_url = 'http://www.buwangchuxin.com/';
export default {
  layout: "index",
  data() {
    return {
      page: 1,
      total: 0,
      keyword: "",
      topNewsList: [],
      carouselIndex: 0,
      newsList: [],
      newsActive: null,
      curIndex: null // 党的建设需特殊处理，因数据不会变，所以前端写死
    };
  },
  mounted() {
    this.newsActive = this.$route.query.cate_id;
    this.getNews();
    this.getTopNews();
  },
  watch: {
    "$route.query.cate_id": {
      handler(val) {
        this.newsActive = val;
        this.page = 1;
        this.getNews();
        this.getTopNews();
      },
    },
    category_list: {
      handler() {
        if (this.category_list && this.category_list.length) {
          this.newsActive = this.category_list[0].cate_id;
        }
      },
      immediate: true,
    },
  },
  computed: {
    ...mapState(["category_list"]),
    activeNews() {
      return this.newsList.find((item) => item.cate_id == this.newsActive);
    },
  },
  methods: {
    showImg(item) {
      return (Number(this.newsActive) === 20 || this.curIndex === 3) ? require('../../assets/imgs/red.png') : item.cover_pic_url
    },
    setNewTopActive(index) {
      this.carouselIndex = index;
      if (Number(this.newsActive) === this.category_list[this.category_list.length - 1].cate_id) return;
      this.$refs["carousel"].setActiveItem(index);
    },
    getTopNews() {
      this.$request
        .get(Api.getArticleList, {
          params: {
            cate_id: this.newsActive,
            page: 1,
            limit: 4,
            is_important: 2,
          },
        })
        .then((res) => {
          if (res.code === 0) {
            this.topNewsList = res.data;
            this.carouselIndex = 0;
          }
        });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getNews();
    },
    changeCarousel(index) {
      this.carouselIndex = index;
    },
    navDetail(item) {
      if (this.curIndex === 3) {
        window.open(red_url);
        return;
      }
      if (item && item.jump_url) {
        window.open(item.jump_url);
      } else {
        this.$router.push("/notice/details?id=" + item.id);
      }
    },
    search() {
      this.page = 1;
      this.getNews();
    },
    getNews() {
      this.$request
        .get(Api.getArticleList, {
          params: {
            cate_id: this.newsActive,
            page: this.page,
            limit: 8,
            search_word: this.keyword,
            is_important: 1,
          },
        })
        .then((res) => {
          if (res.code === 0) {
            this.newsList = res.data;
            this.total = res.count;
          }
        });
    },
    setNewsActive(cate_id, index) {
      this.newsActive = cate_id;
      this.curIndex = index;
      this.getNews();
      this.getTopNews();
    },
  },
};
</script>

<style scoped lang="less">
.news-page {
  .none {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    img {
      width: 318px;
      height: 318px;
      margin-top: -59px;
    }
    p {
      font-family: Source Han Sans CN, Source Han Sans CN;
      font-weight: 500;
      font-size: 26px;
      color: #0a1833;
      line-height: 30px;
      margin-top: -29px;
    }
  }
  .news_list {
    .list-item {
      height: 130px;
      margin-bottom: 15px;
      border-bottom: 1px solid rgba(195, 211, 226, 0.3);
      display: flex;
      position: relative;
      cursor: pointer;
      .left {
        width: 200px;
        padding-bottom: 14px;
        margin-right: 20px;
      }
      .right {
        flex: 1;
        .title {
          font-weight: 500;
          font-size: 20px;
          color: #0a1833;
          margin-bottom: 42px;
        }
        .create_time {
          font-size: 16px;
          color: #8993a5;
        }
        .nav {
          position: absolute;
          bottom: 21px;
          right: 20px;

          font-size: 18px;
          color: #257ff8;
          line-height: 21px;
        }
      }
    }
  }
  min-width: 1300px;
  background-image: url(../../assets/imgs/news_bg.png);
  .search_bar {
    width: 1000px;
    height: 70px;
    position: relative;
    background: #ffffff;
    border-radius: 10px 10px 10px 10px;
    font-size: 18px;
    overflow: hidden;
    margin: 50px auto;
    border: 1px solid #257ff8;
    padding-right: 120px;
    .icon {
      position: absolute;
      right: 20px;
      width: 50px;
      height: 50px;
      cursor: pointer;
      top: 50%;
      transform: translateY(-50%);
    }
    :deep(.el-input__inner) {
      height: 70px;
      outline: none;
      border: none;
      line-height: 70px;
      box-sizing: border-box;
      font-size: 18px;
    }
  }
  .news_list {
    padding: 20px;
    margin: 50px auto 0;
    width: 1300px;
    min-height: 1264px;
    background: #ffffff;
    border-radius: 6px 6px 0px 0px;
    position: relative;
  }
  .activity {
    .list {
      width: 100%;
      margin-top: 30px;
      overflow: hidden;
      .none {
        width: 1300px;
        height: 320px;
        background: #ffffff;
        border-radius: 10px 10px 10px 10px;
      }
      .left {
        width: 640px;
        height: 540px;
        background: #c8e7f5;
        border-radius: 10px 0px 0px 10px;
        position: relative;
        .text {
          position: absolute;
          height: 90px;
          padding: 15px 22px;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(10, 24, 51, 0.5);
          font-weight: 500;
          font-size: 24px;
          color: #ffffff;
          line-height: 30px;
          box-sizing: border-box;
        }
      }
      .right {
        padding: 30px 20px;
        box-sizing: border-box;
        width: 660px;
        height: 540px;
        background: linear-gradient(180deg, #ffffff 0%, #eaf3fe 100%);
        border-radius: 0px 10px 10px 0px;
        .column {
          cursor: pointer;
          margin-bottom: 20px;
          padding: 8px 10px;
          position: relative;
          box-sizing: border-box;
          width: 600px;

          border-radius: 10px 10px 10px 10px;

          &.active {
            background: linear-gradient(90deg, #257ff8 0%, #0361e9 100%);

            .title,
            .create_time,
            .nav {
              color: #fff;
            }
          }
          .title {
            font-size: 20px;
            color: #0a1833;
            line-height: 30px;
            margin-bottom: 10px;
            font-weight: 600;
          }
          .create_time {
            font-size: 16px;
            color: #8993a5;
          }
          .nav {
            color: #257ff8;
            position: absolute;
            right: 20px;
            bottom: 10px;
            line-height: 21px;
            font-size: 18px;
          }
        }
      }
    }
    .news_content {
      width: 1300px;
      margin: 0 auto;
    }
    .tabs {
      margin-top: 31px;

      .tab {
        height: 90px;
        flex-direction: column;
        cursor: pointer;
        box-shadow: inset 0px -4px 0px 0px rgba(33, 114, 223, 0.2);
        img {
          width: 37px;
          height: 37px;
          margin-bottom: 10px;
        }

        p {
          font-size: 18px;
          color: #43546f;
          line-height: 21px;
        }
        &:hover {
          p {
            color: #257ff8;
          }
        }
        &.active {
          box-shadow: inset 0px -4px 0px 0px #257ff8;

          p {
            color: #257ff8;
          }
        }
      }
    }
  }

  .banner {
    width: 100%;
  }
}
</style>