<template>
  <div class="page wrap">
    <el-image fit="contain" :src="require('../../assets/imgs/about_banner.png')" style="width:100%"></el-image>
    <div class="content">
      <div class="desc">
        <div class="left">
          <h3>赣州市产业数据要素共享服务中心简介</h3>
          <p>在赣州市科技创新赋能行动领导小组的指导下，赣州工研院坚持“数据要素×先进制造业集群”的发展主线，与国家级数据交易平台签约挂牌成立江西省首个数据要素共享服务中心（暨赣州市数据要素服务工作站），打造数据要素服务平台和产业模型共享平台，并面向赣州市需求企业免费开放共享，助推赣州打造数字产业化新高地。</p>
        </div>
        <div class="right">
          <div class="company-pic">
            <el-image
              fit="contain"
              style="width: 100%;height:100%"
              :src="require('../../assets/imgs/about_company.png')"
            ></el-image>
          </div>
        </div>
      </div>

      <div class="address">
        <h2 class="title">联系地址</h2>
        <ul class="contact">
          <li>
            <el-image
              fit="contain"
              style="width:16px;height:16px"
              :src="require('../../assets/imgs/about_icon1.png')"
            ></el-image>
            <span>官网地址：ganzhouii.com</span>
          </li>
          <li>
            <el-image
              fit="contain"
              style="width:16px;height:16px"
              :src="require('../../assets/imgs/about_icon2.png')"
            ></el-image>
            <span>企业地址：赣州市院士专家成果转化平台</span>
          </li>
          <li>
            <el-image
              fit="contain"
              style="width:16px;height:16px"
              :src="require('../../assets/imgs/about_icon3.png')"
            ></el-image>
            <span>市场合作：ganyanyuan2019@163.com</span>
          </li>
        </ul>
        <div class="map">
          <div id="map" style="width: 100%;height:100%"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: "index",
  mounted() {
    // let map = new AMap.Map("map", {
    //   //地图容器id名称
    //   zoom: 12, //控制地图首次展示时的缩放等级
    //   center: [114.896554, 25.878309],
    // });
    // const marker = new AMap.Marker({
    //   position: [114.896554, 25.878309],
    //   map: map,
    //   offset: new AMap.Pixel(0, 70),
    // });
    // const icon = new AMap.Icon({
    //   size: new AMap.Size(60, 60),
    //   image: require("../../assets/imgs/location.png"),
    //   imageOffset: new AMap.Pixel(0, 0),
    //   imageSize: new AMap.Size(60, 60),
    // });
    // // 设置标记的样式
    // marker.setIcon(icon);
    // marker.setLabel({
    //   content:
    //     "<div class='map-info'><div class='name'>赣州市院士专家成果转化平台</div><p class='detail'>江西省赣州市章贡区湖边大道139号</p></div>",
    //   offset: new AMap.Pixel(-170, -100),
    // });
    // map.setFitView();
  },
};
</script>
<style lang="less">
.amap-marker-label {
  border: 0;
  background-color: transparent;
}
.map-info {
  width: 270px;
  padding: 20px 0 20px 10px;
  background: linear-gradient(90deg, #257ff8 0%, #0361e9 100%);
  border-radius: 10px 10px 10px 10px;
  .name {
    font-weight: 500;
    font-size: 18px;
    color: #ffffff;
    line-height: 21px;
  }
  .detail {
    font-weight: 400;
    font-size: 14px;
    color: #9dc2f7;
    line-height: 16px;
    margin-top: 10px;
  }
}
</style>
<style scoped lang="less">
.map {
  margin-top: 20px;
  width: 100%;
  height: 269px;
  border-radius: 10px;
  overflow: hidden;
}
.content {
  width: 1300px;
  background: #ffffff;
  box-sizing: border-box;
  margin-top: -45px;
  position: relative;
  z-index: 99;
  border-radius: 10px 10px 0px 0px;
  padding: 30px 35px 21px 40px;
}
.address {
  margin-top: 50px;
  .title {
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
      background: #257ff8;
      position: absolute;
      bottom: -6px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  .contact {
    margin-top: 22px;
    li {
      display: flex;
      align-items: center;
      font-weight: 400;
      font-size: 18px;
      margin-bottom: 8px;
      color: #0a1833;
      line-height: 21px;
      span {
        margin-left: 7px;
      }
    }
  }
}

.desc {
  display: flex;
  .left {
    flex: 1;
    h3 {
      font-family: Source Han Sans CN, Source Han Sans CN;
      font-weight: bold;
      font-size: 24px;
      color: #0a1833;
      line-height: 28px;
      margin-top: 18px;
    }
    p {
      font-family: Source Han Sans CN, Source Han Sans CN;
      font-weight: 400;
      font-size: 18px;
      color: #0a1833;
      line-height: 40px;
      margin-top: 26px;
    }
  }
  .right {
    margin-left: 28px;
    width: 675px;
    .company-pic {
      width: 100%;
      height: 322px;
    }
  }
}
</style>