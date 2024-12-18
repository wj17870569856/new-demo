<template>
  <div class="wrap">
    <div class="content">
      <h2 class="title">红色数据集</h2>
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
            color:'#428DFF',
          title: ["大模型测评", "语料数据集"],
          titleBackground: "linear-gradient( 90deg, #408CFF 0%, #77AEFC 100%)",
          cate: [
            {
              title: "数据类目:",
              content:
                "心理健康（变态心理、道德心理、健康心理、社会心理、发展心理）、法律法规（刑法、民法、国籍法、商法）、政治敏感（政治学基本理论、政治思想、政治体制、国家治理等）三大类。",
            },
            {
              title: "数据总量：",
              content: "78522组红色语料采集。",
            },
          ],
          background: "rgba(65,141,255,0.1)",
        },

        {
            color:'#1EB689',
          title: ["实时社会热点", "数据库"],
          titleBackground: "linear-gradient( 90deg, #1DB588 0%, #2FCE9F 100%)",
          cate: [
            {
              title: "数据类目:",
              content:
                "时事政治、热点新闻与重点行业的最新资讯问题等，如领导重要讲话、外交部记者会、国内重点新闻等内容。",
            },
            {
              title: "数据总量：",
              content: "近八万条数据。",
            },
          ],
          background: " rgba(29,181,136,0.1)",
        },

        {
            color:'#676DFF',
          title: ["政策", "汇总库"],
          titleBackground: "linear-gradient( 90deg, #666CFF 0%, #7C81FF 100%)",
          cate: [
            {
              title: "数据类目:",
              content:
                "国家级、北上广深等一线城市、国内部分省会城市和地级市对社会公开的政策。",
            },
            {
              title: "数据总量：",
              content: "约六万余篇。",
            },
          ],
          background: "rgba(102,108,255,0.1)",
        },
        {
            color:'#00BDF9',
          title: ["红色文旅", "数据库"],
          titleBackground: "linear-gradient( 90deg, #00BDF9 0%, #68DBFF 100%)",
          cate: [
            {
              title: "数据类目:",
              content:
                "红色旧址、红色VR内容、红色人物、红色事件、红色图片、红色问答、红色视频、红色书籍、红色歌曲、红色诗词等十大类红色素材。",
            },
            {
              title: "数据总量：",
              content: "一万余条红色数据，共101.27GB存储量。",
            },
          ],
          background: "rgba(0, 189, 249, 0.1)",
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
  padding: 0 50px;
  box-sizing: border-box;
}
.item {
  height: 600px;
  width: 277.5px;
  position: relative;

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
    height: 490px;
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
        border-color: transparent transparent transparent transparent;
        border-style: solid;
        border-width: 11px;
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