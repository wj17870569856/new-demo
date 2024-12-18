/* eslint-disable */
import Vue from 'vue'
import axios from 'axios'

import config from "@/config";
export const baseURL = config.baseUrl

const instance = axios.create({
  baseURL:baseURL,
  timeout: 10000
})


instance.interceptors.request.use((config) => {
  if (process.browser && window?.$nuxt?.$store?.state?.token) {
    const token = window.$nuxt.$store.state.token
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token
    }
  }
  return config
})

instance.interceptors.response.use((response) => {
  if (response.data.code===401) {
    window.$nuxt.$message.warning('登录过期，请重新登录')
    window.$nuxt.$store.commit('setToken','')
    window.$nuxt.$Cookies.remove('cloud_token')
    window.$nuxt.$Cookies.remove('welfare_token')
    window.$nuxt.$Cookies.remove('userInfo')
    window.$nuxt.$router.push('/login')
  }
  const res = response.data
  return res
})

Vue.prototype.$request = instance
