// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/css/global.css'
import ElementUI from 'element-ui'
// 导入elementUI的样式表
import 'element-ui/lib/theme-chalk/index.css'
//导入qs组件
import qs from 'qs';
Vue.prototype.qs = qs;

// 导入element-ui  Message组件
import {Message} from 'element-ui'
Vue.prototype.$message = Message

// 导入axios
import axios from 'axios'
Vue.prototype.$http = axios

//配置请求的根路径
axios.defaults.baseURL = "http://127.0.0.1:9000/";
// Vue.prototype.$qs = qs;

Vue.use(ElementUI);
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
