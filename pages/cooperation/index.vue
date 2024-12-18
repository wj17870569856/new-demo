<template>
  <div class="page">
    <div class="banner">
      <el-image
        fit="contain"
        style="width:100%"
        :src="require('../../assets/imgs/cooperation_banner.png')"
      ></el-image>
    </div>
    <div class="bottom">
      <div class="content">
        <div class="guide">
          <h3 class="title">指导单位</h3>
          <div class="swiper">
            <el-carousel height="290px" indicator-position="outside" arrow="never">
              <el-carousel-item>
                <div class="list">
                  <div class="item">
                    <el-image
                      :src="require('../../assets/imgs/partner23.png')"
                      style="width: 160px;height:160px"
                    ></el-image>
                    <div class="company_name">
                      <span>中国工程院</span>
                    </div>
                  </div>

                  <div class="item">
                    <el-image
                      :src="require('../../assets/imgs/partner24.png')"
                      style="width: 160px;height:160px"
                    ></el-image>

                    <div class="company_name">
                      <span>中国科学院</span>
                    </div>
                  </div>

                  <div class="item">
                    <el-image
                      :src="require('../../assets/imgs/partner25.png')"
                      style="width: 160px;height:160px"
                    ></el-image>
                    <div class="company_name">
                      <span>中国信通院</span>
                      <span>人工智能研究所</span>
                    </div>
                  </div>

                  <div class="item">
                    <el-image
                      :src="require('../../assets/imgs/partner26.png')"
                      style="width: 160px;height:160px"
                    ></el-image>
                    <div class="company_name">
                      <span>清华大学</span>
                      <span>人工智能研究所</span>
                    </div>
                  </div>

                  <div class="item">
                    <el-image
                      :src="require('../../assets/imgs/partner27.png')"
                      style="width: 160px;height:160px"
                    ></el-image>
                    <div class="company_name">
                      <span>西安电子科技大学</span>
                      <span>广州研究院</span>
                    </div>
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
          </div>
        </div>

        <div class="map">
          <img usemap="#map" src="../../assets/imgs/cooperation_map.png" alt />
          <!-- <map id="map" name="map">
            <area
              shape="rect"
              coords="0, 173, 270, 240"
              href="/company?id=29161"
              alt="南康区数据要素服务工作站"
            />
            <area
              shape="rect"
              coords="889, 153, 1159, 221"
              href="/company?id=29159"
              alt="会昌县数据要素服务工作站"
            />
            <area
              shape="rect"
              coords="832, 481, 1101, 552"
              href="/company?id=29160"
              alt="瑞金市数据要素服务工作站"
            />
          </map> -->
        </div>

        <div class="cooperation">
          <h3 class="title">生态伙伴</h3>
          <div class="table">
            <div class="bar">
              <!-- <div
                class="item"
                @click="tabActive = 0"
                :class="tabActive == '0'?'active':''"
              >{{ tabActive == '0'?'':'指导单位' }}</div> -->
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
                        :src="require('../../assets/imgs/partner19.png')"
                        style="width: 120px;height:120px"
                      ></el-image>
                      <div class="company_name">
                        <span>中国工程院</span>
                      </div>
                    </div>

                    <div class="item">
                      <el-image
                        :src="require('../../assets/imgs/partner20.png')"
                        style="width: 120px;height:120px"
                      ></el-image>

                      <div class="company_name">
                        <span>中国科学院</span>
                      </div>
                    </div>

                    <div class="item">
                      <el-image
                        :src="require('../../assets/imgs/partner21.png')"
                        style="width: 120px;height:120px"
                      ></el-image>
                      <div class="company_name">
                        <span>中国信通院</span>
                        <span>人工智能研究所</span>
                      </div>
                    </div>

                    <div class="item">
                      <el-image
                        :src="require('../../assets/imgs/partner22.png')"
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
                        :src="require('../../assets/imgs/partner1.png')"
                        style="width: 120px;height:120px"
                      ></el-image>
                      <div class="company_name">
                        <span>深圳数据交易所</span>
                      </div>
                    </div>

                    <div class="item">
                      <el-image
                        :src="require('../../assets/imgs/partner2.png')"
                        style="width: 120px;height:120px"
                      ></el-image>

                      <div class="company_name">
                        <span>贵阳大数据交易所</span>
                      </div>
                    </div>

                    <div class="item">
                      <el-image
                        :src="require('../../assets/imgs/partner3.png')"
                        style="width: 120px;height:120px"
                      ></el-image>
                      <div class="company_name">
                        <span>北京数据交易所</span>
                      </div>
                    </div>

                    <div class="item">
                      <el-image
                        :src="require('../../assets/imgs/partner4.png')"
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
                        :src="require('../../assets/imgs/partner5.png')"
                        style="width: 120px;height:120px"
                      ></el-image>
                      <div class="company_name">
                        <span>中国信通院</span>
                        <span>人工智能研究所</span>
                      </div>
                    </div>

                    <div class="item">
                      <el-image
                        :src="require('../../assets/imgs/partner6.png')"
                        style="width: 120px;height:120px"
                      ></el-image>
                      <div class="company_name">
                        <span>百度智能云</span>
                      </div>
                    </div>

                    <div class="item">
                      <el-image
                        :src="require('../../assets/imgs/partner7.png')"
                        style="width: 120px;height:120px"
                      ></el-image>
                      <div class="company_name">
                        <span>九鑫智能</span>
                      </div>
                    </div>

                    <div class="item">
                      <el-image
                        :src="require('../../assets/imgs/partner8.png')"
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
                        :src="require('../../assets/imgs/partner9.png')"
                        style="width: 120px;height:120px"
                      ></el-image>
                      <div class="company_name">
                        <span>生数科技</span>
                      </div>
                    </div>

                    <div class="item">
                      <el-image
                        :src="require('../../assets/imgs/partner10.png')"
                        style="width: 120px;height:120px"
                      ></el-image>
                      <div class="company_name">
                        <span>中荣国投</span>
                      </div>
                    </div>

                    <div class="item">
                      <el-image
                        :src="require('../../assets/imgs/partner11.png')"
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
                        :src="require('../../assets/imgs/partner12.png')"
                        style="width: 120px;height:120px"
                      ></el-image>
                      <div class="company_name">
                        <span>平安集团</span>
                      </div>
                    </div>

                    <div class="item">
                      <el-image
                        :src="require('../../assets/imgs/partner13.png')"
                        style="width: 120px;height:120px"
                      ></el-image>
                      <div class="company_name">
                        <span>中国光大银行</span>
                      </div>
                    </div>

                    <div class="item">
                      <el-image
                        :src="require('../../assets/imgs/partner14.png')"
                        style="width: 120px;height:120px"
                      ></el-image>
                      <div class="company_name">
                        <span>微众银行</span>
                      </div>
                    </div>
                    <div class="item">
                      <el-image
                        :src="require('../../assets/imgs/partner15.png')"
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
                        :src="require('../../assets/imgs/partner16.png')"
                        style="width: 120px;height:120px"
                      ></el-image>
                      <div class="company_name">
                        <span>广东华商(赣州)</span>
                        <span>律师事务所</span>
                      </div>
                    </div>

                    <div class="item">
                      <el-image
                        :src="require('../../assets/imgs/partner17.png')"
                        style="width: 120px;height:120px"
                      ></el-image>
                      <div class="company_name">
                        <span>万商天勤律师事务所</span>
                      </div>
                    </div>

                    <div class="item">
                      <el-image
                        :src="require('../../assets/imgs/partner18.png')"
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
    </div>
  </div>
</template>

<script>
export default {
  layout: "index",
  data() {
    return {
      tabActive: 1,
    };
  },
};
</script>

<style scoped lang="less">
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
.content{background-color: #fff;border-radius: 10px 10px 0px 0px;}
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
.cooperation {
  // float: left;
  width: 100%;
  background-color: #F8F9FA;
  padding-top: 20px;
  padding-bottom: 126px; 
  border-radius: 10px;
  .table {
    height: 290px;
    display: flex;
    // margin-top: 22px;
    .bar {
      width: 224px;
      margin-top: 40px;
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
            background-image: url(../../assets/imgs/cooperation_tab5.png);
        }
        &.active:nth-of-type(2) {
          background-image: url(../../assets/imgs/cooperation_tab1.png);
        }
        &.active:nth-of-type(3) {
          background-image: url(../../assets/imgs/cooperation_tab2.png);
        }
        &.active:nth-of-type(4) {
          background-image: url(../../assets/imgs/cooperation_tab3.png);
        }
        &.active:nth-of-type(5) {
          background-image: url(../../assets/imgs/cooperation_tab4.png);
        }
      }
    }
  }
}
.swiper {
  width: 100%;
  margin-top: 40px;
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
    margin-right: 15px;
    width: 258px;
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
  .item:nth-child(1){margin-left: 15px;}
}
.guide {
  background-color: #F8F9FA;
  border-radius: 10px 10px 0 0;
  overflow: hidden;
  h3 {
    margin-top: 40px;
  }
  .list {
    flex-wrap: nowrap;
    .item {
      background-color: #F8F9FA;
      .company_name {
        padding: 0;
        margin-top: 20px;
      }
    }
  }
  ::v-deep .el-carousel__button {
    display: none;
  }
}
.bottom {
  background-image: url(../../assets//imgs/cooperation_content_bg.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;

  .content {
    width: 1300px;
    // height: 1203px;
    margin: 0 auto;
    position: relative;
    top: -43px;
    z-index: 99;
    .map {
      padding: 0 50px 0 90px;
      img {
        width: 100%;
      }
      /*background-color: #fff;
      border-radius: 10px 10px 0px 0px;*/
    }
  }
}

.banner {
  width: 100%;
  // height: 299px;
  font-size: 0;
}
</style>