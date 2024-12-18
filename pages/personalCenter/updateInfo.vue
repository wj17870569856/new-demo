<template>
    <!-- 更新资料 -->
    <div class="update-info">

        <div class="info-card">
            <div class="card-title">个人基本信息</div>
            <div class="card-body">
                <div class="item">
                    <div class="label">头像：</div>
                    <el-image :preview-src-list="[info.avatar_url || emptyAvatar]"
                        style="width:64px;height:64px;margin-right: 40px" :src="info.avatar_url || emptyAvatar">
                    </el-image>
                    <div class="value btn-text">
                        <el-upload class="upload-demo" :auto-upload="false" action="" :on-change="uploadPayVoucher"
                            :show-file-list="false">
                            <span class="btn-text">修改 
                                <i class="el-icon-edit"></i>
                            </span>
                        </el-upload>
                    </div>
                </div>
                <div class="item">
                    <div class="label">姓名：</div>
                    <div class="value">
                        <el-input v-if="showInput" v-model="newName" size="medium" placeholder="请输入"
                            style="display: inline-block; width: 150px">
                        </el-input>
                        <span v-else style="width: 100px;display:inline-block">{{ info.realname }}</span>
                        <div v-if="showInput" style="display: inline-block; width: 200px">
                            <span class="sure" @click="sureName">确定</span>
                            <span class="cancel" @click="cancelName">取消</span>
                        </div>
                        <span v-else class="btn-text" @click="updateName">修改
                            <i class="el-icon-edit"></i>
                        </span>
                    </div>
                </div>
                <div class="item">
                    <div class="label">手机号：</div>
                    <div class="value">
                        <span style="width: 100px;display:inline-block">{{ mobile }}</span>
                        <span class="btn-text" @click="updateMobile">修改
                            <i class="el-icon-edit"></i>
                        </span>
                    </div>
                </div>
                <div class="item">
                    <div class="label">登录密码：</div>
                    <div class="value btn-text" @click="updatePassword">
                        <span style="width: 100px;display:inline-block"></span>
                        重置
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>
<script>
import emptyAvatar from "@/assets/images/touxiang.png";
import { mapActions } from "vuex";
import Api from "../../plugins/api";

export default {
    name: "UpdateInfo",
    layout: 'personalCenter',
    data() {
        return {
            emptyAvatar,
            showInput: false,
            newName: "",
            info: {
                mobile: "",
            },
        };
    },
    mounted() {
        this.getUserInfo();
    },
    methods: {
        ...mapActions(["setUserInfo"]),
        uploadPayVoucher(file) {
            const fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1);
            const whiteList = ["jpg", "jpeg", "png", "JPG", "JPEG", "PNG"];

            if (!whiteList.includes(fileSuffix)) {
                this.$message.error("上传文件只能是图片格式");
                return false;
            }

            const formData = new FormData();
            formData.append("file", file.raw, file.name);
            formData.append("dir", "payVoucher");
            const uploadConfig = {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            };

            this.$request
                .post(Api.uploadImage, formData, uploadConfig)
                .then((res) => {
                    if (res.code === 0) {
                        this.$request
                            .post(Api.updatePhoto, { pic: res.data.img_path })
                            .then((res) => {
                                if (res.code === 0) {
                                    this.getUserInfo();
                                    this.$message.success(res.msg);
                                }
                            });
                    } else {
                        this.$message({
                            message: res.msg,
                            type: "error",
                        });
                    }
                });
        },
        getUserInfo() {
            this.$request.get(Api.getUserInfo).then((res) => {
                if (res.code === 0) {
                    this.info = res.data;
                    this.$store.commit('setUserInfo', JSON.stringify(this.info))
                }
            });
        },
        updateName() {
            this.showInput = true;
        },
        updateMobile() {
            this.$router.push({
                path: "/resetMobile",
                query: { mobile: this.info.mobile },
            });
        },
        updatePassword() {
            this.$router.push({
                path: "/resetPwd",
                query: { mobile: this.info.mobile },
            });
        },
        sureName() {
            this.$request
                .post(Api.userEditRealName, { realname: this.newName })
                .then((res) => {
                    if (res.code === 0) {
                        this.$message.success(res.msg);
                        // const userInfo = JSON.parse(this.$Cookies.get('userInfo'))
                        // userInfo.realname = this.newName
                        // "this.$Cookies.set('userInfo', JSON.stringify(userInfo))
                        // this.setUserInfo(JSON.stringify(userInfo))
                        this.info.realname = this.newName;
                        this.showInput = false;
                        window.location.reload();
                    }
                });
        },
        cancelName() {
            this.newName = "";
            this.showInput = false;
        },
    },
    computed: {
        mobile() {
            return (
                this.info.mobile.toString().substr(0, 3) +
                "****" +
                this.info.mobile.toString().substr(7, 4)
            );
        },
    },
};
</script>
<style lang="less" scoped>
.card-title {

    font-weight: bold;
    font-size: 18px;
    color: #0A1833;
    line-height: 21px;
    margin-bottom: 30px;
}

.update-info {
    padding: 20px;
    box-sizing: border-box;
    min-height: 876px;
    background: #FFFFFF;

    .title {
        margin-bottom: 20px;

        .shouye {
            font-size: 20px;
            font-family: Microsoft YaHei, Microsoft YaHei-Regular;
            font-weight: 400;
            text-align: left;
            color: #353535;
        }

        .shouye-sub {
            font-size: 14px;
            font-family: Microsoft YaHei, Microsoft YaHei-Regular;
            font-weight: 400;
            text-align: left;
            color: #2277e8;
        }
    }

    .info-card {





        .card-body {
            .item {
                display: flex;
                align-items: center;

                .label {
                    width: 100px;
                    font-size: 14px;
                    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
                    font-weight: 400;
                    text-align: right;
                    color: #353535;
                    padding: 5px;
                    margin: 8px;
                }

                .value {
                    flex: 1;
                    font-size: 14px;
                    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
                    font-weight: 400;
                    color: #353535;
                }

                .btn-text {
                    font-size: 14px;
                    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
                    font-weight: 400;
                    color: #2277e8;
                    line-height: 18px;
                    cursor: pointer;
                }

                .sure,
                .cancel {
                    width: 80px;
                    height: 40px;
                    background: #2277e8;
                    border: 1px solid #2277e8;
                    border-radius: 2px;
                    color: #fff;
                    padding: 5px 10px;
                    cursor: pointer;
                }

                .cancel {
                    background: #ffffff;
                    color: #000;
                    border: 1px solid #d5d5d5;
                }
            }
        }
    }
}
</style>