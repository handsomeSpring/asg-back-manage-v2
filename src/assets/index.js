import Vue from 'vue'
import SvgIcon from '../components/SvgIcon.vue'// svg封装地址
 
// register globally
Vue.component('svg-icon', SvgIcon)
//./icons的地址就是存放svg图标的文件地址
 
const req = require.context('./icons', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)