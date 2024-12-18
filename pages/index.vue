<template>
  <div class="page screen pointer">
    <div class="content-top">
      <div class="content">
        <h1 class="title">赣州市产业数据要素共享服务中心</h1>
        <h2 class="tips">赣州市产业大脑</h2>
        <div class="keyword">立足赣州 服务江西 融入湾区</div>
      </div>
      <video autoplay loop muted playsinline class="fullscreen-background-video">
        <source src="https://img.de.guanyingis.com/video/home.mp4" type="video/mp4" />
      </video>
    </div>
    
    <div class="indexMain">
      <!--新闻资讯-->
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
                <img :src="require('../assets/imgs/none.png')" />
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
          <div class="more" @click="newsMore">查看更多>></div>
        </div>
        <!--平台优势-->
        <div class="advantages">
          <h3 class="title">平台优势</h3>
          <ul class="advantagesList">
            <li>
              <div class="ad_tb">便捷使用专业服务工具</div>
              <div class="con">平台为用户提供自动化专业服务工具，有效降低用户决策成本与履约成本，促进供需匹配效能。</div>
            </li>
            <li>
              <div class="ad_tb">一站抵达目标业务系统</div>
              <div class="con">平台集成上数所数据产品交易全流程业务系统，实现一站式全流程服务，有效降低用户时间成本。</div>
            </li>
            <li>
              <div class="ad_tb">精准获取市场资源信息</div>
              <div class="con">用户在平台可以实现数据产品、数商服务、数据工具等市场资源信息精准查找，大幅降低用户搜寻成本。</div>
            </li>
            <li>
              <div class="ad_tb">深度体验交易撮合服务</div>
              <div class="con">平台基于需求大厅、数据地图、智能匹配等多种模式，为入场用户提供撮合服务，降低用户搜寻与决策成本</div>
            </li>
          </ul>
        </div>
        <!--生态伙伴-->
        <div class="cooperation">
          <h3 class="title">生态伙伴</h3>
          <div class="table">
            <div class="bar">
              <div
                class="item"
                @click="tabActive = 0"
                :class="tabActive == '0'?'active':''"
              >{{ tabActive == '0'?'':'指导单位' }}</div>
              <div
                class="item"
                @click="tabActive = 1"
                :class="tabActive == '1'?'active':''"
              >{{ tabActive == '1'?'':'数据交易所' }}</div>
              <div
                class="item"
                @click="tabActive = 2"
                :class="tabActive == '2'?'active':''"
              >{{ tabActive == '2'?'':'数据商' }}</div>
              <div
                class="item"
                @click="tabActive = 3"
                :class="tabActive == '3'?'active':''"
              >{{ tabActive == '3'?'':'金融服务机构' }}</div>
              <div
                class="item"
                @click="tabActive = 4"
                :class="tabActive == '4'?'active':''"
              >{{ tabActive == '4'?'':'律师事务所' }}</div>
            </div>

            <div class="swiper" v-if="tabActive == '0'">
              <el-carousel height="290px" indicator-position="outside" arrow="never">
                <el-carousel-item>
                  <div class="list">
                    <div class="item">
                      <el-image
                        :src="require('../assets/imgs/partner19.png')"
                        style="width: 120px;height:120px"
                      ></el-image>
                      <div class="company_name">
                        <span>中国工程院</span>
                      </div>
                    </div>

                    <div class="item">
                      <el-image
                        :src="require('../assets/imgs/partner20.png')"
                        style="width: 120px;height:120px"
                      ></el-image>

                      <div class="company_name">
                        <span>中国科学院</span>
                      </div>
                    </div>

                    <div class="item">
                      <el-image
                        :src="require('../assets/imgs/partner21.png')"
                        style="width: 120px;height:120px"
                      ></el-image>
                      <div class="company_name">
                        <span>中国信通院</span>
                        <span>人工智能研究所</span>
                      </div>
                    </div>

                    <div class="item">
                      <el-image
                        :src="require('../assets/imgs/partner22.png')"
                        style="width: 120px;height:120px"
                      ></el-image>
                      <div class="company_name">
                        <span>清华大学</span>
                        <span>人工智能研究所</span>
                      </div>
                    </div>
                  </div>
                </el-carousel-item>
              </el-carousel>
            </div>

            <div class="swiper" v-if="tabActive == '1'">
              <el-carousel height="290px" indicator-position="outside" arrow="never">
                <el-carousel-item>
                  <div class="list">
                    <div class="item">
                      <el-image
                        :src="require('../assets/imgs/partner1.png')"
                        style="width: 120px;height:120px"
                      ></el-image>
                      <div class="company_name">
                        <span>深圳数据交易所</span>
                      </div>
                    </div>

                    <div class="item">
                      <el-image
                        :src="require('../assets/imgs/partner2.png')"
                        style="width: 120px;height:120px"
                      ></el-image>

                      <div class="company_name">
                        <span>贵阳大数据交易所</span>
                      </div>
                    </div>

                    <div class="item">
                      <el-image
                        :src="require('../assets/imgs/partner3.png')"
                        style="width: 120px;height:120px"
                      ></el-image>
                      <div class="company_name">
                        <span>北京数据交易所</span>
                      </div>
                    </div>

                    <div class="item">
                      <el-image
                        :src="require('../assets/imgs/partner4.png')"
                        style="width: 120px;height:120px"
                      ></el-image>
                      <div class="company_name">
                        <span>上海数据交易所</span>
                      </div>
                    </div>
                  </div>
                </el-carousel-item>
              </el-carousel>
            </div>

            <div class="swiper" v-if="tabActive == '2'">
              <el-carousel height="290px" indicator-position="outside" arrow="never">
                <el-carousel-item>
                  <div class="list">
                    <div class="item">
                      <el-image
                        :src="require('../assets/imgs/partner5.png')"
                        style="width: 120px;height:120px"
                      ></el-image>
                      <div class="company_name">
                        <span>中国信通院</span>
                        <span>人工智能研究所</span>
                      </div>
                    </div>

                    <div class="item">
                      <el-image
                        :src="require('../assets/imgs/partner6.png')"
                        style="width: 120px;height:120px"
                      ></el-image>
                      <div class="company_name">
                        <span>百度智能云</span>
                      </div>
                    </div>

                    <div class="item">
                      <el-image
                        :src="require('../assets/imgs/partner7.png')"
                        style="width: 120px;height:120px"
                      ></el-image>
                      <div class="company_name">
                        <span>九鑫智能</span>
                      </div>
                    </div>

                    <div class="item">
                      <el-image
                        :src="require('../assets/imgs/partner8.png')"
                        style="width: 120px;height:120px"
                      ></el-image>
                      <div class="company_name">
                        <span>瑞莱智慧</span>
                      </div>
                    </div>
                  </div>
                </el-carousel-item>
                <el-carousel-item>
                  <div class="list">
                    <div class="item">
                      <el-image
                        :src="require('../assets/imgs/partner9.png')"
                        style="width: 120px;height:120px"
                      ></el-image>
                      <div class="company_name">
                        <span>生数科技</span>
                      </div>
                    </div>

                    <div class="item">
                      <el-image
                        :src="require('../assets/imgs/partner10.png')"
                        style="width: 120px;height:120px"
                      ></el-image>
                      <div class="company_name">
                        <span>中荣国投</span>
                      </div>
                    </div>

                    <div class="item">
                      <el-image
                        :src="require('../assets/imgs/partner11.png')"
                        style="width: 120px;height:120px"
                      ></el-image>
                      <div class="company_name">
                        <span>冠英科技集团</span>
                      </div>
                    </div>

                    <div style="width: 250px;"></div>
                  </div>
                </el-carousel-item>
              </el-carousel>
            </div>

            <div class="swiper" v-if="tabActive == '3'">
              <el-carousel height="290px" indicator-position="outside" arrow="never">
                <el-carousel-item>
                  <div class="list">
                    <div class="item">
                      <el-image
                        :src="require('../assets/imgs/partner12.png')"
                        style="width: 120px;height:120px"
                      ></el-image>
                      <div class="company_name">
                        <span>平安集团</span>
                      </div>
                    </div>

                    <div class="item">
                      <el-image
                        :src="require('../assets/imgs/partner13.png')"
                        style="width: 120px;height:120px"
                      ></el-image>
                      <div class="company_name">
                        <span>中国光大银行</span>
                      </div>
                    </div>

                    <div class="item">
                      <el-image
                        :src="require('../assets/imgs/partner14.png')"
                        style="width: 120px;height:120px"
                      ></el-image>
                      <div class="company_name">
                        <span>微众银行</span>
                      </div>
                    </div>
                    <div class="item">
                      <el-image
                        :src="require('../assets/imgs/partner15.png')"
                        style="width: 120px;height:120px"
                      ></el-image>
                      <div class="company_name">
                        <span>赣州银行</span>
                      </div>
                    </div>
                  </div>
                </el-carousel-item>
              </el-carousel>
            </div>

            <div class="swiper" v-if="tabActive == '4'">
              <el-carousel height="290px" indicator-position="outside" arrow="never">
                <el-carousel-item>
                  <div class="list">
                    <div class="item">
                      <el-image
                        :src="require('../assets/imgs/partner16.png')"
                        style="width: 120px;height:120px"
                      ></el-image>
                      <div class="company_name">
                        <span>广东华商(赣州)</span>
                        <span>律师事务所</span>
                      </div>
                    </div>

                    <div class="item">
                      <el-image
                        :src="require('../assets/imgs/partner17.png')"
                        style="width: 120px;height:120px"
                      ></el-image>
                      <div class="company_name">
                        <span>万商天勤律师事务所</span>
                      </div>
                    </div>

                    <div class="item">
                      <el-image
                        :src="require('../assets/imgs/partner18.png')"
                        style="width: 120px;height:120px"
                      ></el-image>
                      <div class="company_name">
                        <span>北京中闻(上海)</span>
                        <span>律师事务所</span>
                      </div>
                    </div>
                    <div style="width: 250px;"></div>
                  </div>
                </el-carousel-item>
              </el-carousel>
            </div>
          </div>
        </div>
    </div>
  <div class="clearfix"></div>
  </div>
</template>

<script>
import Api from "@/plugins/api";
import { mapState } from "vuex";
const red_url = 'http://www.buwangchuxin.com/';

export default {
  name: "IndexPage",
  layout: "index",
  data(){
    return {
      newsActive: null,
      topNewsList: [],
      carouselIndex: 0,
      tabActive: 0,
      curIndex: null // 党的建设需特殊处理，因数据不会变，所以前端写死
    }
  },
  mounted() {
    this.newsActive = this.category_list[0].cate_id;
    this.getNews();
    this.getTopNews();
  },
  watch:{
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
  methods:{
    showImg(item) {
      return (Number(this.newsActive) === 20 || this.curIndex === 3) ? require('../assets/imgs/red.png') : item.cover_pic_url
    },
     /*新闻资讯*/
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
    navDetail(item) {
      if (Number(this.newsActive) === this.category_list[this.category_list.length - 1].cate_id) {
        window.open(red_url);
        return;
      }
      if (item.jump_url) {
        window.open(item.jump_url);
      } else {
        this.$router.push("/notice/details?id=" + item.id);
      }
    },
    setNewTopActive(index) {
      this.carouselIndex = index;
      if (Number(this.newsActive) === this.category_list[this.category_list.length - 1].cate_id) return;
      this.$refs["carousel"].setActiveItem(index);
    },
    changeCarousel(index) {
      this.carouselIndex = index;
    },
    setNewsActive(cate_id, index) {
      this.newsActive = cate_id;
      this.curIndex = index;
      this.getNews();
      this.getTopNews();
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
    newsMore(){
      this.$router.push(`/news?cate_id=${this.category_list[0].cate_id}`);
    }
  }
};
</script>

<style lang="less" scoped>
.content-top{position: relative;}
.content {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    transform: translate(-50%, -50%);
    font-family: Source Han Sans CN, Source Han Sans CN;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .title {
      font-weight: bold;
      font-size: 64px;
      width: 100%;
      text-align: center;
      line-height: 50px;
      letter-spacing: 3px;
      text-shadow: 0px 4px 4px #00458B;
    }
    .keyword {
      width: 912px;
      height: 86px;
      border-radius: 0px 0px 0px 0px;
      background-image: url(../assets/imgs/index_text_bg.png);
      background-size: 100% 100%;
      background-repeat: no-repeat;
      font-family: Alimama ShuHeiTi, Alimama ShuHeiTi;
      font-weight: bold;
      font-size: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      line-height: 70px;
      letter-spacing: 3px;
    }
    .tips {
      font-weight: bold;
      font-size: 30px;
      margin: 30px 0 40px;
    }
  }
  .page {
    min-width: 1300px;
    font-size: 0;
    position: relative;
  }
  .fullscreen-background-video {
    width: 100%;
  }
  /*新闻资讯*/
  .indexMain{
    float: left;
    width: 100%;
    background-image: url(../assets/imgs/news_bg.png);
    .activity {
      .news_content{
          width: 1300px;
          margin: 0 auto;
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
    .more{
      text-align: center;
      height: 50px;
      line-height: 50px;
      color: #257FF8;
      font-size: 24px;
    }
  }
  /*生态伙伴*/
  .cooperation {
    margin-top: 20px;
    width: 1300px;
    margin: 40px auto;
    padding-bottom: 30px;
    .title {
      font-family: Source Han Sans CN, Source Han Sans CN;
      font-weight: bold;
      font-size: 34px;
      color: #0a1833;
      line-height: 46px;
      text-align: center;
      position: relative;
      &::after {
        content: "";
        width: 50px;
        height: 6px;
        position: absolute;
        background: #257ff8;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
      }
    }
    .table {
      height: 290px;
      display: flex;
      margin-top: 22px;
      .bar {
        width: 224px;
        margin-top: 20px;
        .item {
          height: 58px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-size: 100% 100%;
          background-repeat: no-repeat;
          cursor: pointer;
          font-weight: 400;
          font-size: 20px;
          color: #43546f;

          &.active:nth-of-type(1) {
            background-image: url(../assets/imgs/cooperation_tab5.png);
          }
          &.active:nth-of-type(2) {
            background-image: url(../assets/imgs/cooperation_tab1.png);
          }
          &.active:nth-of-type(3) {
            background-image: url(../assets/imgs/cooperation_tab2.png);
          }
          &.active:nth-of-type(4) {
            background-image: url(../assets/imgs/cooperation_tab3.png);
          }
          &.active:nth-of-type(5) {
            background-image: url(../assets/imgs/cooperation_tab4.png);
          }
        }
      }
      .swiper {
        width: 100%;
        margin-top:20px;  
      }
      .list {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: #fff;
          margin-left: 15px;

          width: 250px;
          height: 290px;
          background: #ffffff;
          border-radius: 10px 10px 10px 10px;
          .company_name {
            margin-top: 32px;
            height: 60px;
            display: block;
            padding: 0 10px;
            justify-content: center;
            display: flex;
            flex-direction: column;
            span {
              font-family: Source Han Sans CN, Source Han Sans CN;
              font-weight: 500;
              font-size: 24px;
              text-align: center;
              color: #0a1833;
              line-height: 36px;
            }
          }
        }
      }
    }
    ::v-deep .el-carousel__indicator.is-active button {
      width: 30px;
      height: 4px;
      background: #257ff8;
      border-radius: 0px 0px 0px 0px;
    }
    ::v-deep .el-carousel__button {
      width: 30px;
      height: 4px;
      background: #c3d3e2;
      border-radius: 0px 0px 0px 0px;
      opacity: 0.5;
    }
    ::v-deep .el-carousel__indicators--outside {
      margin-top: 24px;
    }
  }
  /*平台优势*/
  .advantages{
    width: 1300px;
    margin: 40px auto;
    .title {
      font-family: Source Han Sans CN, Source Han Sans CN;
      font-weight: bold;
      font-size: 34px;
      color: #0a1833;
      line-height: 46px;
      text-align: center;
      position: relative;
      &::after {
        content: "";
        width: 50px;
        height: 6px;
        position: absolute;
        background: #257ff8;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
      }
    }
    .advantagesList{
      display: flex;
      justify-content: center;
      // align-items: center;
      li{
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        padding: 130px 15px 63px 15px;
        margin: 36px 10px 10px 10px;
        background: no-repeat center top/100%;
        background-size: 309px 380px;
        .ad_tb{
          font-size: 26px;
          font-weight: bold;
          color: #257FF8;
          line-height: 30px;
          margin-bottom: 20px;
        }
        .con{
          line-height: 28px;
          color: #43546F;
          font-size: 20px;
        }
      }
      li:nth-of-type(1){
        background-image:url('./assets/imgs/bg1.png');
      }
      li:nth-of-type(2){
        background-image:url('./assets/imgs/bg2.png');
      }
      li:nth-of-type(3){
        background-image:url('./assets/imgs/bg3.png');
      }
      li:nth-of-type(4){
        background-image:url('./assets/imgs/bg4.png');
      }
    } 
  }
  .clearfix::after {
    content: "";
    display: table;
    clear: both;
  }
</style>
