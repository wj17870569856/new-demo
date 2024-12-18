<template>
  <!-- 推荐供应商 -->
  <div class="recommend-company">
    <CommonTitle
      v-if="ShowTitle"
      :title="title"
      :show-more="false"
      @ClickMore="clickMore('推荐供应商')"
    ></CommonTitle>
    <div class="company">
      <a v-for="(company, i) in companyList"
         :key="i"
         :alt="company.company_name"
         :href="config.link_domain + `${company.company_id !== ''?`/company?id=${company.company_id}`:company.url !== ''?company.url:''}`"
         target="_blank"
      >
        <el-image
          style="width: 220px; height: 178px;cursor:pointer;"
          :src="company.cover"
          fit="cover"
          :alt="company.company_name"
          :title="company.company_name"
        ></el-image>
      </a>
    </div>
  </div>
</template>
<script>
export default {
  name: 'RecommendCompany',
  props: {
    ShowTitle: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: '推荐供应商',
    },
    companyList: {
      type: Array,
      default: () => {
        return []
      },
    },
    config: {
      type: Object,
      default: () => {
        return {}
      },
    }
  },
  data() {
    return {}
  },
  methods: {
    gotoCompany(ad) {
      if (ad.company_id !== '') {
        window.open(`/company?id=${ad.company_id}`)
      } else if (ad.url !== '') {
        window.open(ad.url)
      }
    },
  }
}
</script>
<style lang="less" scoped>
//推荐供应商
.recommend-company {
  margin: 0 0;

  .company {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    .el-image {
      margin-bottom: 16px;
    }
  }
}
</style>
