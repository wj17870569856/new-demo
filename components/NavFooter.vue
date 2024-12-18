<template>
  <div class="nav-footer" >
    <div class="top" v-if="showTop">
      <div class="content">
        <!-- <div class="select flex row-sw">
          <el-select v-model="value1" placeholder="请选择">

          </el-select>
          <el-select v-model="value2" placeholder="请选择">

          </el-select>
          <el-select v-model="value3" placeholder="请选择">

          </el-select>
          <el-select v-model="value4" placeholder="请选择">

          </el-select>
        </div>-->

        <div class="contact_us col-center row-sw">
          <div>
            <h3 class="title">联系我们</h3>

            <ul>
              <li>
                <span>联系名称：</span>
                <span>赣州市智能产业创新研究院</span>
              </li>
              <li>
                <span>官网地址：</span>
                <span>http://admin.ganzhouii.com</span>
              </li>
              <li>
                <span>通讯地址：</span>
                <span>江西省赣州市经开区湖边大道139号院士专家成果转化平台</span>
              </li>
            </ul>
          </div>
          <el-image :src="require('../assets/imgs/erweima.png')" style="width:140px;height:140px"></el-image>
        </div>
      </div>
    </div>
    <div class="bottom row-center col-center" v-if="$route.path !== '/purchaseorder'">赣州市智能产业创新研究院</div>
  </div>
</template>

<script>
export default {
  props: {
    showTop: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      value1: "公共资源交易专业网站",
      value2: "深圳市政府机构网站",
      value3: "广东省政府机构网站",
      value4: "国家部委网站",
    };
  },
};
</script>

<style scoped lang="less">
::v-deep .el-input__inner {
  background-color: transparent;
  color: #fff;
}

.nav-footer {
  min-width: 1300px;
  .top {
    padding: 60px 0;
    background: #28323c;

    .content {
      width: 1200px;
      margin: 0 auto;
    }
  }

  .contact_us {
    .title {
      font-weight: 500;
      font-size: 24px;
      color: #ffffff;
      line-height: 50px;
    }

    ul {
      margin-top: 11px;

      li {
        font-size: 14px;
        color: #8993a5;
        line-height: 29px;
      }
    }
  }

  .bottom {
    font-size: 12px;
    color: #8993a5;
    height: 42px;
    background-color: #fff;
  }
}
</style>