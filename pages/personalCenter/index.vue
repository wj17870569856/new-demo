<template>
    <div class="wrap">
        <div class="content">
            <div class="top userInfo flex">
                <el-avatar shape="square" :size="64"
                    :src="userInfo.avatar_url ? userInfo.avatar_url : defaultAvatar"></el-avatar>
                <div class="user-info">
                    <p class="name">
                        {{ userInfo.realname }}
                    </p>
                    <p class="company-name">{{ userInfo.company_name }}</p>
                </div>
                <span class="update-text col-center"
                    @click="$router.push('/personalCenter/updateInfo')"><span>更新个人资料</span><i
                        class="el-icon-arrow-right"></i></span>
            </div>
            <div class="message ">
                <div class="header row-sw">
                    <h2>消息提醒</h2>
                    <div class="fix">
                        <ul>
                            <li class="col-center">
                                <img class="icon" src="../../assets/imgs/icon_read.png" alt="">
                                <span>全部已读</span>
                            </li>
                            <li class="col-center">
                                <img class="icon" src="../../assets/imgs/icon_email.png" alt="">
                                <span>全部未读</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="list row-center col-center">
                    <el-image style="width:300px;height:300px" :src="require('../../assets/imgs/none1.png')"></el-image>
                    <span>暂无消息</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import defaultAvatar from "@/assets/imgs/defaultAvatar.png";
import { mapState } from "vuex";
export default {
    layout: 'personalCenter',
    name: 'personalCenterIndexPage',
    data() {
        return {
            defaultAvatar
        }
    },
    computed: {
        ...mapState(["userInfo"]),
    },
}
</script>

<style scoped lang="less">
.message {
    width: 1020px;
    min-height: 752px;
    background: #FFFFFF;
    padding: 20px;
    box-sizing: border-box;
    margin-top: 20px;

    .list {
        flex-direction: column;


    }

    li {
        margin-bottom: 20px;
        cursor: pointer;
        span {

font-size: 14px;
color: #43546F;
line-height: 16px;

}
        .icon {
            width: 16px;
            height: 16px;
            margin-right: 5px;
        }
    }

}

.update-text {
    cursor: pointer;
    font-size: 14px;
    color: #257FF8;

}

.content {
    width: 1020px;

}

.user-info {
    margin-left: 20px;
    flex: 1;

    .name {
        font-weight: 500;
        font-size: 20px;
        color: #0A1833;

    }

    .company-name {
        font-size: 16px;
        color: #43546F;
        line-height: 19px;
        margin-top: 10px;
    }
}

.top {
    padding: 20px;
    box-sizing: border-box;
    background-color: #fff;

}
</style>