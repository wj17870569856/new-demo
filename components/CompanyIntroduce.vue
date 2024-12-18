<template>
  <div class="company-CompanyInfo">
    <h2>{{ CompanyInfo.company_name }}</h2>
    <div class="photo">
      <div v-show="showRealImg" class="img-wrapper">
        <div class="big-img">
          <el-image :src="CompanyInfo.comBigImgUrl" style="width: 100%; height: 100%"></el-image>
        </div>
        <div class="small-img">
          <lcgt-swiper class="swiper" :options="swiperOption2" style="width: 100%">
            <lcgt-swiper-slide v-for="(pd, i) in CompanyInfo.company_pic" :key="i">
              <img
                style="width: 206px; height: 116px"
                :src="pd.url_domain"
                @click="handleClickComImage(pd.url_domain)"
              />
            </lcgt-swiper-slide>
            <div slot="button-prev" class="swiper-button-prev"></div>
            <div slot="button-next" class="swiper-button-next"></div>
          </lcgt-swiper>
        </div>
      </div>
    </div>
    <div class="summary">{{ CompanyInfo.company_introduction }}</div>
    <div v-show="CompanyInfo.main_product" class="line"></div>
    <div v-show="CompanyInfo.main_product" class="summary-sub">
      <div class="label">主营产品</div>
      <div class="value">{{ CompanyInfo.main_product }}</div>
    </div>
    <div v-show="CompanyInfo.address" class="line"></div>
    <div class="summary-sub">
      <div v-show="CompanyInfo.address" class="label">公司地址</div>
      <div v-show="CompanyInfo.address" class="value">
        {{ CompanyInfo.address }}
        <span class="tag-loca">
          <svg-icon icon-class="location_icon" />
          <a
            :href="'https://uri.amap.com/marker?position='+companyLocationInfo.location+'&name='+CompanyInfo.address"
          >地图查看</a>
        </span>
      </div>
    </div>
    <div v-show="CompanyInfo.service_realname" class="line"></div>
    <div class="summary-sub">
      <div v-show="CompanyInfo.service_realname" class="label">联系人</div>
      <div v-show="CompanyInfo.service_realname" class="value">
        <span>{{ CompanyInfo.service_realname }}</span>
        <span class="tag-loca" @click="showPhone">
          <svg-icon icon-class="phone" />
          {{ isShowPhone ? CompanyInfo.mobile : '联系商家' }}
        </span>
        <span v-show="CompanyInfo.phone">办公电话 - {{ CompanyInfo.phone }}</span>
      </div>
    </div>
    <div v-show="CompanyInfo.establishment_date" class="line"></div>
    <div v-show="CompanyInfo.establishment_date" class="summary-sub">
      <div class="label">其他</div>
      <div class="value">
        <span v-show="CompanyInfo.establishment_date">成立日期 - {{ CompanyInfo.establishment_date }}</span>
        &nbsp;
        <span
          v-show="CompanyInfo.registered_capital"
        >注册资本 - {{ CompanyInfo.registered_capital }}万</span>
      </div>
    </div>

    <!-- 我们的优势 -->
    <div v-show="isShowAdv" class="our-power">
      <div class="our-title">我们的优势</div>
      <div class="power-wrapper">
        <div
          v-for="(power, index) in CompanyInfo.company_pic_advantage"
          :key="index"
          class="power-item"
        >
          <el-image
            :src="power.url_domain"
            style="width: 282px; height: 204px"
            :preview-src-list="company_pic_advantage_srcList"
          ></el-image>
          <p>{{ power.remark }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import config from "@/config";
import axios from "axios";
import { mapState } from "vuex";
import Api from "../plugins/api";

export default {
  name: "CompanyIntroduce",
  data() {
    return {
      isShowPhone: false,
      isShowAdv: false,
      showRealImg: false,
      companyLocationInfo: {},
      swiperOption2: {
        slidesPerView: 5,
        spaceBetween: 10,
        freeMode: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      },
      CompanyInfo: {
        comBigImgUrl: "",
      },
      company_pic_advantage_srcList: [],
    };
  },
  computed: {
    ...mapState(["token"]),
  },
  mounted() {},
  methods: {
    getLocation() {
      var url =
        "https://restapi.amap.com/v3/geocode/geo?key=" +
        config.gaoDeKey +
        "&address=" +
        encodeURIComponent(this.CompanyInfo.address);
      axios.get(url).then((res) => {
        this.companyLocationInfo = res.data.geocodes[0];
      });
    },
    showPhone() {
      if (this.token) {
        this.isShowPhone = true;
      } else {
        this.$message.warning("请登录后查看");
      }
    },
    getIntroduce(id) {
      this.$request
        .get(Api.getIntroduce, {
          params: {
            company_id: id,
          },
        })
        .then((res) => {
          if (res.code === 0) {
            this.CompanyInfo = { ...res.data };
            this.getLocation();

            this.company_pic_advantage_srcList =
              this.CompanyInfo.company_pic_advantage.map(
                (item) => item.url_domain
              );
            if (this.CompanyInfo.company_pic_advantage.length > 0) {
              this.isShowAdv = true;
            }
            if (this.CompanyInfo.company_pic.length > 0) {
              this.showRealImg = true;
              this.$set(
                this.CompanyInfo,
                "comBigImgUrl",
                this.CompanyInfo.company_pic[0].url_domain
              );
            } else {
              this.$set(this.CompanyInfo, "comBigImgUrl", "");
            }
          }
        });
    },
    handleClickComImage(url) {
      this.CompanyInfo.comBigImgUrl = url;
    },
  },
};
</script>
<style lang="less">
.company-CompanyInfo {
  h2 {
    font-size: 16px;
    font-family: Microsoft YaHei, Microsoft YaHei-Bold;
    font-weight: 700;
    text-align: left;
    color: #353535;
  }

  .photo {
    .img-wrapper {
      position: relative;
      .big-img {
        // width: 1130px;
        height: 638px;
        .el-image {
          // border: 1px dashed #d5d5d5;
        }
      }

      .small-img {
        width: 100%;
        margin-top: 11px;
        position: absolute;
        bottom: 0;
        padding: 15px;
        box-sizing: border-box;
        background-color: #3535359f;
        .swiper-button-next {
          right: 0;
          background-image: url("@/assets/images/right_icon@2x.png");
        }

        .swiper-button-prev {
          left: 0;
          background-image: url("@/assets/images/left_icon@2x.png");
        }

        :deep(.swiper-container) {
          width: 100%;
        }
      }
    }
  }

  .summary {
    font-size: 14px;
    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
    font-weight: 400;
    text-align: left;
    color: #353535;
    line-height: 24px;
    text-indent: 28px;
    margin: 20px 0;
  }

  .line {
    height: 0px;
    border: 1px solid #e5e5e5;
  }

  .summary-sub {
    display: flex;
    align-items: flex-start;
    margin: 30px 0;

    .label {
      width: 70px;
      margin-right: 40px;
      height: 20px;
      line-height: 20px;
      background: #e5edfc;
      color: #353535;
      font-size: 14px;
      font-family: Microsoft YaHei, Microsoft YaHei-Bold;
      font-weight: 700;
      border-left: 4px solid #4186fa;
      padding-left: 5px;
    }

    .value {
      width: 900px;
      font-size: 14px;
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      font-weight: 400;
      text-align: left;
      color: #353535;
      line-height: 24px;
    }
  }

  .our-power {
    margin-bottom: 60px;

    .our-title {
      height: 40px;
      line-height: 40px;
      font-size: 24px;
      font-family: Microsoft YaHei, Microsoft YaHei-Bold;
      font-weight: 700;
      text-align: left;
      padding-left: 20px;
      color: #353535;
      border-bottom: 2px solid #e5edfc;
      margin-bottom: 20px;
    }

    .power-wrapper {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      width: 100%;
      .power-item {
        width: 25%;
        font-size: 16px;
        font-family: Microsoft YaHei, Microsoft YaHei-Regular;
        font-weight: 400;
        text-align: center;
        color: #353535;
        letter-spacing: 1.92px;
      }
    }
  }
  .tag-loca {
    color: #4186fa;
    margin-right: 20px;
  }
}
</style>
