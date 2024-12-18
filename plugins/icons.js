import Vue from 'vue'
// 引用组件
import SvgIcon from '@/components/SvgIcon.vue'

// 注册全局组件，组建名为svg-icon
Vue.component('SvgIcon', SvgIcon)

// 引用svg图标
const requireAll = (requireContext) => requireContext.keys().map(requireContext)
const req = require.context('@/assets/icons', true, /\.svg$/)
requireAll(req)
