<!-- 发布运力供需信息 -->
<template>
  <div>
    <NavSearch :show-list="false" :keywordArr="keywordArr"></NavSearch>
    <div class="main">
      <div class="publish-form">
        <publishCarComponent :information_type="information_type" :type="3">
          <div slot="nav" class="h-nav">
            <span v-for="(nav, index) in breadcrumb" :key="index" @click="gotoPage(nav)"
            >{{ nav.name }}
              <svg-icon
                icon-class="more_icon"
              />
            </span>
            <span>{{ information_type == 1 ? '发布需求' : '发布供应' }}</span>
          </div>
        </publishCarComponent>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import NavSearch from '../../components/NavSearch.vue'
import publishCarComponent from './publishCarComponent.vue'
import config from "~/config";
import Api from "~/plugins/api";
import axios from "axios";

export default {
  name: 'SdPublish',
  components: {
    NavSearch,
    publishCarComponent,
  },
  data() {
    return {
      information_type: 1, // 发布供应还是需求
      type: 3,
      breadcrumb: [
        {name: '首页', path: '/'},
        {name: '供需大厅', path: '/supplyDemand'},
        {name: '货源车源', path: '/supplyDemand/list?type=3&information_type=1'},
      ],
      keywordArr: []
    }
  },
  asyncData({route}) {
    let url = config.baseUrl + Api.getRecommendSearchWordList
    return axios.all([
      axios.get(url),
    ]).then(axios.spread(function (res) {
        return {
          keywordArr: res.data.data
        }
      })
    )
  },
  mounted() {
    this.information_type = +this.$route.query.information_type
  },
  methods: {
    gotoPage(nav) {
      this.$router.push(nav.path)
    },

  },
}
</script>

<style scoped lang="less">
.main {
  background-color: #fff;
  box-shadow: 0px 8px 16px 0px rgba(23, 36, 63, 0.1) inset;
}

.publish-form {
  width: 1184px;
  margin: 0 auto;
  position: relative;
  padding-bottom: 120px;
}
</style>
