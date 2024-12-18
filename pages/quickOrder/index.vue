<template>
  <div style="background: #ffffff">
    <NavSearch
      :is-use-list="true"
      :show-list="false"
      :keyword-arr="keywordArr"
    ></NavSearch>
    <div class="mian">
      <!--   地址   -->
      <div class="path">
        <span class="index">首页 &nbsp;>&nbsp;</span>
        <span class="quick">询价找货</span>
      </div>
      <!--   快速下单   -->
      <div style="display: flex; justify-content: space-between">
        <div class="box">
          <div class="header">
            <el-image
              style="width: 884px; height: 40px"
              :src="quick"
            ></el-image>
          </div>
          <div class="form">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
              <el-form-item label="收货地点" prop="province">
                <el-cascader
                  v-model="form.province"
                  placeholder="请选择"
                  size="large"
                  style="width: 180px"
                  :options="cityOptions"
                  :props="cityProps"
                >
                </el-cascader>
              </el-form-item>
              <el-form-item label="产品说明" prop="goods_explain">
                <el-input
                  v-model="form.goods_explain"
                  type="textarea"
                  class="form_textarea"
                  placeholder="请输入内容"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="上传附件">
                <div class="img">
                  <el-upload
                    action=""
                    :auto-upload="false"
                    :file-list="form.fileList"
                    class="avatar-uploader"
                    :on-preview="handlePreview"
                    :on-change="chooseImage"
                    :limit="1"
                    :on-exceed="exceedImage"
                    :on-remove="handleRemove"
                  >
                    <el-button size="small" type="primary">点击上传</el-button>
                  </el-upload>
                  <div class="img-desc">
                    支持jpg，png图片,pdf，txt，word，excel，psd，crd，Ai，dwg，cdr文件，压缩包，每个附件仅限15M
                  </div>
                </div>
              </el-form-item>
            </el-form>
            <div class="btn-group">
              <button type="button" class="btn btn-white" @click="cancel">
                取 消
              </button>
              <button
                type="button"
                class="'btn btn-blue'"
                :class="token ? 'btn btn-blue' : 'btn disabled'"
                @click="commit"
              >
                提 交
              </button>
            </div>
          </div>
        </div>
        <div class="msg-list-box">
          <vue-seamless-scroll
            :data="demandData"
            :class-option="virtualListOption"
          >
            <ul class="ul-scroll">
              <li v-for="(item, i) in demandData" :key="i">
                <span class="msg">
                  <span class="username">{{ item.username }}</span>
                  <span>查看询价单</span>
                </span>
                <span class="time">{{ dateFormatter(item.create_time) }}</span>
              </li>
            </ul>
          </vue-seamless-scroll>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { mapState } from "vuex";
import Api from "../../plugins/api";
import NavSearch from "~/components/NavSearch.vue";
import quick from "~/assets/images/quickOrder/quick_order.png";
import config from "~/config";
import axios from "axios";

export default {
  name: "QuickOrder",
  components: { NavSearch },
  data() {
    return {
      quick,
      form: {
        goods_explain: "",
        province: [],
        fileList: [],
      },
      cityOptions: [],
      cityProps: {
        label: "name",
        value: "citycode",
      },
      // 表单验证规则
      rules: {
        province: [
          { required: true, message: "请选择收货地", trigger: "blur" },
        ],
        goods_explain: [{ required: true, message: "请输入", trigger: "blur" }],
      },
      demandData: [],
      keywordArr: [],
    };
  },
  asyncData({ route }) {
    let url = config.baseUrl + Api.getRecommendSearchWordList;
    return axios.all([axios.get(url)]).then(
      axios.spread(function (res) {
        return {
          keywordArr: res.data.data,
        };
      })
    );
  },
  computed: {
    ...mapState(["token", "userInfo"]),

    virtualListOption() {
      return {
        step: 0.4, // 数值越大速度滚动越快
        limitMoveNum: 3, // 开始无缝滚动的数据量 this.bbsData.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 1000, // 单步运动停止的时间(默认值1000ms)
      };
    },
  },
  mounted() {
    this.getCityRegion();
    this.getSupplyOrderLogList();
  },
  methods: {
    getCityRegion() {
      return this.$request
        .get(Api.getCity, { params: { level: 2 } })
        .then((res) => {
          if (res.code === 0) {
            this.cityOptions = res.data;
          }
        });
    },
    getSupplyOrderLogList() {
      this.$request.get(Api.getSupplyOrderLogList).then((res) => {
        this.demandData = res.data;
      });
    },
    dateFormatter(t) {
      t = t * 1000;
      return this.$moment(t).format("HH:mm:ss");
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    exceedImage(files, fileList) {
      if (fileList.length === 1) {
        this.$message.warning("最多上传1个文件");
      }
    },
    handleRemove(file, fileList) {
      this.form.fileList = fileList;
    },
    async chooseImage(file, fileList) {
      const fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1);
      const whiteList = [
        "jpg",
        "png",
        "jpeg",
        "JPG",
        "JPEG",
        "PNG",
        "PDF",
        "pdf",
        "txt",
        "doc",
        "docx",
        "xls",
        "xlsx",
        "psd",
        "crd",
        "Ai",
        "dwg",
        "cdr",
        "zip",
        "rar",
      ];

      if (!whiteList.includes(fileSuffix)) {
        fileList.pop();
        this.$message.error(
          "仅支持jpg，png，jpeg图片,pdf，txt，word，excel，psd，crd，Ai，dwg，cdr，zip，rar文件"
        );
        return false;
      }
      const isLt15M = file.size / 1024 / 1024 <= 15;
      if (!isLt15M) {
        fileList.pop();
        return this.$message.error("上传文件大小不能超过 15MB!");
      }
      // this.form.fileList.push(file)
      // let img = new Image()
      // img.src = file.url
      // img.onload = () => {
      //   const resSize = img.width == 360 && img.height == 360
      //   if (!resSize) {
      //     fileList.pop()
      //     return this.$message.error('上传图片尺寸须等于300px*300px');
      //   }
      // }
      // FormData 对象
      const formData = new FormData();
      // 文件对象
      formData.append("file", file.raw);
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: this.token,
        },
      };
      const res = await this.$request.post(Api.uploadFile, formData, config);
      if (res.success) {
        const { data } = res;
        this.form.fileList.push({
          url: data.filePath,
          name: data.fileName,
        });
      } else {
        this.form.fileList = [];
        this.$message.error(res.msg);
      }
    },
    cancel() {
      this.form = {
        goods_explain: "",
        province: [],
        fileList: [],
      };
    },
    commit() {
      if (!this.token) {
        this.$message.error("请登录");
        this.$router.push({
          path: "/login",
          query: { backPage: this.$route.fullPath },
        });
        return;
      }

      this.$refs.form.validate((valid) => {
        if (!valid) {
          return false;
        }
        const data = {};
        data.goods_explain = this.form.goods_explain;
        data.province_id = this.form.province[0];
        data.city_id = this.form.province[1];
        if (this.form.fileList.length > 0) {
          data.annex = this.form.fileList[0].url;
        } else {
          data.annex = "";
        }

        this.$request.post(Api.simpleOrdersSave, data).then((res) => {
          if (res.code === 0) {
            this.$message.success(res.msg);
            //this.gotoFrom()
          }
        });
      });
    },
    gotoFrom() {
      const query = this.$route.query;
      const path = query && query.from ? query.from : "/";
      this.$router.push(path).catch(() => {});
    },
  },
};
</script>

<style lang="less" scoped>
.mian {
  .path {
    margin-bottom: 25px;
    font-family: Microsoft YaHei, Microsoft YaHei-Regular;

    .index {
      width: 54px;
      height: 16px;
      font-size: 12px;
      font-weight: 400;
      color: #707070;
    }

    .quick {
      width: 48px;
      height: 16px;
      font-size: 12px;
      font-family: Microsoft YaHei, Microsoft YaHei-Bold;
      font-weight: 700;
      color: #353535;
    }
  }

  .box {
    width: 884px;
    height: 460px;
    border: 1px solid #e84b01;
    border-radius: 4px;

    .form {
      width: 700px;
      padding: 30px 28px;

      :deep(.form_textarea) {
        .el-textarea__inner {
          resize: none;
          width: 620px;
          height: 76px;
        }
      }

      .img {
        .img-desc {
          margin-top: 10px;
          color: #999;
          font-size: 12px;
          font-family: Microsoft YaHei, Microsoft YaHei-Regular;
          font-weight: 400;
          color: #656565;
          line-height: 18px;
        }
      }

      .btn-group {
        text-align: right;

        .btn {
          padding: 10px 44px;
          border-radius: 2px;
          border: 0;
          font-size: 14px;
          font-family: Microsoft YaHei, Microsoft YaHei-Regular;
          font-weight: 400;
          text-align: center;
          line-height: 18px;
        }

        .btn:hover {
          cursor: pointer;
        }

        .btn-blue {
          background: #2277e8;
          color: #fff;
          border: 1px solid #2277e8;
        }

        .btn-white {
          background: #fff;
          color: #353535;
          border: 1px solid #d5d5d5;
        }

        .disabled {
          background: #d5d5d5;
          color: #fff;
          border: 1px solid #d5d5d5;
        }
      }
    }
  }

  .msg-list-box {
    width: 284px;
    height: 460px;
    background: #f7f9fd;
    overflow: hidden;

    .ul-scroll {
      li {
        font-size: 14px;
        font-family: Microsoft YaHei, Microsoft YaHei-Regular;
        font-weight: 400;
        text-align: left;
        color: #656565;
        padding: 8px 12px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;

        .username {
          width: 60px;
          display: inline-block;
        }
      }
    }
  }
}
</style>

<style scoped>
.mian {
  width: 1184px;
  margin: 0 auto;
  padding: 8px 0 16px;
}
</style>
