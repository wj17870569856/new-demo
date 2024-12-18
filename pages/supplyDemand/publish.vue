<!-- 发布货源和设备 -->
<template>
  <div class="wrap">
    <Functional :show="['我的供应','我的需求']" />
    <div class="content">
      <Breadcrumb :list="breadcrumb" />
      <div class="main">
        <div class="publish-form">
          <publishComponent
            :type="type"
            :information_type="information_type"
            @publishBack="back"
            @publishSuccess="publishSuccess"
          ></publishComponent>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import Breadcrumb from "@/components/Breadcrumb";
import publishComponent from "./publishComponent.vue";
import config from "~/config";
import Api from "~/plugins/api";
import axios from "axios";

export default {
  name: "SdPublish",
  layout: "supply",
  components: {
    publishComponent,
    Breadcrumb,
  },
  data() {
    return {
      type: "",
      breadcrumb: [
        {
          name: "供需大厅",
          path: "/supplyDemand",
        },
        {
          name: "发布需求",
        },
      ],
      information_type: "",

      keywordArr: [],
    };
  },
  asyncData({ route, query }) {
    let url = config.baseUrl + Api.getRecommendSearchWordList;
    return axios.all([axios.get(url)]).then(
      axios.spread(function (res) {
        return {
          type: query.type || 1,
          information_type: query.information_type || 1,
          keywordArr: res.data.data,
        };
      })
    );
  },
  mounted() {
    this.type = this.$route.query.type || 1;
    this.information_type = this.$route.query.information_type || 1;
  },
  methods: {
    back() {
      this.$router.back();
    },
    gotoPage(nav) {
      this.$router.push(nav.path);
    },
    publishSuccess() {
      this.$router.back();
    },
  },
};
</script>
<style scoped>
.main {
}
.publish-form {
  padding-bottom: 20px;
}
</style>
