<template>
  <div class="main">
    <div class="wrapper-div">
      <div class="wrapper">
        <div style="position: relative">
          <client-only>
            <img :src="img_url" class="company-logo" />
          </client-only>
          <div class="company-level">
            <svg-icon v-if="store_type == 1" icon-class="ziying" />
            <svg-icon v-else-if="store_level == 1" icon-class="lv1" />
            <svg-icon v-else-if="store_level == 2" icon-class="lv2" />
            <svg-icon v-else-if="store_level == 3" icon-class="lv3" />
          </div>
        </div>
        <div class="company-name">{{ company_name }}</div>
      </div>
      <div class="wrapper" style="width: auto;">
        <div class="company-search"></div>
      </div>
    </div>
  </div>
</template>
<script>
import Api from "~/plugins/api";

export default {
  name: "CompanyHeader",
  props: {
    company_name: String,
    img_url: String,
    store_level: Number,
    store_type: Number,
    company_id: [Number, String],
  },
  data() {
    return {
      searchKey: "",
      like: 0,
    };
  },
  methods: {
    likeCom() {
      // 先请求接口，成功了在改色
      const url =
        this.like === 1 ? Api.cancelCompanyCollect : Api.addCompanyCollect;
      this.$request
        .get(url, { params: { cid: this.company_id } })
        .then((res) => {
          const msg = this.like === 1 ? "取消收藏成功" : "收藏成功";
          if (res.code === 0) {
            this.like = this.like === 0 ? 1 : 0;
            this.$message.success(msg);
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    searchCompanyPro() {
      this.$emit("search", this.searchKey);
    },
    clearSearch() {
      this.$emit("clear", this.searchKey);
    },
  },
};
</script>
<style lang="less" scoped>
.main {
  height: 120px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .wrapper-div {
    width: 1200px;
    display: flex;
    justify-content: space-between;

    .wrapper {
      width: 50%;
      display: flex;
      align-items: center;
      position: relative;

      .company-logo {
        width: 80px;
        height: 80px;
        border: 1px solid #efefef;
        border-radius: 2px;
      }

      .company-level {
        font-size: 30px;
        position: absolute;
        left: 45px;
        bottom: -5px;
      }

      .company-name {
        height: 26px;
        font-size: 20px;
        font-family: Microsoft YaHei, Microsoft YaHei-Bold;
        font-weight: 700;
        text-align: left;
        color: #353535;
        margin: 0 10px;
      }

      .company-search {
        :deep(.el-input-group__append) {
          background-color: #2263e8;
          color: #fff;
        }

        display: flex;

        .star {
          width: 100px;
          text-align: center;
          height: 40px;
          line-height: 40px;
          text-align: center;
          background: #ffffff;
          border: 1px solid #d5d5d5;
          border-radius: 4px;
          font-size: 14px;
          margin-left: 20px;
          cursor: pointer;

          &.yellow {
            border: 1px solid #ffb507;
            color: #ffb507;
          }

          .tag-star {
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>
