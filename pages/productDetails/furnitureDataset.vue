<template>
  <div class="wrap">
    <div class="content">
      <h2 class="title">家具数据集</h2>
      <div class="list row-sw">
        <div class="item" v-for="(item,index) in list" :key="index">
          <div class="top" :style="{background:item.titleBackground}">
            <h4 v-for="(titleItem,i) in item.title" :key="i">{{ titleItem }}</h4>
          </div>
          <div class="bottom" :style="{background:item.background}">
            <ul>
              <li v-for="(cate,j) in item.cate" :key="j">
                <h5 class="cate-title col-center" :style="{color:item.color}">
                    <span :style="{borderLeftColor:item.color}" class="dot"></span>
                    {{ cate.title }}
                </h5>
                <p class="cate-desc">{{ cate.content }}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script>
export default {
  data() {
    return {
      list: [
        {
          color: "#428DFF",
          title: ["集群企业", "数据库"],
          titleBackground: "linear-gradient( 90deg, #408CFF 0%, #77AEFC 100%)",
          cate: [
            {
              title: "数据类目:",
              content:
                "南康现代家具产业集群企业数量、规上企业名录、高新技术企业名录、上市企业数量、国家级专精特新“小巨人”企业名录等。",
            },
            {
              title: "数据总量：",
              content: "约1.1万条数据。",
            },
          ],
          background: "rgba(65,141,255,0.1)",
        },

        {
          color: "#1EB689",
          title: ["产业政策文件", "数据库"],
          titleBackground: "linear-gradient( 90deg, #1DB588 0%, #2FCE9F 100%)",
          cate: [
            {
              title: "数据类目:",
              content: "行业指标、集群国际和国内标准、家具相关政策文件等数据。",
            },
            {
              title: "数据总量：",
              content: "约5000条。",
            },
          ],
          background: " rgba(29,181,136,0.1)",
        },

        {
          color: "#676DFF",
          title: ["产品", "数据集"],
          titleBackground: "linear-gradient( 90deg, #666CFF 0%, #7C81FF 100%)",
          cate: [
            {
              title: "数据类目:",
              content:
                "家居 - 家具，包括客厅家具、卧室家具、餐厅家具、儿童家具、办公家具等。",
            },
            {
              title: "数据总量：",
              content: "约15万条（每日新增约4千条）。",
            },
          ],
          background: "rgba(102,108,255,0.1)",
        },
        {
          color: "#00BDF9",
          title: ["客户", "数据集"],
          titleBackground: "linear-gradient( 90deg, #00BDF9 0%, #68DBFF 100%)",
          cate: [
            {
              title: "数据类目:",
              content: "电商平台及跨境电商平台公开数据。",
            },
            {
              title: "数据总量：",
              content: "约6万条（每日新增约1千条）。",
            },
          ],
          background: "rgba(0, 189, 249, 0.1)",
        },
        {
          color: "#676DFF",
          title: ["交易", "数据集"],
          titleBackground: "linear-gradient( 90deg, #666CFF 0%, #7C81FF 100%)",
          cate: [
            {
              title: "数据类目:",
              content: "家具产品交易信息。",
            },
            {
              title: "数据总量：",
              content: "约40万条（每日新增约8千条）。",
            },
          ],
          background: "rgba(102,108,255,0.1)",
        },
        {
          color: "#009FF9",
          title: ["营销", "数据集"],
          titleBackground: "linear-gradient( 90deg, #00BDF9 0%, #68DBFF 100%)",
          cate: [
            {
              title: "数据类目:",
              content: "家具产品营销活动数据",
            },
            {
              title: "数据总量：",
              content: "约4万条（每日新增约800条）。",
            },
          ],
          background: "rgba(0, 189, 249, 0.1)",
        },
        {
          color: "#1EB689",
          title: ["评价", "数据集"],
          titleBackground: "linear-gradient( 90deg, #1DB588 0%, #2FCE9F 100%)",
          cate: [
            {
              title: "数据类目:",
              content: "家具产品及服务评价数据",
            },
            {
              title: "数据总量：",
              content: "约12万条（每日新增约2.5千条）。",
            },
          ],
          background: " rgba(29,181,136,0.1)",
        },
      ],
    };
  },
};
</script>
  
  <style scoped lang="less">
.content {
  background-color: #fff;
  min-height: 876px;
}
h2.title {
  height: 46px;
  font-weight: bold;
  font-size: 34px;
  color: #0a1833;
  line-height: 46px;
  text-align: center;
  padding: 50px 0;
}
.list {
  padding-left: 50px;
  box-sizing: border-box;
  flex-wrap: wrap;
  justify-content: center;
}
.item {
  height: 540px;
  width: 277.5px;
  position: relative;
  margin-right: 30px;
  margin-bottom: 60px;
  .top {
    padding: 20px;
    box-sizing: border-box;
    h4 {
      font-weight: bold;
      font-size: 24px;
      color: #ffffff;
      line-height: 28px;
      text-align: center;
      margin-bottom: 10px;
    }
  }

  .bottom {
    width: 278px;
    height: 430px;
    background: rgba(65, 141, 255, 0.1);
    border-radius: 20px 20px 20px 20px;
    bottom: 0;
    left: 0;
    right: 0;

    position: absolute;
    z-index: 99;
    backdrop-filter: blur(10px); /* 背景模糊 */
    padding: 60px 20px 0;
    box-sizing: border-box;
    .cate-title {
      font-weight: bold;
      font-size: 22px;
      line-height: 30px;
      margin-bottom: 10px;
      position: relative;
      .dot {
        width: 0;
        height: 0;
        display: block;
        border-color: transparent transparent transparent #428dff;
        border-style: solid;
        border-width: 11px 11px 11px 11px;
      }
    }
    .cate-desc {
      font-size: 20px;
      color: #0a1833;
      line-height: 30px;
      margin-bottom: 16px;
    }
  }
  .top {
    top: 0;
    left: 45px;

    position: absolute;
    width: 188px;
    height: 140px;
    background: linear-gradient(90deg, #408cff 0%, #77aefc 100%);
    border-radius: 20px 20px 20px 20px;
  }
}
</style>