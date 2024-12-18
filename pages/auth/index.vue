<template>
  <div class="login-auth">
    <p>授权成功----正在登录</p>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import config from "../../config/index";
import Api from '../../plugins/api'
export default {
  name: 'LoginAuth',
  layout: 'loginAuth',
  data() {
    return {
      code: '',
    }
  },
  mounted() {
    this.code = this.$route.query.code
    if (this.code) {
      this.getAuthByCode()
    }
  },
  methods: {
    ...mapMutations(['setToken', 'setUserInfo']),
    // 获取用户信息
    getUserInfo() {
      return this.$request.get(Api.getUserInfo)
    },
    getAuthByCode() {
      // 请求接口，获取用户信息和token
      this.$request
        .post(Api.authUserLogin, { code: this.code })
        .then(async (res) => {
          const { status, access_token,welfare_token } = res.data

          // 处理登录结果
          switch (status) {
            case 1:
              {
                // 正常登录，跳转到首页
                this.setToken(access_token)
                this.$Cookies.set('cloud_token', access_token)
                this.$Cookies.set('welfare_token', welfare_token,{path: '/',domain: config.welfare_domain})
                const userData = await this.getUserInfo()
                const userInfo = userData.data
                this.setUserInfo(JSON.stringify(userInfo))
                // this.$Cookies.set('userInfo', JSON.stringify(userInfo))

                this.$message.success('登录成功')
                this.$router.push('/')
              }
              break
            case 2: // 账号禁用，弹出提示
              this.$message.error('该账号已被禁用')
              break
            case 4: // 待审核-跳转到注册页-待审核
              this.setToken(access_token)
              this.$router.push({ path: '/register', query: { status } })
              break
            default: // 3和5 跳转到注册页-填写公司信息
              this.setToken(access_token)
              this.$Cookies.set('cloud_token', access_token)
              this.$router.push({ path: '/register', query: { status } })
              break
          }
        })
    },
  },
}
</script>
<style scoped>
.login-auth {
  height: 100vh;
  width: 100vw;
  background-color: #fff;
  color: #999;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
