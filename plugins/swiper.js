import Vue from 'vue'
// 引用组件
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'

// 注册全局组件，组建名为svg-icon
Vue.component('LcgtSwiper', swiper)
Vue.component('LcgtSwiperSlide', swiperSlide)
