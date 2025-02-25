import Vue from 'vue'
import App from './App.vue'
import VueRouter from  'vue-router'
//引入路由器
import router from '@/router'
Vue.use(VueRouter)
//引入store
import store from '@/store/index'
import ElementUI from 'element-ui';
import FullScreenLoading from '@/components/FullScreenLoading.vue';
import showToast from '@/components/AsgToast/toast.js';
import 'element-ui/lib/theme-chalk/index.css';
import "@/assets/index";
import "@/assets/styles/reset.css";
import "@/assets/styles/font.css";
import '@/assets/styles/theme.css';
// 导入编译器
//导入v-md-edit 插件
import VMdEditor from '@kangc/v-md-editor';
import VMdPreview from '@kangc/v-md-editor/lib/preview';
//导入v-md-edit 插件样式
import '@kangc/v-md-editor/lib/style/base-editor.css';
//导入代码高亮模式，为github模式
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
//导入代码高亮样式
import '@kangc/v-md-editor/lib/theme/style/github.css';
//导入highlightjs
import hljs from 'highlight.js';

import Editor from 'vue2-ace-editor'
// 全局注册filters 
import * as filters from './utils/filters'
import Highlight from '@/utils/directive.js'; // 这里是你项目highlight.js所在路径
import './assets/styles/tailwind.min.css';

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.component('editor', Editor);
Vue.component('full-screen-loading', FullScreenLoading);
//高亮代码行
Vue.use(VMdEditor);
Vue.use(VMdPreview);
Vue.use(Highlight);
VMdPreview.use(githubTheme, {
  Hljs: hljs,
});
VMdEditor.use(githubTheme, {
  Hljs: hljs,
});

import jsPlumb from 'jsplumb';
Vue.prototype.$jsPlumb = jsPlumb.jsPlumb;
//全局使用 v-md-edit 插件
import ButtonFix from "./components/ButtonFix.vue"
Vue.component("ButtonFix",ButtonFix)
Vue.prototype.$toast = showToast;
//配置v-md-edit插件的代码高亮为github模式，使用highlight.js

// Vue.use(SlideVerify);
Vue.use(ElementUI);

// import introJS from 'intro.js'
// import 'intro.js/introjs.css'
// Vue.prototype.$intro = introJS


Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
